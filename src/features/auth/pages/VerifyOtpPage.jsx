import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { verifyResetOtp, createResetOtp } from '../utils/resetToken';

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);

  // References to the 6 input elements
  const inputRefs = useRef([]);

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle single digit change
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (errorMessage) setErrorMessage('');

    // Advance focus to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting full 6-digit code from email
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    if (errorMessage) setErrorMessage('');

    // Focus last filled box
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Resend OTP code to email
  const handleResend = () => {
    if (resendCooldown > 0) return;
    const newOtpData = createResetOtp(emailParam);

    // Send email in background
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(emailParam)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `DSP Platform - Verification Code is ${newOtpData.otp}`,
          _captcha: 'false',
          _template: 'box',
          email: emailParam,
          otp_code: newOtpData.otp,
          message: `Your new password reset verification code is: ${newOtpData.otp}\n\nValid for 10 minutes.`,
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }

    setResendCooldown(45);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
  };

  // Verify and Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);

    const result = verifyResetOtp(fullCode, emailParam);

    setTimeout(() => {
      setIsSubmitting(false);

      if (result.success) {
        // Direct transition to Set New Password page
        navigate(
          `/reset-password?email=${encodeURIComponent(
            result.email || emailParam
          )}&verified=true`
        );
      } else {
        setErrorMessage(result.message || 'Invalid verification code. Please check your email and try again.');
      }
    }, 450);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Icon: Soft rounded squircle */}
      <div className="w-12 h-12 rounded-2xl bg-[#EAF7ED] flex items-center justify-center mb-6 shadow-xs">
        <KeyRound className="w-6 h-6 text-[#1E8E3E] stroke-[2.2]" />
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-6">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight mb-2">
          Enter Verification Code
        </h2>
        <p className="text-[13px] sm:text-sm text-[#5B717B] leading-relaxed">
          We sent a 6-digit confirmation code to{' '}
          <span className="font-semibold text-[#15313C]">{emailParam || 'your email'}</span>.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FCD8D8] flex items-center gap-2.5 text-xs text-[#E5484D] animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E5484D]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6 Digit Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-sm mx-auto">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`w-11 sm:w-12 h-13 sm:h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all ${
                digit
                  ? 'border-[#15313C] bg-white text-[#15313C] ring-1 ring-[#15313C]/20'
                  : 'border-[#D7E0E3] bg-[#F5F8F9] text-[#15313C] focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/50'
              }`}
            />
          ))}
        </div>

        {/* Verify Code Button */}
        <button
          type="submit"
          disabled={isSubmitting || otp.join('').length < 6}
          className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span>Verifying...</span>
          ) : (
            <>
              <span>Verify Code</span>
              <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.2]" />
            </>
          )}
        </button>
      </form>

      {/* Footer: Resend & Cancel */}
      <div className="mt-6 pt-5 border-t border-[#EEF2F4] flex items-center justify-between text-xs">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-[#5B717B] hover:text-[#15313C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
          <span>Cancel</span>
        </Link>

        {resendCooldown > 0 ? (
          <span className="text-[#8C9FA8] font-medium">
            Resend code in {resendCooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-[#15313C] hover:underline cursor-pointer"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
