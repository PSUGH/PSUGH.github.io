# PowerShell Usergroup Hannover Website 🚀

[![Deploy to GitHub Pages](https://github.com/PSUGH/PSUGH.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/PSUGH/PSUGH.github.io/actions/workflows/deploy.yml)
[![License: CC BY 3.0](https://img.shields.io/badge/License-CC%20BY%203.0-lightgrey.svg)](https://creativecommons.org/licenses/by/3.0/)

Modern, accessible website for the PowerShell Usergroup Hannover (PSUGH) built with semantic HTML, modern CSS, and deployed on GitHub Pages.

## 🌐 Live Website

Visit us at: **[https://www.psugh.org](https://www.psugh.org)**

## ✨ Features

- **Modern Design**: Clean, professional design with CSS Grid and Flexbox
- **Fully Responsive**: Optimized for all devices and screen sizes with enhanced mobile navigation
- **Mobile Optimized**: Touch-friendly interface with glassmorphism hamburger menu and centered buttons
- **Accessible**: WCAG 2.1 compliant with proper semantic HTML and ARIA labels
- **Performance Optimized**: Fast loading with optimized images and CSS
- **SEO Ready**: Meta tags, structured data, and Open Graph support
- **Dynamic Content**: Meeting and event information managed via JSON files
- **Organized Data Structure**: Separated data files for better maintainability
- **Interactive Events Page**: Calendar view with upcoming and past events (future events prioritized)
- **Social Integration**: Links to Twitter, Mastodon, GitHub, and Discord

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern CSS with custom properties, Grid, and Flexbox
- **JavaScript**: Vanilla JS for interactive features
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: Automated deployment and linting

## 📁 Project Structure

```text
PSUGH.github.io/
├── .github/workflows/       # GitHub Actions workflows
├── css/                     # Stylesheets
│   ├── normalize.css        # CSS reset
│   └── styles.css           # Main styles (mobile-optimized)
├── fonts/                   # Local font files
├── img/                     # Images and assets
├── current-meeting.json     # Current/next meeting info
├── past-events.json         # Historical events with materials
├── upcoming-events.json     # Planned future events
├── index.html              # Homepage
├── events.html             # Events page with calendar
├── impressum.html          # Legal notice
├── DATA-STRUCTURE.md       # Technical documentation
├── MEETING-CONTENT.md      # Content management guide
└── package.json            # Node.js configuration
```

## 🚀 Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/PSUGH/PSUGH.github.io.git
   cd PSUGH.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   This will start a live server at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build optimized version for production
- `npm run lint-css` - Lint CSS files
- `npm run lint-html` - Lint HTML files
- `npm run validate` - Run all linting checks
- `npm run serve` - Start production server
- `npm run preview` - Build and serve production version

## 📝 Content Management

### Updating Meeting Information

Edit the respective JSON files to update meeting information:

- `current-meeting.json` - Current/next meeting information
- `past-events.json` - Historical events and materials
- `upcoming-events.json` - Planned future events

```json
// current-meeting.json
{
  "nextMeeting": {
    "date": "Freitag, den 20.06.2025, ab 18:30h",
    "topics": [
      {
        "title": "🚀 Your Next Topic Title 🚀",
        "description": "Topic description with details"
      }
    ]
  }
}
```

For detailed instructions, see `MEETING-CONTENT.md`.

### Adding New Content

The website uses semantic HTML structure with the following pages:

#### Homepage (`index.html`)

- Hero header with responsive navigation
- Next meeting information (loaded from `current-meeting.json`)
- PowerShell terminal example
- About section
- Contact and social links

#### Events Page (`events.html`)

- Interactive calendar view showing all meetings
- **Upcoming events section** (prioritized - shown first)
- **Past events section** with recordings and materials
- Mobile-optimized event cards with touch-friendly buttons

The events page prioritizes future events by displaying "Kommende Treffen" before "Vergangene Treffen" for better user experience.

## 🎨 Design System

The website uses a modern design system with:

- **Colors**: Primary blue (`#0073AE`), accent orange (`#FF4500`)
- **Typography**: Inter font family with Roboto fallback
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Components**: Reusable button styles and card components

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile First

The website is built with a mobile-first approach featuring:

- **Enhanced Mobile Navigation**: Glassmorphism hamburger menu with smooth animations
- **Centered Logo**: Properly centered logo on all mobile screen sizes
- **Touch-Friendly Interface**: Optimized button sizes and spacing for mobile devices
- **Responsive Button Layout**: All action buttons center correctly on mobile
- **Smooth Transitions**: Opacity/visibility-based animations for better performance
- **Improved Accessibility**: Enhanced focus states and keyboard navigation
- **Responsive Breakpoints**: Optimized layouts for different screen sizes (320px, 480px, 768px+)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Skip links for navigation

## 🔧 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment

1. Build the site: `npm run build`
2. Commit and push changes
3. GitHub Actions will handle the deployment

## 🆕 Recent Improvements

### Mobile Enhancements

- **Fixed navigation**: Logo centering and improved hamburger menu visibility
- **Enhanced button layout**: All call-to-action buttons now center properly on mobile
- **Glassmorphism effects**: Modern visual styling for navigation elements
- **Smooth animations**: Performance-optimized transitions using opacity/visibility

### Data Structure Modernization

- **Separated data files**: Split single `meeting-data.json` into three focused files:
  - `current-meeting.json` - Next meeting information
  - `past-events.json` - Historical events with materials/recordings
  - `upcoming-events.json` - Planned future events
- **Improved maintainability**: Easier content management and better performance
- **Enhanced error handling**: Independent loading prevents single-point failures

### User Experience Improvements

- **Prioritized upcoming events**: Events page now shows future meetings before past ones
- **Interactive calendar**: Visual calendar view with event indicators
- **Better content organization**: Clear separation between different types of content

## 📊 Analytics & Performance

- Lighthouse score optimization
- Core Web Vitals monitoring
- SEO best practices implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test them
4. Run linting: `npm run validate`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a Pull Request

### Code Style

- Use semantic HTML
- Follow CSS custom property naming conventions
- Ensure accessibility compliance
- Test on multiple devices and browsers
- Validate JSON files for syntax correctness

### Data Structure Guidelines

- **Current meeting data**: Update `current-meeting.json` before each meeting
- **Past events**: Move completed meetings to `past-events.json` with materials/recordings
- **Future planning**: Add planned events to `upcoming-events.json`
- **Documentation**: Update `MEETING-CONTENT.md` for content changes, `DATA-STRUCTURE.md` for technical changes

## 📄 License

This project is licensed under the [Creative Commons Attribution 3.0 License](https://creativecommons.org/licenses/by/3.0/de/).

## 🙋‍♂️ Support

- **Discord**: [Join our Discord server](https://discord.com/invite/eZCfJtBHqk)
- **GitHub Issues**: [Report bugs or request features](https://github.com/PSUGH/PSUGH.github.io/issues)
- **Meetup**: [PSUGH Meetup Group](https://www.meetup.com/psugh-hannover/)

## 📅 Meeting Schedule

We meet every **3rd Friday** of the month at:

**Netz-Weise**  
Freundallee 13A  
30173 Hannover

Next meeting: **Friday, June 20, 2025, 6:30 PM**

---

Made with ❤️ by the PowerShell Usergroup Hannover community
