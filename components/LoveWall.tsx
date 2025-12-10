import React, { useState, useEffect } from 'react';
import { LoveWallPost as LoveWallPostType, RelationshipStatus } from '../types';
import LoveWallPost from './LoveWallPost';
import Camera from './Camera';
import { CameraIcon, UploadIcon, TrashIcon } from './icons';
import { addLoveWallPost, subscribeToLoveWall, uploadFile } from '../services/firebaseService';

interface LoveWallProps {
  status: RelationshipStatus;
}

const LoveWall: React.FC<LoveWallProps> = ({ status }) => {
    const [posts, setPosts] = useState<LoveWallPostType[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Subscribe to Firestore updates
    useEffect(() => {
        const unsubscribe = subscribeToLoveWall((fetchedPosts) => {
            setPosts(fetchedPosts);
        });
        return () => unsubscribe();
    }, []);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreviewUrl(reader.result as string);
                if (file.type.startsWith('video/')) {
                    setMediaType('video');
                } else {
                    setMediaType('image');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoCapture = (imageDataUrl: string) => {
        setMediaPreviewUrl(imageDataUrl);
        setMediaType('image');
        setIsCameraOpen(false);
    };

    const clearMedia = () => {
        setMediaPreviewUrl(null);
        setMediaType(null);
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage || !mediaPreviewUrl || !mediaType) {
            alert('Please add a message and an image or video.');
            return;
        }

        setIsUploading(true);
        try {
            // Upload media to Firebase Storage
            // Generate a unique path: lovewall/{timestamp}_{random}.jpg
            const timestamp = Date.now();
            const fileName = `lovewall/${timestamp}_${Math.floor(Math.random() * 1000)}.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
            
            const downloadUrl = await uploadFile(mediaPreviewUrl, fileName);

            // Save post to Firestore
            await addLoveWallPost({
                author: 'Anonymous', // In a real app, use user.displayName
                message: newMessage,
                mediaUrl: downloadUrl,
                mediaType: mediaType,
                comments: [],
            });

            setNewMessage('');
            clearMedia();
        } catch (error) {
            console.error("Error posting to Love Wall:", error);
            alert("Failed to post. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            {isCameraOpen && <Camera onCapture={handlePhotoCapture} onClose={() => setIsCameraOpen(false)} />}
            <div className="p-4 md:p-8">
                <h2 className="text-4xl font-bold text-center text-purple-700 dark:text-purple-300 mb-8">The Love Wall</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">Share your experiences and get inspired by the LoveGrow community. See how others are strengthening their connections and celebrating love.</p>

                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <CameraIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Share Your Moment</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="What challenge did you complete?"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                            rows={3}
                            aria-label="Your message"
                        />
                        
                        <div>
                            {mediaPreviewUrl ? (
                                <div className="relative">
                                    {mediaType === 'image' ? (
                                        <img src={mediaPreviewUrl} alt="Preview of your upload" className="rounded-lg w-full max-h-80 object-cover mx-auto" />
                                    ) : (
                                        <video src={mediaPreviewUrl} controls autoPlay muted className="rounded-lg w-full max-h-80 bg-black" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={clearMedia}
                                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75"
                                        aria-label="Remove media"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <label 
                                      htmlFor="imageUpload" 
                                      className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <UploadIcon className="w-12 h-12 text-gray-400" />
                                        <span className="font-semibold">Upload File</span>
                                    </label>
                                    <button 
                                      type="button"
                                      onClick={() => setIsCameraOpen(true)}
                                      className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <CameraIcon className="w-12 h-12 text-gray-400" />
                                        <span className="font-semibold">Use Camera</span>
                                    </button>
                                </div>
                            )}
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                className="hidden"
                                aria-label="Upload an image or video"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex justify-center items-center" 
                            disabled={!newMessage || !mediaPreviewUrl || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Posting...
                                </>
                            ) : (
                                'Post to the Wall'
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {posts.map((post) => (
                        <LoveWallPost key={post.id} post={post} />
                    ))}
                    {posts.length === 0 && (
                        <p className="text-center col-span-full text-gray-500">No posts yet. Be the first to share!</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoveWall;