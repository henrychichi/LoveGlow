import React, { useState } from 'react';
import { LoveWallPost as LoveWallPostType, RelationshipStatus } from '../types';
import LoveWallPost from './LoveWallPost';
import Camera from './Camera';
import { CameraIcon, UploadIcon, TrashIcon } from './icons';

// Mock data to simulate community posts
const initialPosts: LoveWallPostType[] = [
  { id: 1, author: 'Jess & Tom', message: 'We did the "stargazing" challenge and it was magical! ✨', mediaUrl: 'https://picsum.photos/500/300', mediaType: 'image', likes: 125, comments: [{id: 1, author: 'Chloe', text: 'So romantic!'}] },
  { id: 2, author: 'Maria', message: 'The self-love affirmation really changed my morning routine. Feeling grateful!', mediaUrl: 'https://picsum.photos/500/600', mediaType: 'image', likes: 88, comments: [] },
  { id: 7, author: 'Mike & Anna', message: 'The cooking challenge was a blast! Messy but fun.', mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType: 'video', likes: 301, comments: [{id: 2, author: 'Sam', text: 'Haha we did this too! Total chaos.'}, {id: 3, author: 'Ben', text: 'Looks delicious though!'}] },
  { id: 3, author: 'David & Chloe', message: 'Cooked a meal together for the first time in ages. So much fun!', mediaUrl: 'https://picsum.photos/500/400', mediaType: 'image', likes: 210, comments: [] },
  { id: 4, author: 'Alex', message: 'The "write a letter to your future self" task was so insightful.', mediaUrl: 'https://picsum.photos/500/500', mediaType: 'image', likes: 45, comments: [{id: 4, author: 'Priya', text: 'I need to try this one.'}] },
  { id: 5, author: 'Sam & Ben', message: 'Our couples scrapbook is coming along so nicely!', mediaUrl: 'https://picsum.photos/500/700', mediaType: 'image', likes: 153, comments: [] },
  { id: 6, author: 'Priya', message: 'Learning to love my own company.', mediaUrl: 'https://picsum.photos/500/350', mediaType: 'image', likes: 92, comments: [{id: 5, author: 'Maria', text: 'You go girl! ❤️'}] },
];

interface LoveWallProps {
  status: RelationshipStatus;
}

const LoveWall: React.FC<LoveWallProps> = ({ status }) => {
    const [posts, setPosts] = useState<LoveWallPostType[]>(initialPosts);
    const [newMessage, setNewMessage] = useState('');
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage || !mediaPreviewUrl || !mediaType) {
            alert('Please add a message and an image or video.');
            return;
        }
        const newPost: LoveWallPostType = {
            id: Date.now(),
            author: 'You',
            message: newMessage,
            mediaUrl: mediaPreviewUrl,
            mediaType: mediaType,
            likes: 0,
            comments: [],
        };
        setPosts([newPost, ...posts]);
        setNewMessage('');
        clearMedia();
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
                        
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600" disabled={!newMessage || !mediaPreviewUrl}>
                            Post to the Wall
                        </button>
                    </form>
                </div>
                
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {posts.map((post) => (
                        <LoveWallPost key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default LoveWall;