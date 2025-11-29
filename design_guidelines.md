# Design Guidelines: Shahzad Akram Artist Portfolio

## Design Approach
**Reference-Based Approach** drawing inspiration from Behance, Awwwards-winning creative portfolios, and Dribbble. Focus on immersive storytelling, bold typography, and fluid interactions that showcase artistic work as the hero.

## Core Design Principles
1. **Art-First Philosophy**: Artwork is the primary focal point; UI elements support, never compete
2. **Kinetic Energy**: Smooth, purposeful animations create flow and artistic atmosphere
3. **Spatial Depth**: Parallax and layering create dimensionality
4. **Adaptive Canvas**: Seamless responsiveness across all devices

## Typography System
- **Display Font**: High-impact serif or artistic display font for artist name and section headers (Google Fonts: Playfair Display, Cormorant Garamond)
- **Body Font**: Clean sans-serif for readability (Inter, Work Sans)
- **Hierarchy**: 
  - Hero title: text-6xl to text-8xl (72-96px)
  - Section headers: text-4xl to text-5xl (36-48px)
  - Artwork titles: text-2xl to text-3xl (24-36px)
  - Body text: text-base to text-lg (16-18px)

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 24 for consistent rhythm (p-4, m-8, gap-12, etc.)

**Grid Structure**:
- Container: max-w-7xl with px-4 to px-8 responsive padding
- Masonry grid for artwork gallery (3 columns desktop, 2 tablet, 1 mobile)
- Asymmetric layouts for visual interest

## Page Structure & Sections

### 1. Loading Animation
Artistic pre-loader featuring animated paintbrush strokes forming the artist's initials "SA" or abstract paint splash morphing into logo. Duration: 2-3 seconds with fade-out transition.

### 2. Hero Section
- Full viewport height (h-screen) with parallax background
- Large profile image (circular or artistic frame treatment) positioned off-center
- Artist name in oversized display typography
- Tagline/artistic statement in elegant script
- Smooth scroll indicator at bottom
- Parallax depth: Background moves slower than foreground elements

### 3. Featured Artwork Gallery (Primary Section)
- **Layout**: Pinterest-style masonry grid with varying heights
- **Card Design**: Artwork image with subtle overlay on hover revealing title and medium
- **Interactions**: Click to expand full-screen view with details
- **Spacing**: gap-6 to gap-8 between items
- **Admin Upload Button**: Floating action button (FAB) bottom-right, only visible when authenticated

### 4. About/Artist Statement
- Two-column layout (desktop): Text content + secondary profile image or artistic photo
- Single column (mobile) with stacked content
- Generous padding: py-24 to py-32

### 5. Certifications & Achievements
- Card-based grid layout (2-3 columns desktop)
- Each card: Certificate image thumbnail, title, issuing organization, date
- Elegant border treatments with subtle elevation
- Admin upload interface integrated seamlessly

### 6. Contact Section
- Split layout: Contact form (60%) + Contact information (40%)
- Form fields: Name, Email, Message with artistic input styling
- Submits to alyakram786@gmail.com via backend integration
- Minimal, focused design with clear CTAs

### 7. Footer
- **Layout**: Three-column grid (desktop): About snippet, Quick links, Download section
- **Download Button**: Prominent button with icon (download cloud or similar) that triggers source code download
- Social media links with icon-only buttons
- Copyright and artist name
- Padding: py-16 to py-20

## Component Library

### Artwork Cards
- Aspect ratio: Variable (maintains original artwork proportions)
- Hover state: Subtle scale (1.02-1.05) with smooth transition
- Overlay gradient on hover for title visibility
- Click action: Modal/lightbox with full-screen artwork view

### Navigation
- Fixed header with blur backdrop effect (backdrop-blur-md)
- Logo/artist name left, navigation links center/right
- Theme toggle button (sun/moon icon) for light/dark mode
- Hamburger menu for mobile (slides in from right)
- Smooth scroll to sections

### Modal/Lightbox
- Full-screen overlay with centered artwork
- Close button (X) top-right
- Navigation arrows for gallery browsing
- Artwork title, medium, dimensions below image

### Admin Upload Interface
- Hidden behind authentication (password-protected route)
- Drag-and-drop upload zones with visual feedback
- Image preview before submission
- Fields: Title, Medium, Dimensions, Description
- Similar interface for certifications

### Theme Switcher
- Toggle control in header
- Additional gradient palette selector (dropdown or side panel)
- Multiple preset artistic color schemes
- Smooth transition between themes (transition-all duration-300)

## Parallax & Animation Strategy

### Parallax Effects
- Hero section: Background layer moves at 0.5x scroll speed
- Section headers: Stagger fade-in as they enter viewport
- Artwork grid: Items parallax at varying speeds (subtle, 0.8-1.2x)

### Page Transitions
- Smooth scroll behavior throughout
- Section fade-ins with slight upward motion (translate-y)
- Staggered animations for grid items (delay-[100ms], delay-[200ms], etc.)

### Micro-interactions
- Button hover: Subtle scale (1.05) with smooth transition
- Card hover: Gentle lift effect (shadow expansion)
- Link underline animations
- Form input focus states with border glow

**Animation Timing**: transition-all duration-300 ease-in-out as default

## Responsive Breakpoints
- Mobile: Base (0-640px) - Single column, stacked layout
- Tablet: md (768px+) - Two columns, reduced spacing
- Desktop: lg (1024px+) - Full multi-column layouts, maximum spacing
- Large screens: xl (1280px+) - Centered max-width container

## Images
**Profile Image**: Circular frame (rounded-full) in hero section, diameter 200-300px desktop, 150px mobile. Artistic border or frame treatment optional.

**Artwork Images**: High-quality, various aspect ratios preserved. Lazy loading with blur-up placeholder.

**Certification Images**: Thumbnail size in grid, full size in modal. Standardized aspect ratio (16:9 or 4:3) with object-fit cover.

## Performance Considerations
- Next.js Image component for all images with optimization
- Lazy loading for artwork gallery (load on scroll)
- Code splitting for admin routes
- Minimal animation library usage (prefer CSS transforms)
- Intersection Observer for scroll-triggered animations

## Accessibility
- High contrast text ratios
- Keyboard navigation for all interactive elements
- ARIA labels for icon buttons
- Focus indicators on all focusable elements
- Alt text for all artwork images