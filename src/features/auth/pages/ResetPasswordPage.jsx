import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateResetToken, markTokenUsed, createResetToken } from '../utils/resetToken';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  // Validate token directly on mount/render
  const initialTokenStatus = tokenParam ? validateResetToken(tokenParam) : null;
  const isInitialExpired = Boolean(
    searchParams.get('expired') === 'true' ||
      (initialTokenStatus && !initialTokenStatus.isValid && initialTokenStatus.reason === 'expired')
  );

  // Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(isInitialExpired);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(searchParams.get('success') === 'true');

  const { updatePassword } = useAuth();

  // Handle request a new link when expired
  const handleRequestNewLink = () => {
    setIsResending(true);
    const targetEmail = emailParam || initialTokenStatus?.email || '';

    if (targetEmail) {
      // 1. Generate new reset token (15 mins)
      const tokenData = createResetToken(targetEmail, 15);
      const resetUrl = `${window.location.origin}/reset-password?token=${encodeURIComponent(
        tokenData.token
      )}&email=${encodeURIComponent(targetEmail)}`;

      // 2. Dispatch real email to inbox
      try {
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: 'DSP Platform - New Password Reset Link',
            _captcha: 'false',
            _template: 'box',
            email: targetEmail,
            reset_password_link: resetUrl,
            message: `You requested a new password reset link for your DSP Platform account:\n\n${resetUrl}\n\nNote: This link is valid for 15 minutes.`,
          }),
        }).catch(() => {});
      } catch {
        // Ignore
      }
    }

    // 3. Return to forgot password page to notify user
    setTimeout(() => {
      setIsResending(false);
      navigate('/forgot-password');
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    const errors = {};

    if (!password) {
      errors.password = 'Please enter a new password.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please repeat your new password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    // Check token validity again upon submission
    if (tokenParam) {
      const status = validateResetToken(tokenParam);
      if (!status.isValid) {
        if (status.reason === 'expired') {
          setIsTokenExpired(true);
        } else if (status.reason === 'already_used') {
          setGeneralError('This reset link has already been used.');
        }
        return;
      }
    }

    setIsSubmitting(true);

    const targetEmail = emailParam || initialTokenStatus?.email || '';

    // Update account password so login succeeds with new password
    if (targetEmail) {
      updatePassword(targetEmail, password);
    }

    // Consume token and transition to Success Screen
    setTimeout(() => {
      if (tokenParam) {
        markTokenUsed(tokenParam);
      }
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  // -------------------------------------------------------------------
  // VIEW 1: Password Updated Success Screen (screen/auth/reset-password/success)
  // Exact 100% Figma Match
  // -------------------------------------------------------------------
  if (isSuccess) {
    return (
      <div className="w-full flex flex-col justify-center">
        {/* Soft rounded squircle checkmark icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#EAF7ED] flex items-center justify-center mb-6 shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-[#1E8E3E] stroke-[2.2]" />
        </div>

        {/* Title & Description matching Figma 100% */}
        <div className="mb-7">
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight mb-2">
            Password updated
          </h2>
          <p className="text-[13px] sm:text-sm text-[#5B717B] leading-relaxed">
            You can now log in with your new password.
          </p>
        </div>

        {/* Log in Button */}
        <Link
          to="/login"
          state={{
            email: emailParam || '',
            passwordReset: true,
          }}
          className="block w-full"
        >
          <button
            type="button"
            className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-[#CCEB74] hover:text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="font-semibold text-white">Log in</span>
            <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.2]" />
          </button>
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // VIEW 2: Link Expired Screen (screen/auth/reset-password/link-expired)
  // Exact 100% Figma Match
  // -------------------------------------------------------------------
  if (isTokenExpired) {
    return (
      <div className="w-full flex flex-col justify-center">
        {/* Soft rounded squircle alert icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#FFF6EE] border border-[#FED7AA]/40 flex items-center justify-center mb-6 shadow-xs">
          <AlertCircle className="w-6 h-6 text-[#EA580C] stroke-[2.2]" />
        </div>

        {/* Title & Description matching Figma 100% */}
        <div className="mb-7">
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight mb-2">
            This link is no longer valid
          </h2>
          <p className="text-[13px] sm:text-sm text-[#5B717B] leading-relaxed">
            Reset links expire. Request a new one to continue.
          </p>
        </div>

        {/* Request a new link Button */}
        <button
          type="button"
          disabled={isResending}
          onClick={handleRequestNewLink}
          className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-[#CCEB74] hover:text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          {isResending ? (
            <span className="font-semibold text-white">Sending new link...</span>
          ) : (
            <>
              <span className="font-semibold text-white">Request a new link</span>
              <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.2]" />
            </>
          )}
        </button>

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

  // -------------------------------------------------------------------
  // VIEW 3: Set New Password Form Screen
  // -------------------------------------------------------------------
  return (
    <div className="w-full flex flex-col justify-center">
      {/* Title & Subtitle matching Figma 100% */}
      <div className="mb-6">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#15313C] tracking-tight leading-tight">
          Set a new password
        </h2>
        <p className="text-[13px] sm:text-sm text-[#5B717B] mt-2 leading-relaxed">
          Choose a new password for your account.
        </p>
      </div>

      {/* General Error Banner */}
      {generalError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FCD8D8] flex items-center gap-2.5 text-xs text-[#E5484D]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E5484D]" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5" noValidate>
        {/* Field 1: New password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs font-semibold text-[#15313C] mb-2"
          >
            New password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9FA8]">
              <Lock className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
                if (generalError) setGeneralError('');
              }}
              placeholder="Enter a new password"
              autoComplete="new-password"
              className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                fieldErrors.password
                  ? 'border-[#E5484D] bg-[#FFF5F5] focus:border-[#E5484D] focus:ring-2 focus:ring-[#E5484D]/20'
                  : 'border-[#B8D858] bg-white ring-2 ring-[#CCEB74]/40 focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C9FA8] hover:text-[#15313C] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-[#E5484D] font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Field 2: Confirm new password */}
        <div>
          <label
            htmlFor="confirm-new-password"
            className="block text-xs font-semibold text-[#15313C] mb-2"
          >
            Confirm new password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9FA8]">
              <Lock className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="confirm-new-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                if (generalError) setGeneralError('');
              }}
              placeholder="Repeat the new password"
              autoComplete="new-password"
              className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                fieldErrors.confirmPassword
                  ? 'border-[#E5484D] bg-[#FFF5F5] focus:border-[#E5484D] focus:ring-2 focus:ring-[#E5484D]/20'
                  : 'border-[#D7E0E3] bg-[#F5F8F9] focus:bg-white focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C9FA8] hover:text-[#15313C] transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1.5 text-xs text-[#E5484D] font-medium">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Update Password Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#15313C] hover:bg-[#0D242D] active:scale-[0.99] text-[#CCEB74] hover:text-white font-medium text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span>Updating password...</span>
            ) : (
              <>
                <span className="font-semibold text-white">Update password</span>
                <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.2]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
