'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SuperadminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Call superadmin API route with entered credentials
      const response = await fetch('/api/superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Login normally using existing auth
        const result = await signIn('credentials', {
          phone: phone,
          password: password,
          redirect: false,
        });

        if (result?.ok) {
          window.location.href = '/dashboard';
        } else {
          setMessage('Login failed');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Superadmin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter superadmin credentials to create account and login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 p-3 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Validating...' : 'Validate & Login'}
          </button>

          {message && (
            <p className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'
              }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
} 