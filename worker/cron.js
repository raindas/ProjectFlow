const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { toZonedTime, format } = require('date-fns-tz');
// Ensure these paths match your actual folder structure
const { getOwnerDigestStats } = require('../backend/services/digestService');
const { sendEmail, getDigestTemplate } = require('../backend/services/emailService');

const prisma = new PrismaClient();

console.log('⏱️ ProjectFlow Worker started. Monitoring tasks...');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  console.log(`\n🔍 Checking reminders at ${now.toISOString()}...`);

  try {
    // 1. UPCOMING REMINDERS
    const upcomingTasks = await prisma.tasks.findMany({
      where: {
        Status: { not: 'Completed' },
        DeletedAt: null,
        NotifiedUpcomingAt: null,
        DueDate: {
          gt: now,
          lte: new Date(now.getTime() + 60 * 60 * 1000)
        }
      }
    });

    for (const task of upcomingTasks) {
      // Use the REAL sendEmail with an object
      await sendEmail({
        to: task.AssignedEmail,
        subject: `Upcoming Task: ${task.TaskTitle}`,
        html: `<p>Friendly reminder: <b>${task.TaskTitle}</b> is due in less than an hour!</p>`
      });
      
      await prisma.tasks.update({
        where: { TaskID: task.TaskID },
        data: { NotifiedUpcomingAt: now }
      });
    }

    // 2. OVERDUE REMINDERS
    const overdueTasks = await prisma.tasks.findMany({
      where: {
        Status: { not: 'Completed' },
        DeletedAt: null,
        NotifiedOverdueAt: null,
        DueDate: { lt: now }
      }
    });

    for (const task of overdueTasks) {
      await sendEmail({
        to: task.AssignedEmail,
        subject: `Overdue Task: ${task.TaskTitle}`,
        html: `<p style="color: red;">Heads up! <b>${task.TaskTitle}</b> was due and hasn't been completed yet.</p>`
      });

      await prisma.tasks.update({
        where: { TaskID: task.TaskID },
        data: { NotifiedOverdueAt: now }
      });
    }

    // 3. DAILY DIGEST LOGIC
    const usersToNotify = await prisma.settings.findMany({
      where: { EmailEnabled: true }
    });

    for (const user of usersToNotify) {
      const userTime = toZonedTime(now, user.TimeZone);
      const currentTimeString = format(userTime, 'HH:mm', { timeZone: user.TimeZone });
      const todayDateString = format(userTime, 'yyyy-MM-dd', { timeZone: user.TimeZone });

      if (currentTimeString === user.DailyDigestTime && user.LastDigestSentAt !== todayDateString) {
        // Assuming your getOwnerDigestStats is properly exported in digestService.js
        const stats = await getOwnerDigestStats(user.OwnerEmail); 
        const html = getDigestTemplate(stats);
        
        console.log(`Sending Daily Digest to ${user.OwnerEmail}...`);
        
        await sendEmail({
          to: user.OwnerEmail,
          subject: `Daily Digest: ${stats.dueToday} tasks due today`,
          html: html
        });

        await prisma.settings.update({
          where: { SettingID: user.SettingID }, // Use your unique ID field here
          data: { LastDigestSentAt: todayDateString }
        });
      }
    }

  } catch (error) {
    console.error('❌ Worker Error:', error);
  }
});