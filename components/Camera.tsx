import React, { useRef, useEffect, useCallback } from 'react';
import { ShutterIcon, XIcon } from './icons';

interface CameraProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions.");
        onClose();
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get the image data from the canvas
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        aria-label="Camera feed"
      ></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition"
        aria-label="Close camera"
      >
        <XIcon className="w-8 h-8" />
      </button>

      <div className="absolute bottom-8 flex justify-center w-full">
        <button
          onClick={handleCapture}
          className="p-4 rounded-full bg-white/30 backdrop-blur-sm border-4 border-white text-white hover:bg-white/50 transition-all duration-200"
          aria-label="Take picture"
        >
          <ShutterIcon className="w-16 h-16" />
        </button>
      </div>
    </div>
  );
};

export default Camera;