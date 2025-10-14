import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FREE_TIER_LIMITS } from '../../constants/limits';

interface TranscriptionLimitsState {
  // Current usage
  transcriptionsToday: number;
  transcriptionsThisMonth: number; // in seconds (total duration)
  lastResetDate: string; // ISO date string for daily reset
  monthlyResetDate: string; // ISO date string for monthly reset

  // Actions
  canTranscribe: () => boolean;
  getRemainingTranscriptions: () => number;
  getRemainingMonthlyMinutes: () => number;
  getNextResetTime: () => string; // Returns formatted time until next reset
  recordTranscription: (durationSeconds: number) => Promise<void>;
  checkAndResetIfNeeded: () => Promise<void>;
  loadLimits: () => Promise<void>;
}

const STORAGE_KEY = '@fastnote_transcription_limits';

export const useTranscriptionLimitsStore = create<TranscriptionLimitsState>((set, get) => ({
  transcriptionsToday: 0,
  transcriptionsThisMonth: 0,
  lastResetDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  monthlyResetDate: new Date().toISOString().split('T')[0].substring(0, 7), // YYYY-MM

  canTranscribe: () => {
    const state = get();

    // Check daily limit
    if (state.transcriptionsToday >= FREE_TIER_LIMITS.DAILY_TRANSCRIPTIONS) {
      return false;
    }

    // Check monthly limit (convert seconds to minutes)
    const monthlyMinutesUsed = Math.floor(state.transcriptionsThisMonth / 60);
    if (monthlyMinutesUsed >= FREE_TIER_LIMITS.MONTHLY_MINUTES) {
      return false;
    }

    return true;
  },

  getRemainingTranscriptions: () => {
    const state = get();
    const remaining = FREE_TIER_LIMITS.DAILY_TRANSCRIPTIONS - state.transcriptionsToday;
    return Math.max(0, remaining);
  },

  getRemainingMonthlyMinutes: () => {
    const state = get();
    const monthlyMinutesUsed = Math.floor(state.transcriptionsThisMonth / 60);
    const remaining = FREE_TIER_LIMITS.MONTHLY_MINUTES - monthlyMinutesUsed;
    return Math.max(0, remaining);
  },

  getNextResetTime: () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  },

  recordTranscription: async (durationSeconds: number) => {
    const state = get();

    const newState = {
      transcriptionsToday: state.transcriptionsToday + 1,
      transcriptionsThisMonth: state.transcriptionsThisMonth + durationSeconds,
    };

    set(newState);

    // Persist to AsyncStorage
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...state,
          ...newState,
        })
      );
    } catch (error) {
      console.error('Failed to save transcription limits:', error);
    }
  },

  checkAndResetIfNeeded: async () => {
    const state = get();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const thisMonthStr = todayStr.substring(0, 7); // YYYY-MM

    let needsUpdate = false;
    const updates: Partial<TranscriptionLimitsState> = {};

    // Check if we need daily reset (new day)
    if (state.lastResetDate !== todayStr) {
      console.log('🔄 Daily transcription limit reset');
      updates.transcriptionsToday = 0;
      updates.lastResetDate = todayStr;
      needsUpdate = true;
    }

    // Check if we need monthly reset (new month)
    if (state.monthlyResetDate !== thisMonthStr) {
      console.log('🔄 Monthly transcription limit reset');
      updates.transcriptionsThisMonth = 0;
      updates.monthlyResetDate = thisMonthStr;
      needsUpdate = true;
    }

    if (needsUpdate) {
      set(updates);

      // Persist to AsyncStorage
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...state,
            ...updates,
          })
        );
      } catch (error) {
        console.error('Failed to save transcription limits after reset:', error);
      }
    }
  },

  loadLimits: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          transcriptionsToday: parsed.transcriptionsToday || 0,
          transcriptionsThisMonth: parsed.transcriptionsThisMonth || 0,
          lastResetDate: parsed.lastResetDate || new Date().toISOString().split('T')[0],
          monthlyResetDate: parsed.monthlyResetDate || new Date().toISOString().split('T')[0].substring(0, 7),
        });

        console.log('📊 Transcription limits loaded:', parsed);
      }

      // After loading, check if reset is needed
      await get().checkAndResetIfNeeded();
    } catch (error) {
      console.error('Failed to load transcription limits:', error);
    }
  },
}));
