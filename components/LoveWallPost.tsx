import React from 'react';
import { LoveWallPost as LoveWallPostType, Comment } from '../types';
import { HeartIcon, PaperAirplaneIcon } from './icons';

interface LoveWallPostProps {
  post: LoveWallPostType;
}

const LoveWallPost: React.FC<LoveWallPostProps> = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);
  const [comments, setComments] = React.useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = React.useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObject: Comment = {
        id: Date.now(),
        author: 'You', // In a real app, this would be the current user's name
        text: newComment.trim(),
      };
      setComments([...comments, newCommentObject]);
      setNewComment('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden break-inside-avoid mb-4">
      {post.mediaType === 'image' ? (
        <img src={post.mediaUrl} alt="User submission" className="w-full h-auto object-cover" />
      ) : (
        <video src={post.mediaUrl} controls className="w-full h-auto bg-black" />
      )}
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-2">"{post.message}"</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">- {post.author}</p>
          <div className="flex items-center space-x-2">
            <button onClick={handleLike} className="focus:outline-none">
              <HeartIcon className={`w-6 h-6 transition-colors duration-300 ${liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-400'}`} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">{likeCount}</span>
          </div>
        </div>
      </div>
      
      {/* Comment Section */}
      <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Comments ({comments.length})</h4>
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
          {comments.map(comment => (
            <div key={comment.id} className="text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-purple-700 dark:text-purple-300">{comment.author}: </span>
                {comment.text}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet. Be the first!</p>
          )}
        </div>
        
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-1 focus:ring-pink-400 focus:border-transparent transition"
            aria-label="Add a comment"
          />
          <button type="submit" className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600" disabled={!newComment.trim()}>
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoveWallPost;