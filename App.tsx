

import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateProfile from './components/CreateProfile';
import { logout, onAuthChange } from './services/firebaseService';
import { UserData, RelationshipStatus, SingleProfile, CoupleProfile } from './types';

// Mock function to get user data from a "database" (localStorage)
const getMockUserData = (uid: string): UserData | null => {
  const storedData = localStorage.getItem(`user_${uid}`);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

// Mock function to save user data
const saveMockUserData = (userData: UserData) => {
  localStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
};

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
        if (firebaseUser) {
            const existingUserData = getMockUserData(firebaseUser.uid);
            setUser(firebaseUser);
            if(existingUserData) {
                setUserData(existingUserData);
            }
        } else {
            setUser(null);
            setUserData(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileCreated = (profileData: {
    status: RelationshipStatus;
    singleProfile: SingleProfile | null;
    coupleProfile: CoupleProfile | null;
  }) => {
    if (user) {
      const newUserData: UserData = {
        uid: user.uid,
        email: user.email,
        relationshipStatus: profileData.status,
        stats: { points: 0, level: 1, challengesCompleted: 0 },
        singleProfile: profileData.singleProfile ? { ...profileData.singleProfile, uid: user.uid } : null,
        coupleProfile: profileData.coupleProfile,
        hasCompletedOnboarding: true,
        lastChallengeDate: null,
        dailyChallenges: [],
      };
      saveMockUserData(newUserData);
      setUserData(newUserData);
    }
  };
  
  const handleLogout = async () => {
    if(user) localStorage.removeItem(`user_${user.uid}`);
    await logout();
    setUser(null);
    setUserData(null);
  };

  const handleUpdateUserData = (updatedData: UserData) => {
    setUserData(updatedData);
    saveMockUserData(updatedData);
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><p className="text-lg">Loading LoveGrow...</p></div>;
  }

  if (!user) {
    return <Auth />;
  }
  
  if (!userData || !userData.hasCompletedOnboarding) {
      return <CreateProfile onProfileCreated={handleProfileCreated} />;
  }

  return <Dashboard 
            userData={userData} 
            onLogout={handleLogout} 
            onUpdateUserData={handleUpdateUserData}
            onDeleteAccount={handleLogout}
            theme={theme}
            onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
         />;
};

export default App;