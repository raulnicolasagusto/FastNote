# FastNote UI Development Plan

## Screen Architecture Overview

### Navigation Hierarchy
```
Root Navigator
├── Main Tab Navigator
│   ├── Notes Screen (Default)
│   ├── Voices Screen
│   ├── Food Screen
│   ├── Projects Screen
│   └── Reminders Screen
├── Note Editor Screen (Modal)
├── Search Screen (Modal)
└── Settings Screen (Stack)
```

## 1. Main Notes Screen (Home)

### Layout Structure
```
Container
├── Header Bar
│   ├── Title ("Notes")
│   ├── Search Icon Button
│   └── Menu Icon Button
├── Tab Bar (Horizontal Scroll)
│   └── Tab Items (Notes, Voices, Food, Projects, Reminders)
├── ScrollView (Vertical)
│   └── Card Grid Container (2 columns)
│       └── Note Cards
└── Floating Action Button (FAB)
```
### IMPORTANT **Designe File**: USE THE DESIGNE FROM E:\programacion\trabajos\FastNote\llm\design\page1HomeScreen.png, IS VERY IMPORTANT THAT MAIN NOTES SCREEN LOOK LIKE THIS IMAGE, PAY ATENTION TO THE DETAILS.

### Components

#### Header Bar
- **Container**: Fixed height (56dp), full width
- **Title Text**: Left-aligned, single line
- **Search Button**: 24x24dp icon, right side
- **Menu Button**: 24x24dp icon, rightmost position

#### Tab Bar
- **Container**: Horizontal scrollable, 48dp height
- **Tab Item**: 
  - Text label
  - Active indicator (underline, 2dp)
  - Padding between items (16dp)
  - Touch target (minimum 48x48dp)

#### Note Card
- **Container**: Aspect ratio 1:1.2
### IMPORTANT **Designe File**: USE THE DESIGNE FROM E:\programacion\trabajos\FastNote\llm\design\page3NoteOpen.png ( IS IN DARK MODE BUT YOU MAKE IT REGULAR MODE), IS VERY IMPORTANT THAT MAIN NOTES SCREEN LOOK LIKE THIS IMAGE, PAY ATENTION TO THE DETAILS.
- **Layout**:
  ```
  Card Container
  ├── Header Section
  │   ├── Title Text (max 2 lines)
  │   └── Date Text (single line)
  ├── Content Preview Section
  │   ├── Text Preview (max 3 lines) OR
  │   ├── Checklist Preview (max 3 items) OR
  │   └── Mixed Content Preview
  ├── Image Thumbnail Row (if images exist)
  │   └── Image Thumbnails (max 3 visible)
  └── Category Indicator Dot
  ```

#### Floating Action Button
- **Size**: 56x56dp
- **Icon**: Plus sign (24x24dp)
- **Position**: Bottom right, 16dp margin

## 2. Note Editor Screen

### IMPORTANT **Designe File**: USE THE DESIGNE FROM E:\programacion\trabajos\FastNote\llm\design\page2newNote.png, IS VERY IMPORTANT THAT MAIN NOTES SCREEN LOOK LIKE THIS IMAGE, PAY ATENTION TO THE DETAILS.

### Layout Structure
```
Container
├── App Bar
│   ├── Back Button
│   ├── Title ("New Note" / "Edit Note")
│   └── Action Menu
│       ├── Share Button
│       ├── Archive Button
│       └── Delete Button
├── ScrollView
│   ├── Title Input Field
│   ├── Date Display
│   ├── Category Selector
│   ├── Content Editor Container
│   │   ├── Text Editor OR
│   │   ├── Checklist Editor OR
│   │   └── Mixed Content Editor
│   └── Image Container
└── Bottom Toolbar
    ├── Text Format Button
    ├── Checklist Button
    ├── Image Button
    └── More Options Button
```

### Components

#### Title Input Field
- **Type**: EditText/TextInput
- **Properties**: 
  - Single line
  - No border
  - Placeholder: "Add Title"
  - Max characters: 100

