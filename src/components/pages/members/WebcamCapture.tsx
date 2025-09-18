import React, { useCallback, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string | null) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const webcamRef = React.useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc); // Store the captured image
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retakePhoto = () => {
    setCapturedImage(null); // Reset the captured image to retake
    setIsEditing(false); // Reset edit mode
  };

  const editPhoto = () => {
    setIsEditing(true); // Enable edit mode
  };

  return (
    <div className="my-4">
      {!capturedImage ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            className="rounded-lg"
          />
          <button
            type="button"
            onClick={capture}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Capture Photo
          </button>
        </div>
      ) : (
        <div>
          <img src={capturedImage} alt="Captured" className="rounded-lg" />
          {!isEditing && (
            <div className="mt-2">
              <button
                type="button"
                onClick={retakePhoto}
                className="mr-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={editPhoto}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Edit Photo
              </button>
            </div>
          )}
          {isEditing && (
            <div className="mt-4">
              <p className="text-sm">Edit Mode: Add your editing logic here (e.g., cropping, filters).</p>
              {/* You can add an image editor library here for real-time edits */}
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Done Editing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
