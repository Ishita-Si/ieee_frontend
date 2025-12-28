"use client"
import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '@/lib/auth';

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    college: '',
    branch: '',
    year: '',
    roll_no: '',
    password: '',
    confirmPassword: '',
    membership_type: '', // 'ieee_member' or 'non_member'
    membership_code: '', // Required for IEEE members
  });
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setStep('form');
      setFormData({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        college: '',
        branch: '',
        year: '',
        roll_no: '',
        password: '',
        confirmPassword: '',
        membership_type: '',
        membership_code: '',
      });
      setOtpCode('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(
        formData.email.trim().toLowerCase(), 
        formData.password, 
        rememberMe
      );
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.reload();
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

  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!formData.full_name || formData.full_name.trim().length < 2) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!formData.phone_number || formData.phone_number.trim().length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (!formData.college || formData.college.trim().length < 2) {
      setError('Please enter your college name');
      setLoading(false);
      return;
    }

    if (!formData.branch) {
      setError('Please select your branch');
      setLoading(false);
      return;
    }

    if (!formData.year) {
      setError('Please select your year');
      setLoading(false);
      return;
    }

    if (!formData.roll_no || formData.roll_no.trim().length < 1) {
      setError('Please enter your roll number');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate membership type
    if (!formData.membership_type) {
      setError('Please select your membership type');
      setLoading(false);
      return;
    }

    // Validate membership code for IEEE members
    if (formData.membership_type === 'ieee_member' && !formData.membership_code) {
      setError('Membership code is required for IEEE members');
      setLoading(false);
      return;
    }

    // Non-members should not provide membership code
    if (formData.membership_type === 'non_member' && formData.membership_code) {
      setError('Membership code should not be provided for non-members');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        username: formData.username.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number?.trim() || '',
        college: formData.college.trim(),
        branch: formData.branch,
        year: formData.year,
        roll_no: formData.roll_no.trim(),
        password: formData.password,
        membership_type: formData.membership_type,
        membership_code: formData.membership_type === 'ieee_member' ? formData.membership_code.trim() : null,
        role: 'user'
      });

      if (result.success) {
        setStep('otp');
        setSuccess('Registration initiated! Please check your email for the OTP code.');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.completeRegistration(
        formData.email.trim().toLowerCase(), 
        otpCode
      );

      if (result.success) {
        setStep('success');
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => {
          onSwitchMode();
          setStep('form');
        }, 2000);
      } else {
        setError(result.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.resendOTP(
        formData.email.trim().toLowerCase(), 
        'registration'
      );
      
      if (result.success) {
        setSuccess('OTP resent successfully! Please check your email.');
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 py-10 overflow-y-auto">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#120026]/90 via-[#0f0620]/92 to-[#0b0b25]/95 shadow-[0_30px_120px_rgba(59,130,246,0.35)] my-auto">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-purple-500/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-40 rounded-full bg-white/10 p-2 text-white transition-all duration-300 hover:bg-white/20 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid h-full w-full lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative flex flex-col justify-center px-6 py-10 md:px-10 lg:px-12">
            <div className="absolute inset-y-10 right-0 w-[1px] bg-gradient-to-b from-white/5 via-purple-400/20 to-white/5" />
            <div className="relative z-10 mx-auto w-full max-w-md space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-200/80">
                  {step === 'otp' ? 'VERIFY EMAIL' : step === 'success' ? 'SUCCESS' : mode === 'login' ? 'SIGN IN' : 'JOIN IEEE'}
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {step === 'otp' 
                    ? 'Enter Verification Code' 
                    : step === 'success'
                    ? 'Registration Successful!'
                    : mode === 'login' 
                    ? 'Welcome back to IEEE' 
                    : 'Embark on your IEEE journey'}
                </h2>
                <p className="text-sm text-purple-100/80 md:text-base">
                  {step === 'otp'
                    ? 'We sent a 6-digit code to your email. Please enter it below.'
                    : step === 'success'
                    ? 'Your account has been created successfully!'
                    : mode === 'login' 
                    ? 'Access exclusive events, hackathons, and the community.' 
                    : 'Create your IEEE account and unlock member-only opportunities.'}
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

              {step === 'form' && (
                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          placeholder="Choose a username"
                          required
                          minLength={3}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Full name
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-100/90">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Membership Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, membership_type: 'ieee_member', membership_code: '' });
                              setError('');
                            }}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              formData.membership_type === 'ieee_member'
                                ? 'border-purple-400/60 bg-purple-500/20 text-white'
                                : 'border-white/10 bg-white/5 text-purple-100/80 hover:border-white/20'
                            }`}
                          >
                            IEEE Member
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, membership_type: 'non_member', membership_code: '' });
                              setError('');
                            }}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              formData.membership_type === 'non_member'
                                ? 'border-purple-400/60 bg-purple-500/20 text-white'
                                : 'border-white/10 bg-white/5 text-purple-100/80 hover:border-white/20'
                            }`}
                          >
                            Non-Member
                          </button>
                        </div>
                      </div>

                      {formData.membership_type === 'ieee_member' && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-purple-100/90">
                            Membership Code <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="membership_code"
                            value={formData.membership_code}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            placeholder="Enter your IEEE membership code"
                            required
                          />
                          <p className="mt-1 text-xs text-purple-200/60">
                            Contact admin to get your membership code
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          placeholder="Enter mobile number"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          College Name
                        </label>
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          placeholder="Enter your college name"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Branch
                        </label>
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          required
                        >
                          <option value="">Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="CSD">CSD</option>
                          <option value="ECE">ECE</option>
                          <option value="EV">EV</option>
                          <option value="MnC">MnC</option>
                          <option value="IT">IT</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Chemical">Chemical</option>
                          <option value="Petroleum">Petroleum</option>
                          <option value="Civil">Civil</option>
                          <option value="Biotech">Biotech</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Year
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          required
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-purple-100/90">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="roll_no"
                          value={formData.roll_no}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                          placeholder="Enter your roll number"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-100/90">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      placeholder={mode === 'login' ? 'Enter your password' : 'Create a secure password'}
                      required
                      minLength={6}
                    />
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-purple-100/90">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/40"
                      />
                      <label htmlFor="remember" className="text-sm text-purple-100/80">
                        Remember me
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_20px_60px_rgba(147,51,234,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="relative flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                      </span>
                    ) : (
                      <>
                        <span className="absolute inset-0 animate-[pulse_5s_ease-in-out_infinite] bg-white/20" />
                        <span className="relative">{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-purple-100/90">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setError('');
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-mono tracking-widest text-white placeholder-purple-200/60 transition ring-offset-0 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="relative mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_20px_60px_rgba(147,51,234,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="relative flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <span className="absolute inset-0 animate-[pulse_5s_ease-in-out_infinite] bg-white/20" />
                        <span className="relative">Verify Email</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full text-sm text-purple-200/80 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                  <p className="text-lg text-white">Your account has been created successfully!</p>
                  <p className="text-sm text-purple-100/80">Redirecting to login...</p>
                </div>
              )}

              {step === 'form' && (
                <div className="text-center text-sm text-purple-100/80">
                  {mode === 'login' ? "New to IEEE? " : "Already a member? "}
                  <button
                    onClick={onSwitchMode}
                    className="relative font-semibold text-purple-200 transition-colors duration-300 hover:text-white"
                  >
                    <span className="relative z-10">{mode === 'login' ? 'Create an account' : 'Sign in to your account'}</span>
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-l-3xl border-l border-white/10 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-black/70 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.45),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.35),transparent_55%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_35%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
            <div className="pointer-events-none absolute bottom-6 left-1/2 w-[80%] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/40 px-6 py-5 text-center text-sm text-purple-100/85 backdrop-blur-lg">
              <p className="text-xs uppercase tracking-[0.35em] text-purple-300/80">IEEE Student Branch</p>
              <p className="mt-2 text-base font-semibold text-white">Innovate • Collaborate • Lead</p>
              <p className="mt-1 text-xs text-purple-100/70">Join global engineers building future-ready solutions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
