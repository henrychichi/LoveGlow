import React, { useState, useEffect } from 'react';
import { RelationshipStatus, UserStats, SingleProfile, CoupleProfile } from '../types';
import Tracker from './Tracker';
import Camera from './Camera';
import { UserIcon, EditIcon, CameraIcon, UploadIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon, HeartIcon, ArrowLeftOnRectangleIcon, SunIcon, MoonIcon } from './icons';
import DeleteAccountModal from './DeleteAccountModal';

type Theme = 'light' | 'dark';

interface MyProfileProps {
  status: RelationshipStatus;
  stats: UserStats;
  singleProfile: SingleProfile | null;
  updateSingleProfile: (profile: SingleProfile) => void;
  coupleProfile: CoupleProfile | null;
  updateCoupleProfile: (profile: CoupleProfile) => void;
  onSetCustomBackground: (imageUrl: string) => void;
  onRevertBackground: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  onShowAbout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const MyProfile: React.FC<MyProfileProps> = ({ 
    status, 
    stats, 
    singleProfile, 
    updateSingleProfile,
    coupleProfile,
    updateCoupleProfile,
    onSetCustomBackground, 
    onRevertBackground, 
    onDeleteAccount, 
    onLogout,
    onShowAbout,
    theme,
    onToggleTheme,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSingleProfile, setEditedSingleProfile] = useState<SingleProfile | null>(singleProfile);
  const [editedCoupleProfile, setEditedCoupleProfile] = useState<CoupleProfile | null>(coupleProfile);
  const [isProfileCameraOpen, setIsProfileCameraOpen] = useState(false);
  const [isBgCameraOpen, setIsBgCameraOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const isCouple = status === RelationshipStatus.DATING || status === RelationshipStatus.MARRIED;

  useEffect(() => {
    if (isCouple) {
        setEditedCoupleProfile(coupleProfile);
    } else {
        setEditedSingleProfile(singleProfile);
    }
  }, [singleProfile, coupleProfile, isCouple]);

  const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedSingleProfile) {
      setEditedSingleProfile({ ...editedSingleProfile, [e.target.name]: e.target.value });
    }
  };
  
