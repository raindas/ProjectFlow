import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        DailyDigestTime: '08:00',
        TimeZone: 'UTC',
        EmailEnabled: true
    });
    const userEmail = localStorage.getItem('pf_user_email');
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/settings/${userEmail}`)
            .then(res => res.json())
            .then(data => data && setSettings(data));
    }, []);

    const handleSave = async () => {
        await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/settings/${userEmail}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dailyDigestTime: settings.DailyDigestTime,
                timeZone: settings.TimeZone,
                emailEnabled: settings.EmailEnabled
            })
        });
        alert("Settings saved!");
    };

    const handleTestEmail = async () => {
        setIsTesting(true);
        console.log("Testing :", import.meta.env.VITE_BASE_BACKEND_URL);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/settings/test-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Check your inbox! 📬");
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            alert("Could not reach the server. -> " + err.message);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="bg-white border rounded-2xl p-6 space-y-8 shadow-sm">
                <section>
                    <h3 className="text-lg font-semibold mb-4">Daily Digest</h3>
                    <div className="flex items-center justify-between mb-4">
                        <span>Enable Email Notifications</span>
                        <input
                            type="checkbox"
                            checked={settings.EmailEnabled}
                            onChange={e => setSettings({ ...settings, EmailEnabled: e.target.checked })}
                            className="w-5 h-5 accent-black"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Delivery Time</label>
                            <input
                                type="time"
                                value={settings.DailyDigestTime}
                                onChange={e => setSettings({ ...settings, DailyDigestTime: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Your Timezone</label>
                            <select
                                value={settings.TimeZone}
                                onChange={e => setSettings({ ...settings, TimeZone: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="UTC">UTC</option>
                                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                                <option value="America/New_York">New York (EST)</option>
                                <option value="Europe/London">London (GMT)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h4 className="font-medium">Verify SMTP</h4>
                            <p className="text-xs text-gray-500">Send a test email to {userEmail}</p>
                        </div>
                        <button
                            onClick={handleTestEmail}
                            disabled={isTesting}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isTesting ? 'bg-gray-300' : 'bg-white border hover:bg-gray-100'
                                }`}
                        >
                            {isTesting ? 'Sending...' : 'Send Test'}
                        </button>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;