#### Date Display
- **Type**: TextView/Text
- **Format**: "28/7/2022" or localized format
- **Position**: Below title
- **Interaction**: Non-editable

#### Category Selector
- **Type**: Horizontal chip group
- **Chips**: 
  - Circular selection indicators
  - Single selection mode
  - Scrollable if overflow

#### Content Editor Container

##### Text Editor Mode
- **Type**: Multiline EditText/TextInput
- **Properties**:
  - Auto-expand height
  - No fixed line limit
  - Placeholder: "Start typing..."
  - Text selection tools

##### Checklist Editor Mode
```
Container
└── Checklist Items List
    └── Checklist Item (Repeatable)
        ├── Checkbox
        ├── Text Input
        ├── Delete Button
        └── Drag Handle
```

**Checklist Item Components**:
- **Checkbox**: 24x24dp, left side
- **Text Input**: Flexible width, single line
- **Delete Button**: 20x20dp, appears on hover/focus
- **Drag Handle**: 24x24dp, right side
- **Add Item Button**: Full width, dashed border

##### Mixed Content Mode
- **Structure**: Blocks of content types
- **Block Types**:
  - Text blocks
  - Checklist blocks
  - Image blocks
- **Block Actions**: Add, delete, reorder

#### Image Container
```
Container
├── Image Grid (2 columns)
│   └── Image Cells
│       ├── Image Thumbnail
│       ├── Remove Button (overlay)
│       └── View Button (overlay)
└── Add Image Button
```

#### Bottom Toolbar
- **Height**: 56dp
- **Buttons**: Icon only, 48x48dp touch targets
- **Dividers**: 1dp vertical lines between buttons

## 3. Search Screen

### Layout Structure
```
Container
├── Search Header
│   ├── Back Button
│   ├── Search Input Field
│   └── Clear Button
├── Filter Chips Container
│   └── Filter Chips (Categories, Date Range, Type)
├── Results Container
│   ├── Results Count Text
│   └── Results List
│       └── Search Result Items
└── Empty State View
```

### Components

#### Search Input Field
- **Type**: EditText with search icon
- **Properties**:
  - Auto-focus on open
  - Clear button when text present
  - Search suggestions dropdown

#### Filter Chips
- **Type**: Horizontal scrolling chip group
- **Chip States**: Default, Selected
- **Chip Types**: Category, Date, Content Type

#### Search Result Item
```
Container
├── Title Text
├── Content Snippet (with highlighted terms)
├── Metadata Row
│   ├── Category Dot
│   ├── Date Text
│   └── Content Type Icon
└── Divider
```

## 4. Category Screens (Grocery, Projects, Goals, Shopping)

### Layout Structure
```
Container
├── Header Bar
│   ├── Back Button
│   ├── Category Title
│   └── Filter Button
├── Sub-navigation (if applicable)
│   └── Sub-category Tabs
├── Content Container
│   └── Note Cards (Category-filtered)
└── FAB
```

### Specific Layouts

#### Grocery Category
- **Additional Components**:
  - Quick Add Bar (top)
  - Completed Items Toggle
  - Sort by Store/Category Option

#### Projects Category
- **Additional Components**:
  - Project Status Filters (Active, Completed, Archived)
  - Progress Indicators on Cards
  - Due Date Badges

## 5. Settings Screen

### Layout Structure
```
Container
├── App Bar
│   ├── Back Button
│   └── Title ("Settings")
└── ScrollView
    ├── Account Section
    │   ├── Profile Item
    │   └── Sync Settings Item
    ├── Appearance Section
    │   ├── Theme Selector
    │   └── Font Size Slider
    ├── Categories Section
    │   ├── Manage Categories Item
    │   └── Default Category Selector
    ├── Data Section
    │   ├── Export Notes
    │   ├── Import Notes
    │   └── Clear All Data
    └── About Section
        ├── Version Info
        └── Help & Feedback
```

