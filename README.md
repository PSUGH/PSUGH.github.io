# PowerShell Usergroup Hannover Website 🚀

[![Deploy to GitHub Pages](https://github.com/PSUGH/PSUGH.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/PSUGH/PSUGH.github.io/actions/workflows/deploy.yml)
[![License: CC BY 3.0](https://img.shields.io/badge/License-CC%20BY%203.0-lightgrey.svg)](https://creativecommons.org/licenses/by/3.0/)

Modern, accessible website for the PowerShell Usergroup Hannover (PSUGH) built with semantic HTML, modern CSS, and deployed on GitHub Pages.

## 🌐 Live Website

Visit us at: **[https://www.psugh.org](https://www.psugh.org)**

## ✨ Features

- **Modern Design**: Clean, professional design with CSS Grid and Flexbox
- **Fully Responsive**: Optimized for all devices and screen sizes
- **Accessible**: WCAG 2.1 compliant with proper semantic HTML and ARIA labels
- **Performance Optimized**: Fast loading with optimized images and CSS
- **SEO Ready**: Meta tags, structured data, and Open Graph support
- **Dynamic Content**: Meeting and topic information managed via CSS
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
├── .github/workflows/    # GitHub Actions workflows
├── css/                  # Stylesheets
│   ├── normalize.css     # CSS reset
│   ├── styles.css        # Legacy styles
│   └── styles-new.css    # Modern styles
├── fonts/                # Local font files
├── img/                  # Images and assets
├── meeting-data.json     # Dynamic content (meeting info)
├── index.html           # Modern homepage
├── index-new.html       # Modern homepage
├── impressum.html       # Legal notice
└── package.json         # Node.js configuration
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

   This will start a live server at `http://localhost:3000` with the new design.

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

The website uses semantic HTML structure. Main sections include:

- Hero header with navigation
- Next meeting information
- PowerShell terminal example
- About section
- Contact and social links

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

The website is built with a mobile-first approach:

- Responsive navigation with hamburger menu
- Touch-friendly button sizes
- Optimized content layout for small screens

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
