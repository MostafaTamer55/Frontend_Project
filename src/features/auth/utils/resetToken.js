const RESET_TOKEN_KEY = 'dsp_password_reset_token';
const RESET_OTP_KEY = 'dsp_password_reset_otp';

/**
 * Creates a 6-digit OTP code with 10-minute validity
 */
export const createResetOtp = (email) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  // Generate random 6-digit code
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const data = {
    otp,
    email: cleanEmail,
    createdAt: Date.now(),
    expiresAt,
    used: false
  };

  try {
    localStorage.setItem(RESET_OTP_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to store OTP', err);
  }

  return data;
};

/**
 * Gets the current stored OTP data
 */
export const getStoredResetOtp = () => {
  try {
    const raw = localStorage.getItem(RESET_OTP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Verifies a 6-digit OTP code
 */
export const verifyResetOtp = (code, email) => {
  const stored = getStoredResetOtp();
  if (!stored) {
    // Demo fallback: accept 123456 or any 6-digit if not found
    return { success: true, email: email || '' };
  }

  if (email && stored.email && email.trim().toLowerCase() !== stored.email) {
    return { success: false, reason: 'email_mismatch', message: 'Email does not match OTP request.' };
  }

  if (Date.now() > stored.expiresAt) {
    return { success: false, reason: 'expired', message: 'Verification code has expired. Please request a new one.' };
  }

  if (stored.used) {
    return { success: false, reason: 'already_used', message: 'This code has already been used.' };
  }

  if (stored.otp !== code.trim()) {
    return { success: false, reason: 'invalid_code', message: 'Invalid verification code. Please check and try again.' };
  }

  // Mark as used
  stored.used = true;
  try {
    localStorage.setItem(RESET_OTP_KEY, JSON.stringify(stored));
  } catch {
    // Ignore
  }

  return { success: true, email: stored.email };
};

/**
 * Creates a self-contained reset token with expiry (default 15 minutes)
 */
export const createResetToken = (email, expiresInMinutes = 15) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

  const payload = {
    email: cleanEmail,
    expiresAt,
    salt: Math.random().toString(36).substring(2, 8)
  };

  let token = 'rst_demo';
  try {
    token = 'rst_' + btoa(JSON.stringify(payload));
  } catch {
    token = 'rst_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

  const data = {
    token,
    email: cleanEmail,
    createdAt: Date.now(),
    expiresAt,
    used: false
  };

  try {
    localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to store reset token', err);
  }

  return data;
};

/**
 * Gets the current stored reset token status
 */
export const getStoredResetToken = () => {
  try {
    const raw = localStorage.getItem(RESET_TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Validates a given token
 */
export const validateResetToken = (token) => {
  if (!token) return { isValid: true, reason: 'direct_access', remainingSeconds: 900 };

  // 1. Try decoding self-contained token payload
  if (token.startsWith('rst_')) {
    try {
      const payloadStr = atob(token.slice(4));
      const payload = JSON.parse(payloadStr);
      if (payload && payload.expiresAt) {
        if (Date.now() > payload.expiresAt) {
          return { isValid: false, reason: 'expired', email: payload.email };
        }
        const remainingSeconds = Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000));
        return {
          isValid: true,
          email: payload.email,
          token,
          remainingSeconds
        };
      }
    } catch {
      // Continue to stored token fallback
    }
  }

  // 2. Check localStorage
  const stored = getStoredResetToken();
  if (stored && (!token || stored.token === token)) {
    if (stored.used) return { isValid: false, reason: 'already_used', email: stored.email };
    if (Date.now() > stored.expiresAt) return { isValid: false, reason: 'expired', email: stored.email };

    const remainingSeconds = Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000));
    return {
      isValid: true,
      email: stored.email,
      token: stored.token,
      remainingSeconds
    };
  }

  // 3. Fallback: valid for testing
  return {
    isValid: true,
    email: '',
    token,
    remainingSeconds: 900
  };
};

/**
 * Mark token as consumed/used
 */
export const markTokenUsed = (_token) => {
  const stored = getStoredResetToken();
  if (stored) {
    stored.used = true;
    try {
      localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(stored));
    } catch {
      // Ignore
    }
  }
  return true;
};

/**
 * Format remaining seconds into MM:SS
 */
export const formatTime = (seconds) => {
  if (seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
