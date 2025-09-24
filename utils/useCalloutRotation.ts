import { useState, useEffect } from 'react';

interface CalloutData {
  id: string;
  message: string;
  iconName: string;
  keywords?: string[];
}

const CALLOUTS: CalloutData[] = [
  {
    id: 'voice-list',
    message: 'Puedes crear una lista diciendo: ',
    iconName: 'mic',
    keywords: [
      'nueva lista',
      'lista nueva',
      'lista de compras',
      'lista de tareas',
      'shopping list',
      'to do list'
    ],
  },
  {
    id: 'camera-ocr',
    message: 'Puedes sacar una foto a un texto o cargar una imagen y la IA lo convertirá en texto editable',
    iconName: 'photo-camera',
  },
];

export const useCalloutRotation = () => {
  const [currentCallout, setCurrentCallout] = useState<CalloutData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const showNextCallout = () => {
      // Select callout based on current index (alternating)
      const selectedCallout = CALLOUTS[currentIndex];

      setCurrentCallout(selectedCallout);
      setIsVisible(true);

      // Hide after 5 seconds
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      // Move to next callout for next time
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CALLOUTS.length);
    };

    // Show first callout after 5 seconds
    showTimer = setTimeout(showNextCallout, 5000);

    // Then show callouts every 12 seconds (5s visible + 1s fade + 6s hidden)
    const intervalTimer = setInterval(showNextCallout, 12000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(intervalTimer);
    };
  }, [currentIndex]);

  return {
    currentCallout,
    isVisible,
  };
};