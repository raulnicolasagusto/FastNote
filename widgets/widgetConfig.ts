// Widget configuration and constants

export const WIDGET_SIZES = {
  small: 'NoteWidgetSmall',
  medium: 'NoteWidgetMedium',
  large: 'NoteWidgetLarge',
} as const;

export type WidgetSize = keyof typeof WIDGET_SIZES;

export const WIDGET_DIMENSIONS = {
  small: { width: 110, height: 110 },
  medium: { width: 250, height: 110 },
  large: { width: 250, height: 250 },
} as const;

// Widget storage keys
export const WIDGET_STORAGE_KEY = '@fastnote_widget_config';

export interface WidgetConfig {
  noteId: string;
  size: WidgetSize;
  widgetName: string;
}

// Helper to get widget name from size
export const getWidgetName = (size: WidgetSize): string => {
  return WIDGET_SIZES[size];
};

// Helper to truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Helper to strip HTML tags
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Widget background colors mapping
export const WIDGET_BG_COLORS: Record<string, string> = {
  yellow: '#FFF9C4',
  cream: '#FFF8E1',
  peach: '#FFE0B2',
  pink: '#FCE4EC',
  lavender: '#E1BEE7',
  mint: '#C8E6C9',
  sky: '#B3E5FC',
  default: '#FFFFFF',
};
