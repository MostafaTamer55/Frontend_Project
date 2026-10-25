import React, { createContext, useContext, useState } from 'react';
import { PREDEFINED_ACCOUNTS } from './mockAccounts';

const AuthContext = createContext(null);

const getPasswordOverrides = () => {
  try {
    const stored = localStorage.getItem('dsp_password_overrides');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Keep all accounts (predefined + dynamically signed-up accounts) with updated passwords
const getAllAccounts = () => {
  try {
    const dynamic = localStorage.getItem('dsp_registered_accounts');
    const dynamicAccounts = dynamic ? JSON.parse(dynamic) : [];
    const overrides = getPasswordOverrides();

    const all = [...PREDEFINED_ACCOUNTS, ...dynamicAccounts];
    return all.map((acc) => {
      const emailLower = acc.email.toLowerCase();
      if (overrides[emailLower]) {
        return { ...acc, password: overrides[emailLower] };
      }
      return acc;
    });
  } catch {
    return PREDEFINED_ACCOUNTS;
  }
};

// A stored session is only valid if its account still exists.
const getStoredSession = () => {
  try {
    const stored = localStorage.getItem('dsp_auth_session');
    if (!stored) return null;

    const session = JSON.parse(stored);
    const accounts = getAllAccounts();
    const accountExists = accounts.some(
      (acc) => acc.email.toLowerCase() === session.email?.toLowerCase()
    );

    if (!accountExists) {
      localStorage.removeItem('dsp_auth_session');
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem('dsp_auth_session');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredSession);

  /**
   * Authenticate user with email and password
   * Rejects any credentials that do not match existing accounts.
   */
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAllAccounts();

    const matchingAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (!matchingAccount) {
      return { success: false, reason: 'ACCOUNT_NOT_FOUND' };
    }

    if (matchingAccount.password !== password) {
      return { success: false, reason: 'INCORRECT_PASSWORD' };
    }

    // Authentication succeeded
    const userSession = {
      id: matchingAccount.id,
      name: matchingAccount.name,
      email: matchingAccount.email,
      role: matchingAccount.role || 'student',
    };

    localStorage.setItem('dsp_auth_session', JSON.stringify(userSession));
    setCurrentUser(userSession);

    return { success: true, user: userSession };
  };

  /**
   * Register a new account via the Signup page.
   * Separate flow: does not automatically log in.
   */
  const signup = async ({ name, email, password }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getAllAccounts();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role: 'student',
    };

    try {
      const stored = localStorage.getItem('dsp_registered_accounts');
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(newAccount);
      localStorage.setItem('dsp_registered_accounts', JSON.stringify(existing));
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to save account.' };
    }
  };

  /**
   * Update password for an account (used by Reset Password flow)
   */
  const updatePassword = async (email, newPassword) => {
    if (!email || !newPassword) return false;
    const cleanEmail = email.trim().toLowerCase();

    // 1. Store in password overrides map
    try {
      const overrides = getPasswordOverrides();
      overrides[cleanEmail] = newPassword;
      localStorage.setItem('dsp_password_overrides', JSON.stringify(overrides));
    } catch (e) {
      console.error('Failed to store password override', e);
    }

    // 2. Update existing registered account or create user record so login succeeds
    try {
      const stored = localStorage.getItem('dsp_registered_accounts');
      const existing = stored ? JSON.parse(stored) : [];
      const index = existing.findIndex((acc) => acc.email.toLowerCase() === cleanEmail);

      if (index !== -1) {
        existing[index].password = newPassword;
        localStorage.setItem('dsp_registered_accounts', JSON.stringify(existing));
      } else {
        const isPredefined = PREDEFINED_ACCOUNTS.some(
          (acc) => acc.email.toLowerCase() === cleanEmail
        );
        if (!isPredefined) {
          const newAccount = {
            id: `usr_${Date.now()}`,
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            password: newPassword,
            role: 'student',
          };
          existing.push(newAccount);
          localStorage.setItem('dsp_registered_accounts', JSON.stringify(existing));
        }
      }
    } catch (e) {
      console.error('Failed to update account password', e);
    }

    return true;
  };

  /**
   * Log out and clear session
   */
  const logout = () => {
    localStorage.removeItem('dsp_auth_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        signup,
        updatePassword,
        logout,
        predefinedAccounts: PREDEFINED_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
