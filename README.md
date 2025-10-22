# Arsh Verma Portfolio - Pure HTML/CSS/JavaScript

A fully responsive, modern portfolio website showcasing games, websites, photography, and videography. This version runs entirely on client-side code without requiring any backend server.

## 🎯 Features

- 🎨 Modern glassmorphism design with light/dark theme toggle
- 📱 Fully responsive layout for all devices
- ⚡ Smooth animations and transitions
- 🎮 Interactive project modals (games, websites, photos, videos)
- 📧 Contact form with validation and local storage
- 🔍 Admin feedback panel with filters and CSV export
- 🎯 Zero backend dependencies - runs entirely in browser

## 📁 Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── admin_feedback.html     # Admin feedback management page
├── 404.html               # 404 error page
├── 500.html               # 500 error page
├── css/
│   └── style.css          # All styles with responsive design
├── js/
│   ├── data.js            # Portfolio data and feedback storage
│   ├── script.js          # Theme toggle and navigation
│   └── main.js            # Modal system and portfolio functionality
├── images/
│   ├── favicon.ico        # Site favicon
│   ├── games/             # Game thumbnails
│   ├── websites/          # Website screenshots
│   ├── photos/            # Photography portfolio
│   └── videos/            # Video thumbnails
├── videos/
│   └── *.mp4             # Video files
└── static/
    └── games/            # Unity game builds
        └── [game_folder]/
            └── Build/

```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in your web browser. No server required!

### Option 2: Use Local Server (Recommended for Unity games)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (with http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📝 Customization

### Adding Portfolio Items

Edit `js/data.js` to add your content:

```javascript
const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: 'Your Game Name',
            overview: 'Short description',
            description: 'Full description',
            image: '/images/games/your-game.jpg',
            game_folder: 'your_game_folder',
            build_name: 'your_build_name'
        }
    ],
    websites: [
        {
            id: 1,
            name: 'Website Name',
            description: 'Description',
            image: '/images/websites/screenshot.jpg',
            url: 'https://your-website.com',
            technologies: ['HTML', 'CSS', 'JavaScript']
        }
    ],
    photos: [
        {
            id: 1,
            title: 'Photo Title',
            description: 'Photo description',
            category: 'Category',
            image: '/images/photos/photo.jpg'
        }
    ],
    videos: [
        {
            id: 1,
            title: 'Video Title',
            description: 'Video description',
            category: 'Category',
            thumbnail: '/images/videos/thumbnail.jpg',
            video_url: '/videos/video.mp4'
        }
    ]
};
```

### Unity Game Integration

1. Build your Unity game for WebGL
2. Place the Build folder in: `static/games/[your_game_folder]/Build/`
3. Ensure these files exist:
   - `[build_name].loader.js`
   - `[build_name].data`
   - `[build_name].framework.js`
   - `[build_name].wasm`
4. Add game entry to `PORTFOLIO_DATA.games` in `data.js`

### Updating Personal Information

Edit the following in `index.html`:

```html
<!-- Update hero section -->
<h1 class="hero-title">Your Name</h1>
<p class="hero-description">Your bio...</p>

<!-- Update contact cards -->
<a href="mailto:your-email@example.com">your-email@example.com</a>
<a href="https://linkedin.com/in/yourprofile/">Connect with me</a>
<a href="https://github.com/yourusername">View my work</a>
```

### Theme Customization

Edit CSS variables in `css/style.css`:

```css
:root {
  --accent: #A1856D;              /* Primary accent color */
  --accent-secondary: #B8A28A;    /* Secondary accent */
  --bg-primary: #0A0A0A;          /* Background color */
  /* ... more variables */
}
```

## 💾 Data Storage

The portfolio uses browser `localStorage` to store:
- Theme preference (light/dark)
- Contact form submissions

To clear all data:
```javascript
localStorage.clear();
```

## 🔐 Admin Panel

Access the admin feedback panel at `/admin_feedback.html`

Features:
- View all contact form submissions
- Filter by type, date, or search term
- Export data to CSV
- Delete individual feedback entries

**Note:** Data is stored locally in browser. No server-side storage.

## 🎨 Design Features

- **Glassmorphism UI**: Modern frosted glass effects
- **Smooth Animations**: CSS transitions and keyframe animations
- **Dark/Light Theme**: Automatic theme toggle with localStorage
- **Responsive Grid**: Mobile-first responsive design
- **Modal System**: Unified modal for all content types
- **Notification System**: Toast notifications for user feedback

## 🌐 Browser Support

- Chrome (recommended) ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Opera ✅

**Note:** Unity WebGL games require a modern browser with WebAssembly support.

## 📱 Mobile Responsive

Breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## ⚡ Performance Tips

1. **Optimize Images**: Use compressed JPG/PNG (recommended: max 500KB per image)
2. **Video Files**: Keep videos under 50MB or use external hosting (YouTube, Vimeo)
3. **Unity Games**: Compress WebGL builds using Brotli/Gzip
4. **Lazy Loading**: Images load on viewport entry (built-in)

## 🛠️ Troubleshooting

### Unity Game Not Loading
- Check browser console for errors
- Verify Build folder structure
- Ensure MIME types are correct (server may need configuration)
- Try using a local server instead of `file://`

### Contact Form Not Saving
- Check browser console
- Verify localStorage is enabled in browser
- Check browser privacy settings

### Images Not Displaying
- Verify image paths are correct
- Check file extensions match (case-sensitive)
- Ensure images exist in correct folders

### Theme Not Saving
- Check localStorage permissions
- Clear browser cache
- Check browser privacy mode (incognito may block localStorage)

## 🔧 Development

### File Dependencies

**index.html** requires:
- `css/style.css`
- `js/data.js`
- `js/script.js`
- `js/main.js`

**admin_feedback.html** requires:
- `css/style.css`
- `js/data.js`
- `js/script.js`

### Adding New Features

1. Add functionality to appropriate JS file:
   - `data.js` - Data management
   - `script.js` - UI interactions
   - `main.js` - Modal and portfolio logic

2. Add styles to `css/style.css`

3. Update HTML if needed

## 📄 License

Copyright © 2025 Arsh Verma. All Rights Reserved.

## 📧 Contact

For questions or support:
- Email: arshvermadev@gmail.com
- LinkedIn: [linkedin.com/in/arshvermadev](https://linkedin.com/in/arshvermadev/)
- GitHub: [github.com/ArshVermaGit](https://github.com/ArshVermaGit)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts (Inter, Space Grotesk)
- Unity WebGL for game deployment

---

**Built with ❤️ using pure HTML, CSS, and JavaScript**