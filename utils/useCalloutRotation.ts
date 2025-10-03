import { useState, useEffect, useCallback } from 'react';
import { useThemeStore } from '../store/theme/useThemeStore';
import { t } from './i18n';

interface CalloutData {
  id: string;
  messageKey: string;
  iconName: string;
}

const CALLOUTS: CalloutData[] = [
  {
    id: 'voice-list',
    messageKey: 'callouts.voiceListKeywords',
    iconName: 'mic',
  },
  {
    id: 'camera-ocr',
    messageKey: 'callouts.richText',
    iconName: 'photo-camera',
  },
];

export const useCalloutRotation = () => {
  const { calloutsEnabled, currentLanguage } = useThemeStore();
  const [currentCallout, setCurrentCallout] = useState<CalloutData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedCallouts, setDismissedCallouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const showNextCallout = () => {
      // Find the next non-dismissed callout
      let nextIndex = currentIndex;
      let attempts = 0;

      while (attempts < CALLOUTS.length) {
        const selectedCallout = CALLOUTS[nextIndex];

        if (!dismissedCallouts.has(selectedCallout.id)) {
          setCurrentCallout(selectedCallout);
          setIsVisible(true);

          // Hide after 5 seconds
          hideTimer = setTimeout(() => {
            setIsVisible(false);
          }, 5000);

          setCurrentIndex((nextIndex + 1) % CALLOUTS.length);
          return;
        }

        nextIndex = (nextIndex + 1) % CALLOUTS.length;
        attempts++;
      }

      // If all callouts are dismissed, don't show any
    };

    // Only start showing callouts if they are enabled and there are non-dismissed ones
    if (calloutsEnabled && dismissedCallouts.size < CALLOUTS.length) {
      // Show first callout after 5 seconds
      showTimer = setTimeout(showNextCallout, 5000);

      // Then show callouts every 12 seconds (5s visible + 1s fade + 6s hidden)
      const intervalTimer = setInterval(showNextCallout, 12000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        clearInterval(intervalTimer);
      };
    } else if (!calloutsEnabled) {
      // If callouts are disabled, hide any current callout
      setIsVisible(false);
      setCurrentCallout(null);
    }
  }, [calloutsEnabled, dismissedCallouts, currentIndex, currentLanguage]);

  const handleCloseCallout = () => {
    if (currentCallout) {
      setDismissedCallouts((prev) => new Set(prev).add(currentCallout.id));
      setIsVisible(false);
    }
  };

  const resetCallouts = useCallback(() => {
    setDismissedCallouts(new Set());
    setCurrentIndex(0);
    setIsVisible(false);
    setCurrentCallout(null);
  }, []);

  return {
    currentCallout,
    isVisible,
    onCloseCallout: handleCloseCallout,
    resetCallouts,
  };
};