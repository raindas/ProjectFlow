import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setSent(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">Welcome to ProjectFlow</h2>
        <p className="text-gray-500 mb-6">Enter your email to receive a magic login link.</p>
        
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition">
              Send Magic Link
            </button>
          </form>
        ) : (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100">
            ✅ Check your server console (terminal) for the link!
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;