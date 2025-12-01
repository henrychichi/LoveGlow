import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface AdModalProps {
  onReward: () => void;
}

const AD_DURATION = 5; // seconds

export const AdBanner: React.FC<{ className?: string }> = ({ className }) => {
  useEffect(() => {
    // Wrap in a timeout to allow layout to settle and prevent "No slot size" errors on initial render
    const timer = setTimeout(() => {
        try {
          // @ts-ignore
          if (window.adsbygoogle) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (e) {
             // Ignore AdMob specific errors in development/mock env
             console.warn("AdMob initialization warning:", e);
        }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${className} min-h-[60px]`}>
        <p className="text-[10px] text-gray-400 mb-1">Sponsored</p>
        <div className="bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 w-full max-w-[320px] h-[50px] flex items-center justify-center text-xs text-gray-400 relative overflow-hidden rounded-md min-w-[300px]">
            <span className="z-10 pointer-events-none">AdMob Banner</span>
            {/* 
              In a real app, this <ins> tag is populated by AdMob script.
              We are using a placeholder structure here.
            */}
            <ins className="adsbygoogle absolute inset-0"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-0000000000000000"
                data-ad-slot="0000000000"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    </div>
  );
};

const AdModal: React.FC<AdModalProps> = ({ onReward }) => {
  const [countdown, setCountdown] = useState(AD_DURATION);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const canClose = countdown === 0;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60] text-white animate-fade-in">
      {/* Ad Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black text-xs font-bold px-1 rounded">Ad</span>
            <span className="text-sm font-semibold">Sponsor Message</span>
        </div>
        
        {canClose ? (
            <button 
                onClick={onReward} 
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close ad"
            >
                <XIcon className="w-5 h-5" />
            </button>
        ) : (
            <div className="text-sm text-gray-300 font-mono">
                {countdown}s
            </div>
        )}
      </div>

      {/* Ad Content */}
      <div className="w-full max-w-sm aspect-[9/16] max-h-[70vh] bg-white text-black rounded-lg overflow-hidden relative shadow-2xl mx-4">
        <img 
            src="https://picsum.photos/id/42/800/1200" 
            alt="Advertisement" 
            className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-20">
            <h3 className="text-xl font-bold mb-1">Premium Coffee</h3>
            <p className="text-sm text-gray-200 mb-4">Start your morning with the perfect brew.</p>
            <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={() => window.open('https://example.com', '_blank')}
            >
                Learn More
            </button>
        </div>
      </div>
      
       {/* Progress Bar */}
       <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div 
              className="h-full bg-blue-500 transition-all duration-1000 linear" 
              style={{ width: `${((AD_DURATION - countdown) / AD_DURATION) * 100}%` }}
          ></div>
       </div>

    </div>
  );
};

export default AdModal;