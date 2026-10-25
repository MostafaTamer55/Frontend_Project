import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass = (hasError) =>
  `w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
    hasError
      ? 'border-[#E5484D] bg-[#EEF3F5] focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
      : 'border-[#D7E0E3] bg-[#EEF3F5] focus:bg-white focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C]'
  }`;

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hasError = Boolean(errorMessage);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (hasError) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    const errors = {};
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      errors.fullName = 'Full name is required.';
    } else if (cleanName.length < 2) {
      errors.fullName = 'Enter your full name.';
    }

    if (!cleanEmail) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    } else if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      errors.password = 'Password must contain letters and numbers.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fix the highlighted fields before continuing.');
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    const result = await signup({ name: cleanName, email: cleanEmail, password });

    setIsLoading(false);

    if (result.success) {
      navigate('/login', { state: { registered: true, email: cleanEmail } });
      return;
    }

    setErrorMessage(result.error || 'Unable to create your account. Please try again.');
  };

  return (
    <div className="flex flex-col justify-center h-full">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-3xl sm:text-[32px] font-bold text-[#15313C] tracking-tight">
          Create account
        </h2>
        <p className="text-[13px] text-[#6B8089] mt-2 leading-relaxed">
          Create your account to access the course materials.
        </p>
      </div>

      {/* Validation Error Banner */}
      {hasError && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#FCEDED] border border-[#FACBCD] flex items-center gap-3.5 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-[#E5484D] shrink-0" />
          <div className="text-left">
            <p className="text-xs sm:text-[13px] font-semibold text-[#15313C] leading-tight">
              {errorMessage}
            </p>
            <p className="text-[11px] sm:text-xs text-[#6B8089] mt-0.5 leading-tight">
              Check your details and try again.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-[13px] font-medium text-[#3A5560] mb-1.5"
          >
            Full name
          </label>
          <div className="relative rounded-xl">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                fieldErrors.fullName ? 'text-[#E5484D]' : 'text-[#6B8089]'
              }`}
            >
              <User className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearFieldError('fullName');
              }}
              placeholder="Enter your full name"
              autoComplete="name"
              className={fieldClass(fieldErrors.fullName)}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="mt-1.5 text-xs text-[#E5484D]">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[13px] font-medium text-[#3A5560] mb-1.5"
          >
            Email
          </label>
          <div className="relative rounded-xl">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                fieldErrors.email ? 'text-[#E5484D]' : 'text-[#6B8089]'
              }`}
            >
              <Mail className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
              placeholder="name@example.com"
              autoComplete="email"
              className={fieldClass(fieldErrors.email)}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-[#E5484D]">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-[#3A5560] mb-1.5"
          >
            Password
          </label>
          <div className="relative rounded-xl">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                fieldErrors.password ? 'text-[#E5484D]' : 'text-[#6B8089]'
              }`}
            >
              <Lock className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
                clearFieldError('confirmPassword');
              }}
              placeholder="Create a password"
              autoComplete="new-password"
              className={`${fieldClass(fieldErrors.password)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B8089] hover:text-[#3A5560] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-[#E5484D]">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[13px] font-medium text-[#3A5560] mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative rounded-xl">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                fieldErrors.confirmPassword ? 'text-[#E5484D]' : 'text-[#6B8089]'
              }`}
            >
              <Lock className="w-4 h-4 stroke-[1.75]" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError('confirmPassword');
              }}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`${fieldClass(fieldErrors.confirmPassword)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B8089] hover:text-[#3A5560] transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1.5 text-xs text-[#E5484D]">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Create account Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#15313C] hover:bg-[#112730] active:scale-[0.99] text-[#CCEB74] py-3 sm:py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#CCEB74]/30 border-t-[#CCEB74] rounded-full animate-spin" />
            ) : (
              <>
                <span className="font-semibold text-[#CCEB74]">Create account</span>
                <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.25]" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-xs text-[#6B8089]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#15313C] underline underline-offset-2 hover:text-black"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
