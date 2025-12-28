"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function SigninPage() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');

  useEffect(() => {
    // Get redirect URL from query params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        setRedirectUrl(redirect);
      }
    }
  }, []);
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!form.email || !form.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!form.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(
        form.email.trim().toLowerCase(), 
        form.password, 
        rememberMe
      );
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          // Redirect to dashboard or redirect URL
          router.push(redirectUrl);
        }, 1000);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PillNav items={navItems} />
      <main className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.65em] text-white/60">Member login</p>
          <h1 className="text-4xl font-semibold">Access your IEEE portal</h1>
          <p className="text-white/70">
            Sign in to review membership status, download invoices, and resume the payment flow once Razorpay is
            connected.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6 shadow-[0_30px_120px_rgba(15,23,42,0.4)]"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm uppercase tracking-[0.35em] text-white/60">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm uppercase tracking-[0.35em] text-white/60">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-white/20 bg-black/60 text-purple-500 focus:ring-purple-500/40"
            />
            <label htmlFor="remember" className="text-sm text-white/80">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm">
          Need an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}

