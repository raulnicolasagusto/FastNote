import { ColorScheme, Spacing, Typography } from '../types';

export const COLORS: ColorScheme = {
  background: '#E5E9ED', // Soft gray-blue background from design
  cardBackground: '#FFFFFF',
  textPrimary: '#2C3E50', // Dark blue-gray
  textSecondary: '#7F8C8D', // 50% opacity secondary text
  accent: {
    orange: '#FF6B35',
    blue: '#4A90E2',
    green: '#27AE60',
    purple: '#9B59B6',
    red: '#E74C3C',
  },
};

export const SPACING: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY: Typography = {
  titleSize: 18,
  bodySize: 14,
  dateSize: 12,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  card: 12,
  button: 8,
  input: 8,
  fab: 28,
};

// Default categories matching the design
// Exact categories from design with proper colors
export const DEFAULT_CATEGORIES = [
  {
    id: 'grocery',
    name: 'Grocery',
    color: COLORS.accent.green,
  },
  {
    id: 'projects',
    name: 'Projects',
    color: COLORS.accent.blue,
  },
  {
    id: 'goals',
    name: 'Goals',
    color: COLORS.accent.orange,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: COLORS.accent.purple,
  },
  {
    id: 'tennis',
    name: 'Tennis',
    color: COLORS.accent.blue,
  },
  {
    id: 'todo',
    name: 'To do list',
    color: COLORS.accent.red,
  },
];

// Tab categories from design
export const TAB_CATEGORIES = [
  { id: 'notes', name: 'Notes' },
  { id: 'voices', name: 'Voices' },
  { id: 'food', name: 'Food' },
  { id: 'projects', name: 'Projects' },
  { id: 'reminders', name: 'Reminders' },
];

// Screen dimensions and layout
export const LAYOUT = {
  headerHeight: 56,
  tabHeight: 48,
  fabSize: 56,
  fabMargin: 16,
  cardAspectRatio: 1.2,
  gridColumns: 2, // Mobile
  gridGutter: 8,
  screenPadding: 16,
  touchTargetSize: 48,
};
