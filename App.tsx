import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateProfile from './components/CreateProfile';
import { onAuthChange, getUserData, saveUserData, logout } from './services/firebaseService';
import { UserData, RelationshipStatus, SingleProfile, CoupleProfile } from './types';

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
    const unsubscribe = onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
            setUser(firebaseUser);
            // Fetch real data from Firestore
            try {
                const existingUserData = await getUserData(firebaseUser.uid);
                if (existingUserData) {
                    setUserData(existingUserData);
                } else {
                    // User exists in Auth but no data in Firestore (interrupted signup)
                    setUserData(null);
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        } else {
            setUser(null);
            setUserData(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileCreated = async (profileData: {
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
      
      // Save to Firestore
      await saveUserData(newUserData);
      setUserData(newUserData);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setUserData(null);
  };

  const handleUpdateUserData = async (updatedData: UserData) => {
    setUserData(updatedData);
    // Save updates to Firestore
    await saveUserData(updatedData);
  };
  
  const handleDeleteAccount = async () => {
      // In a real app, you would delete Firestore data here or via Cloud Functions trigger
      // Then delete Auth
      await logout();
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><p className="text-lg text-gray-600 dark:text-gray-300">Loading LoveGrow...</p></div>;
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
            onDeleteAccount={handleDeleteAccount}
            theme={theme}
            onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
         />;
};

export default App;