## 6. Empty States

### Components for Each Screen

#### Notes Screen Empty State
```
Container
├── Illustration/Icon
├── Title Text ("No notes yet")
├── Description Text
└── CTA Button ("Create First Note")
```

#### Search Empty State
```
Container
├── Icon
├── Title ("No results found")
├── Suggestion Text
└── Clear Filters Button
```

## 7. Dialogs and Modals

### Delete Confirmation Dialog
```
Container
├── Title ("Delete Note?")
├── Message Text
├── Cancel Button
└── Delete Button
```

### Category Picker Modal
```
Container
├── Title ("Choose Category")
├── Category List
│   └── Category Items
│       ├── Color Indicator
│       ├── Category Name
│       └── Radio Button
└── Action Buttons
    ├── Cancel
    └── Select
```

### Image Viewer Modal
```
Container
├── Close Button (overlay)
├── Image View (zoomable)
├── Image Counter ("1/5")
└── Action Bar
    ├── Share Button
    ├── Delete Button
    └── Info Button
```

## 8. Component States

### Note Card States
- **Default**: Normal display
- **Pressed**: Elevation change
- **Long Press**: Selection mode activation
- **Selected**: Checkbox overlay appears
- **Disabled**: Reduced opacity

### Checklist Item States
- **Unchecked**: Empty checkbox
- **Checked**: Filled checkbox with checkmark
- **Disabled**: Grayed out
- **Dragging**: Elevated with shadow

### Button States
- **Default**: Normal
- **Pressed**: Ripple effect
- **Disabled**: Reduced opacity
- **Loading**: Spinner replacement

## 9. Gesture Interactions

### Swipe Gestures
- **Note Card Swipe Left**: Archive action
- **Note Card Swipe Right**: Delete action
- **Tab Bar Swipe**: Navigate between tabs

### Long Press Actions
- **Note Card**: Enter selection mode
- **Checklist Item**: Reorder mode
- **Image**: Quick preview

### Drag and Drop
- **Checklist Items**: Reorder within list
- **Note Cards**: Reorder in grid (optional)
- **Images**: Reorder in note

## 10. Responsive Breakpoints

### Phone Portrait
- **Grid**: 2 columns
- **Margins**: 16dp
- **Gutter**: 8dp

### Phone Landscape
- **Grid**: 3 columns
- **Margins**: 24dp
- **Gutter**: 12dp

### Tablet Portrait
- **Grid**: 3 columns
- **Margins**: 24dp
- **Gutter**: 16dp
- **Master-detail layout for editor**

### Tablet Landscape
- **Grid**: 4-5 columns
- **Margins**: 32dp
- **Gutter**: 16dp
- **Split view option**

## 11. Accessibility Components

### Screen Reader Elements
- **Content Descriptions**: All images and icons
- **Heading Markers**: Section titles
- **Action Announcements**: State changes
- **Focus Indicators**: Visible focus rings

### Keyboard Navigation
- **Tab Order**: Logical flow
- **Skip Links**: Jump to main content
- **Keyboard Shortcuts**: Common actions

## 12. Loading and Transition States

### Loading Indicators
- **Full Screen Loader**: App launch
- **Skeleton Screens**: Card placeholders
- **Pull to Refresh**: Notes list
- **Progress Bars**: Image uploads

### Transitions
- **Screen Transitions**: Slide horizontally for navigation
- **Modal Transitions**: Slide up from bottom
- **Card Animations**: Fade and scale
- **List Item Animations**: Stagger on load

## 13. Error States

### Error Components
```
Container
├── Error Icon
├── Error Title
├── Error Description
└── Retry Button
```

### Error Types
- **No Internet**: Offline message with retry
- **Sync Failed**: Warning with manual sync option
- **Load Failed**: Reload button
- **Save Failed**: Auto-retry with notification

This comprehensive UI development plan provides the complete blueprint for implementing the FastNote application's user interface, ensuring consistency and completeness across all screens and interaction states.