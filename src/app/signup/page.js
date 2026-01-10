"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";
import { Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, School, GraduationCap, Layers, BookOpen, Hash } from "lucide-react";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    username: "",
    full_name: "",
    email: "", 
    phone_number: "",
    college: "",
    branch: "",
    year: "",
    roll_no: "",
    password: "",
    confirmPassword: "",
    membership_type: "",
    membership_code: "",
    designation: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (1MB max)
      if (file.size > 1 * 1024 * 1024) {
        setError('Image size must be less than 1MB');
        return;
      }

      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!form.username || form.username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!form.full_name || form.full_name.trim().length < 2) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!form.email || !form.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!form.phone_number || form.phone_number.trim().length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (!form.college || form.college.trim().length < 2) {
      setError('Please enter your college name');
      setLoading(false);
      return;
    }

    if (!form.branch) {
      setError('Please select your branch');
      setLoading(false);
      return;
    }

    if (!form.year) {
      setError('Please select your year');
      setLoading(false);
      return;
    }

    if (!form.roll_no || form.roll_no.trim().length < 1) {
      setError('Please enter your roll number');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!form.membership_type) {
      setError('Please select your membership type');
      setLoading(false);
      return;
    }

    // Profile picture is mandatory
    if (!profilePicture) {
      setError('Profile picture is required');
      setLoading(false);
      return;
    }

    // Note: IEEE membership ID will be auto-generated on the backend
    // No need to require membership_code anymore

    // Validate designation for IEEE members
    if (form.membership_type === 'ieee_member' && !form.designation) {
      setError('Please select your designation');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone_number: form.phone_number.trim(),
        college: form.college.trim(),
        branch: form.branch,
        year: form.year,
        roll_no: form.roll_no.trim(),
        password: form.password,
        membership_type: form.membership_type,
        designation: form.membership_type === 'ieee_member' ? form.designation : null,
        membership_code: form.membership_type === 'ieee_member' && form.membership_code ? form.membership_code.trim() : null,
        role: 'user'
      }, profilePicture);

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
    setLoading(true);
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.completeRegistration(
        form.email.trim().toLowerCase(), 
        otpCode
      );

      if (result.success) {
        // Token is already set by authService.completeRegistration
        if (result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user));
        }
        setStep('success');
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
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

    try {
      const result = await authService.resendOTP(
        form.email.trim().toLowerCase(), 
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
    <div className="min-h-screen bg-black text-white">
      <PillNav items={navItems} />
      <main className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.65em] text-white/60">Join IEEE RGIPT</p>
          <h1 className="text-4xl font-semibold">Create your membership profile</h1>
          <p className="text-white/70">
            Fill in your details to create your profile. Once registered, you can login and register for events directly.
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
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6 shadow-[0_30px_120px_rgba(15,23,42,0.4)]"
          >
            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label htmlFor="profile_picture" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Picture <span className="text-red-400">*</span> (Max 1MB)
              </label>
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="profile_picture" 
                  className="flex-1 cursor-pointer rounded-2xl bg-black/60 border-2 border-dashed border-white/30 hover:border-purple-400/60 transition-colors px-4 py-6 flex flex-col items-center justify-center gap-2"
                >
                  <input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  {profilePicture ? (
                    <span className="text-white font-medium">{profilePicture.name}</span>
                  ) : (
                    <>
                      <div className="text-purple-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-white/70 text-sm">Click to upload profile picture</span>
                    </>
                  )}
                </label>
                {profilePicturePreview && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-400/60 flex-shrink-0">
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50">Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="Choose a username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
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
                <label htmlFor="phone_number" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="college" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                <School className="w-4 h-4" />
                College Name
              </label>
              <input
                id="college"
                name="college"
                type="text"
                value={form.college}
                onChange={handleChange}
                required
                className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                placeholder="Rajiv Gandhi Institute of Petroleum Technology"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="branch" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Branch
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
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

              <div className="space-y-2">
                <label htmlFor="year" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="roll_no" className="text-sm uppercase tracking-[0.35em] text-white/60 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Roll Number
                </label>
                <input
                  id="roll_no"
                  name="roll_no"
                  type="text"
                  value={form.roll_no}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="Enter roll number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm uppercase tracking-[0.35em] text-white/60">
                Membership Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, membership_type: 'ieee_member', membership_code: '' });
                    setError('');
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    form.membership_type === 'ieee_member'
                      ? 'border-purple-400/60 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-black/60 text-white/80 hover:border-white/20'
                  }`}
                >
                  IEEE Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, membership_type: 'non_member', membership_code: '' });
                    setError('');
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    form.membership_type === 'non_member'
                      ? 'border-purple-400/60 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-black/60 text-white/80 hover:border-white/20'
                  }`}
                >
                  Non-Member
                </button>
              </div>
            </div>

            {form.membership_type === 'ieee_member' && (
              <div className="space-y-2">
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-3">
                  <p className="text-sm text-purple-300">
                    <strong>IEEE Membership ID will be automatically generated</strong> upon successful registration.
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Your unique IEEE membership ID will be assigned and displayed on your profile and ID card.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="designation" className="text-sm uppercase tracking-[0.35em] text-white/60">
                    Designation <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  >
                    <option value="">Select Designation</option>
                    <option value="Joint_Sec">Joint Secretary</option>
                    <option value="Design">Design</option>
                    <option value="Audit">Audit</option>
                    <option value="Editorial">Editorial</option>
                    <option value="WIE">WIE</option>
                    <option value="ComSoc">ComSoc</option>
                    <option value="RAS">RAS</option>
                    <option value="CS">CS</option>
                    <option value="CS_Head">CS Head</option>
                    <option value="EVENT">Event</option>
                    <option value="CNM">CNM</option>
                    <option value="Member">Member</option>
                  </select>
                  <p className="text-xs text-white/50">Select your team/designation in IEEE Student Branch</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="membership_code" className="text-sm uppercase tracking-[0.35em] text-white/60">
                    Existing Membership Code (Optional)
                  </label>
                  <input
                    id="membership_code"
                    name="membership_code"
                    type="text"
                    value={form.membership_code}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                    placeholder="If you have an existing IEEE membership code (optional)"
                  />
                  <p className="text-xs text-white/50">Only fill this if you already have an IEEE membership code</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
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
                  minLength={6}
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="Create a password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 focus:outline-none focus:border-white text-white"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form
            onSubmit={handleVerifyOTP}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6 shadow-[0_30px_120px_rgba(15,23,42,0.4)]"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Enter Verification Code</h2>
              <p className="text-white/70">
                We sent a 6-digit code to <strong>{form.email}</strong>. Please enter it below.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm uppercase tracking-[0.35em] text-white/60">
                Enter 6-digit OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:border-white"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full text-sm text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              Didn't receive code? Resend OTP
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6 shadow-[0_30px_120px_rgba(15,23,42,0.4)] text-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-2xl font-semibold">Registration Successful!</h2>
            <p className="text-white/70">
              Your account has been created successfully. Redirecting to login...
            </p>
          </div>
        )}

        {step === 'form' && (
          <p className="text-center text-white/60 text-sm">
            Already registered?{" "}
            <Link href="/signin" className="underline hover:text-white transition">
              Sign in
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}

