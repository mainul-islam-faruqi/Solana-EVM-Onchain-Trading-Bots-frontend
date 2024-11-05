// Define color values
export const COLORS = {
  darkest: '10002B',    // Darkest background
  darker: '240046',     // Dark background
  dark: '3C096C',       // Secondary background
  primary: '5A189A',    // Primary color
  secondary: '7B2CBF',  // Secondary actions
  accent: '9D4EDD',     // Accent color
  light: 'C77DFF',      // Light accents
  lightest: 'E0AAFF',   // Highlights
} as const

// Create Tailwind color config
export const tailwindColors = {
  darkest: `#${COLORS.darkest}`,
  darker: `#${COLORS.darker}`,
  dark: `#${COLORS.dark}`,
  primary: `#${COLORS.primary}`,
  secondary: `#${COLORS.secondary}`,
  accent: `#${COLORS.accent}`,
  light: `#${COLORS.light}`,
  lightest: `#${COLORS.lightest}`,
}

// Create opacity variants
export const colorWithOpacity = {
  darkestAlpha: `#${COLORS.darkest}cc`,
  darkerAlpha: `#${COLORS.darker}cc`,
  primaryAlpha: `#${COLORS.primary}80`,
  accentAlpha: `#${COLORS.accent}80`,
  lightAlpha: `#${COLORS.light}4d`,
}

// Create semantic colors
export const statusColors = {
  success: '#4CC9F0',
  error: '#F72585',
  warning: '#FFB86C',
  info: `#${COLORS.accent}`,
}

// Create text color variations
export const textColors = {
  // Primary text colors
  primary: `#${COLORS.lightest}`,       // Brightest text - E0AAFF
  secondary: `#${COLORS.light}`,        // Secondary text - C77DFF
  tertiary: `#${COLORS.accent}`,        // Tertiary text - 9D4EDD
  
  // Text with opacity
  primaryMuted: `#${COLORS.lightest}cc`, // 80% opacity
  secondaryMuted: `#${COLORS.light}cc`,  // 80% opacity
  tertiaryMuted: `#${COLORS.accent}cc`,  // 80% opacity
  
  // Special text colors
  heading: `#${COLORS.lightest}`,        // For headings
  body: `#${COLORS.light}`,              // For body text
  muted: `#${COLORS.accent}99`,          // For muted text (60% opacity)
  disabled: `#${COLORS.accent}66`,       // For disabled text (40% opacity)
  
  // Interactive text colors
  hover: `#${COLORS.lightest}`,          // Text color on hover
  active: `#${COLORS.light}`,            // Text color when active
  link: `#${COLORS.accent}`,             // For links
  linkHover: `#${COLORS.light}`,         // Links on hover
}

// Create gradients
export const gradients = {
  primary: `linear-gradient(to right, #${COLORS.primary}, #${COLORS.accent})`,
  background: `linear-gradient(to bottom, #${COLORS.darkest}, #${COLORS.dark})`,
  accent: `linear-gradient(to right, #${COLORS.secondary}, #${COLORS.light})`,
  text: `linear-gradient(to right, #${COLORS.light}, #${COLORS.lightest})`, // For gradient text
} 