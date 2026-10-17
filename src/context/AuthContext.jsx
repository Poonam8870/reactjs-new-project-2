import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: 'user-admin',
    name: 'Manoj (Vital Medex)',
    email: 'admin@vitalmedex.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 8047302413',
    company: 'Vital Medex Wholesale',
    gstin: '27AEPFS7579K1ZW',
  },
  {
    id: 'user-customer',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh@apollohealth.com',
    password: 'buyer123',
    role: 'customer',
    phone: '+91 9876543210',
    company: 'Apollo Clinic & Chemist',
    gstin: '27AAAAA0000A1Z5',
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('sigmamedex_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sigmamedex_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sigmamedex_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === password);
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const register = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: trimmedEmail,
      password: userData.password,
      role: userData.role || 'customer',
      phone: userData.phone || '',
      company: userData.company || '',
      gstin: userData.gstin || '',
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sigmamedex_current_user');
    } catch (e) {}
  };

  const switchRole = (newRole) => {
    if (newRole === 'guest') {
      logout();
      return;
    }
    const targetUser = users.find(u => u.role === newRole) || users[0];
    setCurrentUser(targetUser);
    try {
      localStorage.setItem('sigmamedex_current_user', JSON.stringify(targetUser));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      isAdmin: currentUser?.role === 'admin',
      login,
      register,
      logout,
      switchRole,
      users
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
