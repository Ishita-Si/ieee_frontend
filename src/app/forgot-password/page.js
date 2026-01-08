"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.forgotPassword(email.trim().toLowerCase());
      
      if (result.success) {
        setSuccess(result.message || 'If an account with that email exists, a password reset link has been sent to your email.');
      } else {
        setError(result.error || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
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
          <Link 
            href="/signin" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <p className="text-xs uppercase tracking-[0.65em] text-white/60">Password Recovery</p>
          <h1 className="text-4xl font-semibold">Forgot Password?</h1>
          <p className="text-white/70">
            Enter your email address and we'll send you a link to reset your password.
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

        {!success && (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        <p className="text-center text-white/60 text-sm">
          Remember your password?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}


