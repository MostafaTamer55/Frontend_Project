import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createResetToken } from '../utils/resetToken';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordPage = () => {
  // State
  const [step, setStep] = useState('input'); // 'input' | 'sent'
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle email submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFieldError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setFieldError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // 1. Generate token and store state (valid for 15 minutes)
    const tokenData = createResetToken(cleanEmail, 15);
    const resetUrl = `${window.location.origin}/reset-password?token=${encodeURIComponent(
      tokenData.token
    )}&email=${encodeURIComponent(cleanEmail)}`;

    // 2. Dispatch real email with clickable link to user's inbox
    const emailPayload = {
      _subject: 'DSP Platform - Reset Your Password',
      _captcha: 'false',
      _template: 'box',
      email: cleanEmail,
      reset_password_link: resetUrl,
      message: `You requested a password reset for your DSP Platform account.\n\nClick the link below to set your new password:\n${resetUrl}\n\nNote: This link is valid for 15 minutes.`,
    };

    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    // 3. Transition to "Check your email" screen
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
    }, 450);
  };

  // -------------------------------------------------------------
  // VIEW 1: Input Screen (screen/auth/forgot-password/default)
  // -------------------------------------------------------------
  if (step === 'input') {
    return (
      <div className="w-full flex flex-col justify-center">
        {/* Title & Description */}
        <div className="mb-6">
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight">
            Forgot password?
          </h2>
          <p className="text-[13px] sm:text-sm text-[#5B717B] mt-2 leading-relaxed">
            Enter the email for your account and we will send you reset instructions.
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="reset-email"
              className="block text-xs font-semibold text-[#15313C] mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                  fieldError ? 'text-[#E5484D]' : 'text-[#8C9FA8]'
                }`}
              >
                <Mail className="w-4 h-4 stroke-[1.75]" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                placeholder="name@example.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                  fieldError
                    ? 'border-[#E5484D] bg-[#FFF5F5] focus:border-[#E5484D] focus:ring-2 focus:ring-[#E5484D]/20'
                    : 'border-[#D7E0E3] bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 hover:border-[#B5C2C7]'
                }`}
              />
            </div>
            {fieldError && (
              <p className="mt-1.5 text-xs text-[#E5484D] font-medium">{fieldError}</p>
            )}
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span>Sending instructions...</span>
            ) : (
              <>
                <span>Send reset link</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2]" />
              </>
            )}
          </button>
        </form>

        {/* Back to login link */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#15313C] hover:opacity-75 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: Sent Screen (screen/auth/forgot-password/sent)
  // Exact 100% Clean Figma Design
  // -------------------------------------------------------------
  return (
    <div className="w-full flex flex-col justify-center">
      {/* Soft rounded squircle checkmark icon */}
      <div className="w-12 h-12 rounded-2xl bg-[#EAF7ED] flex items-center justify-center mb-6 shadow-xs">
        <CheckCircle2 className="w-6 h-6 text-[#1E8E3E] stroke-[2.2]" />
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-6">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight mb-2">
          Check your email
        </h2>
        <p className="text-[13px] sm:text-sm text-[#5B717B] leading-relaxed">
          If an account exists for{' '}
          <span className="font-semibold text-[#15313C]">{email || 'name@example.com'}</span>
          , reset instructions are on their way.
        </p>
      </div>

      {/* Main Action: Back to login */}
      <Link to="/login" className="block w-full">
        <button
          type="button"
          className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-white stroke-[2]" />
          <span>Back to login</span>
        </button>
      </Link>

      {/* Use a different email */}
      <div className="text-center mt-5">
        <button
          type="button"
          onClick={() => {
            setStep('input');
            setFieldError('');
          }}
          className="text-xs font-semibold text-[#15313C] hover:opacity-75 underline underline-offset-4 transition-opacity cursor-pointer"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
