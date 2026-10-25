import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registrationSuccess = Boolean(location.state?.registered);
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    const errors = {};
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fill in the required fields correctly.');
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    const result = await login(cleanEmail, password);

    setIsLoading(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (result.reason === 'ACCOUNT_NOT_FOUND') {
      setErrorMessage('No account was found with this email. Please create an account first.');
    } else if (result.reason === 'INCORRECT_PASSWORD') {
      setErrorMessage('The password you entered is incorrect. Please try again.');
    } else {
      setErrorMessage('Unable to log in. Please check your details and try again.');
    }
  };

  const hasError = Boolean(errorMessage);

  return (
    <div className="flex flex-col justify-center h-full">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-3xl sm:text-[32px] font-bold text-[#15313C] tracking-tight">
          Log in
        </h2>
        <p className="text-[13px] text-[#6B8089] mt-2 leading-relaxed max-w-[340px]">
          Use your account to open the DSP lectures, sections, and Exam Bank.
        </p>
      </div>

      {/* Registration Success Banner */}
      {registrationSuccess && !hasError && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#EDF7E6] border border-[#CDEB74] flex items-center gap-3.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#4C7A1F] shrink-0" />
          <p className="text-xs sm:text-[13px] font-semibold text-[#15313C] leading-tight">
            Account created successfully. Please log in.
          </p>
        </div>
      )}

      {/* Password Reset Success Banner */}
      {location.state?.passwordReset && !hasError && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#EDF7E6] border border-[#CDEB74] flex items-center gap-3.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#4C7A1F] shrink-0" />
          <p className="text-xs sm:text-[13px] font-semibold text-[#15313C] leading-tight">
            Password updated successfully. Please log in with your new password.
          </p>
        </div>
      )}

      {/* Validation Error Banner (screen/auth/login/invalid-credentials) */}
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
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
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
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
                if (hasError) setErrorMessage('');
              }}
              placeholder="name@example.com"
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                fieldErrors.email
                  ? 'border-[#E5484D] bg-[#EEF3F5] focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
                  : 'border-[#D7E0E3] bg-[#EEF3F5] focus:bg-white focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C]'
              }`}
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
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
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
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
                if (hasError) setErrorMessage('');
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                fieldErrors.password
                  ? 'border-[#E5484D] bg-[#EEF3F5] focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
                  : 'border-[#D7E0E3] bg-[#EEF3F5] focus:bg-white focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C]'
              }`}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#15313C] hover:text-black underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Log In Button */}
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
                <span className="font-semibold text-[#CCEB74]">Log in</span>
                <ArrowRight className="w-4 h-4 text-[#CCEB74] stroke-[2.25]" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-xs text-[#6B8089]">
          New to the course?{' '}
          <Link
            to="/signup"
            className="font-semibold text-[#15313C] underline underline-offset-2 hover:text-black"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
