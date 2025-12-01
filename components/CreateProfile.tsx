
import React, { useState } from 'react';
import { RelationshipStatus, SingleProfile, CoupleProfile } from '../types';
import { UserIcon, UsersIcon, HeartIcon } from './icons';

interface CreateProfileProps {
  onProfileCreated: (profileData: {
    status: RelationshipStatus;
    singleProfile: SingleProfile | null;
    coupleProfile: CoupleProfile | null;
  }) => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onProfileCreated }) => {
  const [status, setStatus] = useState<RelationshipStatus | null>(null);
  const [step, setStep] = useState(1);
  const [singleProfile, setSingleProfile] = useState<Partial<SingleProfile>>({ name: '', age: 18, bio: '', interests: [] });
  const [coupleProfile, setCoupleProfile] = useState<Partial<CoupleProfile>>({ names: ['', ''], sharedBio: '' });

  const handleStatusSelect = (selectedStatus: RelationshipStatus) => {
    setStatus(selectedStatus);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    if (status === RelationshipStatus.SINGLE) {
      onProfileCreated({
        status,
        singleProfile: {
            uid: '', // This will be set in App.tsx
            imageUrl: `https://i.pravatar.cc/300?u=${singleProfile.name}`, // Placeholder image
            bio: "Excited to start this journey of self-growth!",
            interests: ["Growth", "Mindfulness"],
            ...singleProfile
        } as SingleProfile,
        coupleProfile: null,
      });
    } else {
      onProfileCreated({
        status,
        singleProfile: null,
        coupleProfile: {
            imageUrl: `https://i.pravatar.cc/300?u=${coupleProfile.names?.join('')}`, // Placeholder
            sharedBio: "Ready to grow together!",
            ...coupleProfile
        } as CoupleProfile,
      });
    }
  };
  
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-lg text-center">
          <HeartIcon className="w-16 h-16 text-pink-500 dark:text-pink-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">One last step!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">To personalize your experience, what is your current relationship status?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusButton status={RelationshipStatus.SINGLE} label="Single" icon={<UserIcon className="w-8 h-8"/>} onSelect={handleStatusSelect} />
            <StatusButton status={RelationshipStatus.DATING} label="Dating" icon={<UsersIcon className="w-8 h-8"/>} onSelect={handleStatusSelect} />
            <StatusButton status={RelationshipStatus.MARRIED} label="Married" icon={<UsersIcon className="w-8 h-8"/>} onSelect={handleStatusSelect} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Tell us about {status === RelationshipStatus.SINGLE ? "yourself" : "yourselves"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  {status === RelationshipStatus.SINGLE ? (
                      <>
                          <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                              <input type="text" id="name" value={singleProfile.name} onChange={e => setSingleProfile({...singleProfile, name: e.target.value})} className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
                          </div>
                          <div>
                              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Age</label>
                              <input type="number" id="age" min="18" value={singleProfile.age} onChange={e => setSingleProfile({...singleProfile, age: parseInt(e.target.value) || 18})} className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
                          </div>
                      </>
                  ) : (
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label htmlFor="name1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Partner 1 Name</label>
                              <input type="text" id="name1" value={coupleProfile.names?.[0]} onChange={e => setCoupleProfile({...coupleProfile, names: [e.target.value, coupleProfile.names?.[1] || '']})} className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
                          </div>
                          <div>
                              <label htmlFor="name2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Partner 2 Name</label>
                              <input type="text" id="name2" value={coupleProfile.names?.[1]} onChange={e => setCoupleProfile({...coupleProfile, names: [coupleProfile.names?.[0] || '', e.target.value]})} className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
                          </div>
                      </div>
                  )}
                  <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                      Let's Go!
                  </button>
              </form>
          </div>
      </div>
  );
};

const StatusButton: React.FC<{ status: RelationshipStatus; label: string; icon: React.ReactNode; onSelect: (status: RelationshipStatus) => void; }> = ({ status, label, icon, onSelect }) => (
    <button onClick={() => onSelect(status)} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300">
        <div className="text-pink-500 dark:text-pink-400 mb-3">{icon}</div>
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{label}</span>
    </button>
);

export default CreateProfile;