  const handleSingleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedSingleProfile) {
      setEditedSingleProfile({ ...editedSingleProfile, interests: e.target.value.split(',').map(i => i.trim()) });
    }
  };
  
  const handleCoupleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedCoupleProfile) {
      setEditedCoupleProfile({ ...editedCoupleProfile, [e.target.name]: e.target.value });
    }
  };
  
  // Fix: Correctly handle updating a tuple state in an immutable way.
  // The original implementation was not type-safe because spreading a tuple
  // can result in a generic array, and indexing with a 'number' can cause issues.
  // This creates a new tuple directly, which is safer and clearer.
  const handleCoupleNameChange = (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedCoupleProfile) {
        const currentNames = editedCoupleProfile.names;
        const newNames: [string, string] = index === 0
            ? [e.target.value, currentNames[1]]
            : [currentNames[0], e.target.value];
        setEditedCoupleProfile({ ...editedCoupleProfile, names: newNames });
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (isCouple && editedCoupleProfile) {
            setEditedCoupleProfile({ ...editedCoupleProfile, imageUrl });
        } else if (!isCouple && editedSingleProfile) {
            setEditedSingleProfile({ ...editedSingleProfile, imageUrl });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfilePhotoCapture = (imageDataUrl: string) => {
    if (isCouple && editedCoupleProfile) {
        setEditedCoupleProfile({ ...editedCoupleProfile, imageUrl: imageDataUrl });
    } else if (!isCouple && editedSingleProfile) {
        setEditedSingleProfile({ ...editedSingleProfile, imageUrl: imageDataUrl });
    }
    setIsProfileCameraOpen(false);
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onSetCustomBackground(reader.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBackgroundPhotoCapture = (imageDataUrl: string) => {
    onSetCustomBackground(imageDataUrl);
    setIsBgCameraOpen(false);
  };

  const handleSaveChanges = () => {
    if (isCouple && editedCoupleProfile) {
        updateCoupleProfile(editedCoupleProfile);
    } else if (!isCouple && editedSingleProfile) {
        updateSingleProfile(editedSingleProfile);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedSingleProfile(singleProfile);
    setEditedCoupleProfile(coupleProfile);
    setIsEditing(false);
  };

  const InfoAndSettings = () => (
     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Info & Settings</h3>
        <div className="space-y-4">
            <button 
                onClick={onShowAbout}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
            >
                <QuestionMarkCircleIcon className="w-6 h-6"/> About LoveGrow
            </button>
            <button 
                onClick={onLogout}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
            >
                <ArrowLeftOnRectangleIcon className="w-6 h-6"/> Logout
            </button>
        </div>
     </div>
  );

  const DangerZone = () => (
    <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full border border-red-300 dark:border-red-700">
      <div className="flex items-center gap-4 mb-4">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">Danger Zone</h3>
      </div>
      <p className="text-red-700 dark:text-red-300 mb-4">
        Deleting your account is a permanent action and cannot be reversed. All your progress, challenges, and personalized data will be lost forever.
      </p>
      <button 
        onClick={() => setShowDeleteModal(true)}
        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
      >
        Delete My Account
      </button>
    </div>
  );

  const BackgroundCustomizer = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">App Personalization</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Appearance</label>
          <button 
            onClick={onToggleTheme}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-3"
          >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Background Image</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label htmlFor="bgUpload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 text-center">
                  <UploadIcon className="w-5 h-5"/> Upload
              </label>
              <input id="bgUpload" type="file" accept="image/*" onChange={handleBackgroundImageChange} className="hidden"/>
              
              <button onClick={() => setIsBgCameraOpen(true)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2">
                  <CameraIcon className="w-5 h-5"/> Camera
              </button>

              <button onClick={onRevertBackground} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2">
                  <ArrowUturnLeftIcon className="w-5 h-5"/> Default
              </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CoupleAvatar = ({ profile }: { profile: CoupleProfile }) => (
    <div className="relative w-32 h-32 mx-auto mb-4">
        {profile.imageUrl ? (
            <img src={profile.imageUrl} alt="Couple" className="w-32 h-32 rounded-full object-cover shadow-lg" />
        ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-lg relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-1/2 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center text-2xl font-bold text-pink-600 dark:text-pink-200 ring-4 ring-white/80 dark:ring-gray-800/80">
                    {profile.names[0] ? profile.names[0][0] : '?'}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-[25%] -translate-y-1/2 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-purple-200 ring-4 ring-white/80 dark:ring-gray-800/80">
                    {profile.names[1] ? profile.names[1][0] : '?'}
                </div>
                <HeartIcon className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
        )}
    </div>
);


  const renderContent = () => {
    if(isCouple && coupleProfile && editedCoupleProfile) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full">
                {isEditing ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Edit Your Profile</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shared Picture</label>
                            <div className="flex flex-col items-center gap-4">
                                <CoupleAvatar profile={editedCoupleProfile} />
                                <div className="flex gap-4">
                                    <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2">
                                        <UploadIcon className="w-5 h-5"/> Upload
                                    </label>
                                    <input id="imageUpload" type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden"/>
                                    <button onClick={() => setIsProfileCameraOpen(true)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2">
                                        <CameraIcon className="w-5 h-5"/> Camera
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Partner 1 Name</label>
                                <input type="text" name="name1" id="name1" value={editedCoupleProfile.names[0]} onChange={handleCoupleNameChange(0)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                            </div>
                            <div>
                                <label htmlFor="name2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Partner 2 Name</label>
                                <input type="text" name="name2" id="name2" value={editedCoupleProfile.names[1]} onChange={handleCoupleNameChange(1)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sharedBio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Our Story / Shared Bio</label>
                            <textarea name="sharedBio" id="sharedBio" rows={4} value={editedCoupleProfile.sharedBio} onChange={handleCoupleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={handleCancelEdit} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">Cancel</button>
                            <button onClick={handleSaveChanges} className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <div className="relative text-center">
                        <CoupleAvatar profile={coupleProfile} />
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{coupleProfile.names.join(' & ')}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 capitalize mt-2">{status}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto">{coupleProfile.sharedBio}</p>
                        <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 bg-gray-200/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            <EditIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                        </button>
                    </div>
                )}
            </div>
        );
    } else if (!isCouple && singleProfile && editedSingleProfile) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full">
              {isEditing ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Edit Your Profile</h2>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                      <div className="flex flex-col items-center gap-4">
                          <img src={editedSingleProfile.imageUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover shadow-md"/>
                          <div className="flex gap-4">
                              <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2">
                                  <UploadIcon className="w-5 h-5"/> Upload
                              </label>
                              <input id="imageUpload" type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden"/>
                              <button onClick={() => setIsProfileCameraOpen(true)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2">
                                  <CameraIcon className="w-5 h-5"/> Camera
                              </button>
                          </div>
                      </div>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input type="text" name="name" id="name" value={editedSingleProfile.name} onChange={handleSingleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea name="bio" id="bio" rows={4} value={editedSingleProfile.bio} onChange={handleSingleInputChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                  </div>
                  <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests (comma-separated)</label>
                    <input type="text" name="interests" id="interests" value={editedSingleProfile.interests.join(', ')} onChange={handleSingleInterestsChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"/>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button onClick={handleCancelEdit} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSaveChanges} className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition">Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="text-center">
                    <img src={singleProfile.imageUrl} alt={singleProfile.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{singleProfile.name}, {singleProfile.age}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto">{singleProfile.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {singleProfile.interests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 bg-gray-200/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    <EditIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
              )}
            </div>
        )
    }
    return null; // Fallback for when profiles are not loaded yet
  }


  return (
    <>
      {isProfileCameraOpen && <Camera onCapture={handleProfilePhotoCapture} onClose={() => setIsProfileCameraOpen(false)} />}
      {isBgCameraOpen && <Camera onCapture={handleBackgroundPhotoCapture} onClose={() => setIsBgCameraOpen(false)} />}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} onConfirmDelete={onDeleteAccount} />}

      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        {renderContent()}
        <InfoAndSettings />
        <BackgroundCustomizer />
        <Tracker stats={stats} />
        <DangerZone />
      </div>
    </>
  );
};

export default MyProfile;