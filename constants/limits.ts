/**
 * Free Tier Limits for Transcription Service
 *
 * These limits apply before implementing RevenueCat premium tiers.
 * See CLAUDE.md for full monetization strategy.
 */

export const FREE_TIER_LIMITS = {
  /**
   * Maximum transcriptions per day (resets at midnight)
   */
  DAILY_TRANSCRIPTIONS: 3,

  /**
   * Maximum duration per transcription (in seconds)
   */
  MAX_DURATION_SECONDS: 60, // 1 minute

  /**
   * Maximum total minutes per month
   */
  MONTHLY_MINUTES: 90,

  /**
   * Warning threshold (show visual warning at 55 seconds)
   */
  WARNING_THRESHOLD_SECONDS: 55,
} as const;
