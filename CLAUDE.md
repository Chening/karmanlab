# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KarmaLab is an interactive learning guidance webpage designed for middle school students studying physics, chemistry, and mathematics. It features a circular theme design and acts as an AI Learning Coach to provide personalized, encouraging educational support.

## Repository Structure

- `index.html` - Main webpage with circular theme design for subject navigation
- `styles.css` - Complete CSS styling with circular elements, animations, and responsive design
- `script.js` - Interactive JavaScript featuring the LearningCoach class with modal dialogs and notifications
- `package.json` - Project configuration and metadata
- `README.md` - Basic project documentation
- `CLAUDE.md` - This guidance file

## Development Commands

To run the development server:
```bash
npm start
# or
npm run dev
# or
python -m http.server 8000
```

The site will be available at `http://localhost:8000`

## Architecture Overview

### Core Components

1. **LearningCoach Class** (`script.js`): Main interactive controller
   - Manages subject content for Physics (物理), Chemistry (化学), Mathematics (数学)
   - Provides encouragement system and learning tips
   - Handles modal dialogs and notifications
   - Implements click events and animations

2. **Circular Theme Design** (`styles.css`):
   - Subject circles with hover animations and color coding
   - Physics: Blue theme (#3b82f6)
   - Chemistry: Green theme (#10b981) 
   - Mathematics: Purple theme (#8b5cf6)
   - Responsive design with mobile breakpoints

3. **Interactive Features**:
   - Subject modal dialogs with learning topics
   - Notification system for encouragement
   - Animated elements with smooth transitions
   - Keyboard shortcuts (h for help, e for encouragement)

### Subject Content Structure

Each subject contains:
- Name and icon
- Color theme
- Learning topics with descriptions
- Interactive topic cards

### Styling Approach

- CSS Grid for responsive layouts
- Flexbox for component alignment
- CSS animations and transitions
- Circular design patterns throughout
- Mobile-first responsive design

## Development Notes

- Pure HTML/CSS/JavaScript implementation (no frameworks)
- Chinese language content for middle school students
- Circular theme implemented throughout the design
- Interactive notifications and modal system built from scratch
- Educational content focused on Physics, Chemistry, and Mathematics subjects