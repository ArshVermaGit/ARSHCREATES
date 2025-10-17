# My_Portfolio
This Website showcases my projects including Games, Websites, Photography and videography Albums.

## Features

- 🎨 Modern glassmorphism design
- 📱 Fully responsive layout
- ⚡ Smooth animations and transitions
- 🎮 Interactive project modals
- 📧 Contact form with validation
- 🎯 Easy project management

# Portfolio Website - Complete Project Structure

portfolio_website/
│
├── app.py                          # Main Flask application (REPLACE THIS FILE)
│
├── data/                           # Data storage directory (Auto-created)
│   └── feedback.json              # Feedback submissions (Auto-created)
│
├── templates/                      # HTML Templates
│   ├── base.html                  # Base template (NO CHANGES NEEDED)
│   ├── index.html                 # Main portfolio page (NO CHANGES NEEDED)
│   ├── admin_feedback.html        # NEW FILE - Admin feedback page (ADD THIS)
│   ├── 404.html                   # Error page (Optional - Create if needed)
│   └── 500.html                   # Error page (Optional - Create if needed)
│
├── static/                         # Static files
│   ├── css/
│   │   └── style.css              # Main CSS (NO CHANGES NEEDED)
│   │
│   ├── js/
│   │   ├── script.js              # Navigation script (NO CHANGES NEEDED)
│   │   └── main.js                # REPLACE THIS FILE with updated version
│   │
│   ├── images/                    # Images directory
│   │   ├── games/                 # Game thumbnails
│   │   │   ├── game1.jpg
│   │   │   └── game2.jpg
│   │   │
│   │   ├── websites/              # Website screenshots
│   │   │   ├── website1.jpg
│   │   │   └── website2.jpg
│   │   │
│   │   ├── photos/                # Photography portfolio
│   │   │   ├── photo1.jpg
│   │   │   ├── photo2.jpg
│   │   │   └── photo3.jpg
│   │   │
│   │   └── videos/                # Video thumbnails
│   │       ├── video1-thumb.jpg
│   │       └── video2-thumb.jpg
│   │
│   ├── videos/                    # Video files
│   │   ├── video1.mp4
│   │   └── video2.mp4
│   │
│   └── games/                     # Unity WebGL games
│       ├── game1/
│       │   └── Build/
│       │       ├── game1.loader.js
│       │       ├── game1.data
│       │       ├── game1.framework.js
│       │       └── game1.wasm
│       │
│       └── game2/
│           └── Build/
│               ├── game2.loader.js
│               ├── game2.data
│               ├── game2.framework.js
│               └── game2.wasm
│
└── requirements.txt