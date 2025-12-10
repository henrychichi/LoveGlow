import React, { useState, useEffect, useCallback } from 'react';
import { UserData, Challenge, RelationshipStatus, SingleProfile } from '../types';
import { getDailyChallenges } from '../services/geminiService';
import { saveUserData } from '../services/firebaseService';
import DailyActivity from './DailyActivity';
import Tracker from './Tracker';
import LoveWall from './LoveWall';
import SearchForLove from './SearchForLove';
import MyProfile from './MyProfile';
import AICoach from './AICoach';
import Chat from './Chat';
import { BookOpenIcon, HeartIcon, UserIcon, ChatBubbleLeftRightIcon, LightBulbIcon, TrophyIcon } from './icons';
import About from './About';
import Leaderboard from './Leaderboard';
import confetti from 'canvas-confetti';

type View = 'challenges' | 'wall' | 'connect' | 'profile' | 'aicoach' | 'chat' | 'about' | 'leaderboard';

interface DashboardProps {
  userData: UserData;
  onLogout: () => void;
  onUpdateUserData: (data: UserData) => void;
  onDeleteAccount: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout, onUpdateUserData, onDeleteAccount, theme, onToggleTheme }) => {
  const [view, setView] = useState<View>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(userData.dailyChallenges || []);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatPartner, setChatPartner] = useState<SingleProfile | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchChallenges = useCallback(async () => {
    // If we need new challenges for today
    if (userData.lastChallengeDate !== today || userData.dailyChallenges.length === 0) {
      
      setIsLoadingChallenges(true);
      setError(null);
      try {
        const newChallenges = await getDailyChallenges(userData.relationshipStatus);
        setChallenges(newChallenges);
        
        // Save new challenges to Firestore immediately so they persist
        const updatedData = { ...userData, dailyChallenges: newChallenges, lastChallengeDate: today };
        onUpdateUserData(updatedData); // Updates local state in App.tsx
        // App.tsx handles the actual saveUserData call via the callback, but explicit save is safer for async flows
        await saveUserData(updatedData);

      } catch (err: any) {
        setError(err.message || 'Failed to load challenges.');
      } finally {
        setIsLoadingChallenges(false);
      }
    }
  }, [userData, today, onUpdateUserData]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleCompleteChallenge = async (index: number) => {
    const newChallenges = [...challenges];
    if (newChallenges[index].completed) return;

    // Trigger visual reward
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#a855f7', '#fbbf24'], // Pink, Purple, Yellow/Gold
      zIndex: 1000,
    });

    newChallenges[index].completed = true;
    setChallenges(newChallenges);

    const pointsGained = 20;
    const currentLevel = userData.stats.level;
    let newPoints = userData.stats.points + pointsGained;
    let newLevel = currentLevel;
    
    // Level up logic: (Level + 1) * 100 is the threshold
    const pointsToNextLevel = (currentLevel + 1) * 100;

    if (newPoints >= pointsToNextLevel) {
        newLevel += 1;
        newPoints = newPoints - pointsToNextLevel; // Reset points relative to new level base, or carry over
        
        // Extra confetti for leveling up!
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                startVelocity: 45,
            });
        }, 300);
    }
    
    const newStats = { 
      ...userData.stats, 
      points: newPoints,
      level: newLevel,
      challengesCompleted: userData.stats.challengesCompleted + 1 
    };
    
    const updatedData = { ...userData, dailyChallenges: newChallenges, stats: newStats };
    
    // Optimistic update
    onUpdateUserData(updatedData);
    
    // Persist to Firestore
    try {
        await saveUserData(updatedData);
    } catch (e) {
        console.error("Failed to save progress", e);
        // In a robust app, we might rollback state here
    }
  };
  
  const handleConnect = (profile: SingleProfile) => {
    setChatPartner(profile);
    setView('chat');
  };
  
  const renderView = () => {
    if (view === 'chat' && chatPartner && userData.singleProfile) {
        return <Chat partner={chatPartner} currentUser={userData.singleProfile} onBack={() => setView('connect')} />;
    }
    if (view === 'aicoach') {
        return <AICoach status={userData.relationshipStatus} onBack={() => setView('challenges')} />;
    }
    if (view === 'about') {
        return <About onBack={() => setView('profile')} />;
    }
    
    switch (view) {
      case 'challenges':
        return (
          <div className="p-4 md:p-8 space-y-8">
            <Tracker stats={userData.stats} />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Today's Challenges</h2>
            
            {isLoadingChallenges && (
                 <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Generating your daily challenges...</p>
                 </div>
            )}

            {error && (
                <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-300">
                    <p>{error}</p>
                    <button 
                        onClick={() => fetchChallenges()} 
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {!isLoadingChallenges && challenges.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((c, i) => (
                        <DailyActivity key={i} activity={c} onComplete={() => handleCompleteChallenge(i)} />
                    ))}
                </div>
            )}
          </div>
        );
      case 'wall':
        return <LoveWall status={userData.relationshipStatus} />;
      case 'leaderboard': {
        const isCouple = userData.relationshipStatus !== RelationshipStatus.SINGLE;
        const name = isCouple 
            ? userData.coupleProfile?.names.join(' & ') || 'Us' 
            : userData.singleProfile?.name || 'You';
        const avatarUrl = isCouple
            ? userData.coupleProfile?.imageUrl || `https://i.pravatar.cc/150?u=${userData.uid}`
            : userData.singleProfile?.imageUrl || `https://i.pravatar.cc/150?u=${userData.uid}`;

        const currentUserDataForLeaderboard = {
            uid: userData.uid,
            name,
            stats: userData.stats,
            avatarUrl,
        };
        return <Leaderboard currentUserData={currentUserDataForLeaderboard} />;
      }
      case 'connect':
        return <SearchForLove onConnect={handleConnect} />;
      case 'profile':
        return <MyProfile 
                    status={userData.relationshipStatus}
                    stats={userData.stats}
                    singleProfile={userData.singleProfile}
                    updateSingleProfile={(p) => onUpdateUserData({...userData, singleProfile: p})}
                    coupleProfile={userData.coupleProfile}
                    updateCoupleProfile={(p) => onUpdateUserData({...userData, coupleProfile: p})}
                    onLogout={onLogout}
                    onSetCustomBackground={()=>{}}
                    onRevertBackground={()=>{}}
                    onDeleteAccount={onDeleteAccount}
                    onShowAbout={() => setView('about')}
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      
      <main className="pb-24">{renderView()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavButton label="Challenges" icon={<BookOpenIcon className="w-6 h-6" />} isActive={view === 'challenges'} onClick={() => setView('challenges')} />
          <NavButton label="Love Wall" icon={<HeartIcon className="w-6 h-6" />} isActive={view === 'wall'} onClick={() => setView('wall')} />
          <NavButton label="Leaders" icon={<TrophyIcon className="w-6 h-6" />} isActive={view === 'leaderboard'} onClick={() => setView('leaderboard')} />
          {userData.relationshipStatus === RelationshipStatus.SINGLE && (
            <NavButton label="Connect" icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} isActive={view === 'connect'} onClick={() => setView('connect')} />
          )}
          <NavButton label="AI Coach" icon={<LightBulbIcon className="w-6 h-6" />} isActive={view === 'aicoach'} onClick={() => setView('aicoach')} />
          <NavButton label="Profile" icon={<UserIcon className="w-6 h-6" />} isActive={view === 'profile'} onClick={() => setView('profile')} />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void}> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center text-center p-2 w-20 transition-all duration-200 h-16 ${isActive ? 'text-pink-500 dark:text-pink-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'}`}>
        {icon}
        <span className="text-[10px] font-semibold mt-1">{label}</span>
    </button>
);

export default Dashboard;