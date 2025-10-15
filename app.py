from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
import mimetypes
import os
import sys

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.append(BASE_DIR)

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

app.secret_key = 'your-secret-key-change-this-in-production'

mimetypes.add_type('application/wasm', '.wasm')
mimetypes.add_type('application/octet-stream', '.data')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/gzip', '.gz')

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# ============================================================================
# GAMES DATA
# TO ADD A NEW GAME:
# 1. Add game files to: static/games/your_game_name/
# 2. Add cover image: static/games/your_game_name/cover.jpg
# 3. Add entry below with proper details
# ============================================================================
GAMES = [
    {
        'id': 1,
        'name': 'Sky Surfers',
        'description': 'A thrilling aerial adventure game where players navigate through stunning sky landscapes, dodging obstacles and collecting power-ups. Built with Unity and C# for immersive 3D gameplay with dynamic weather systems and challenging levels.',
        'overview': 'Navigate through stunning aerial landscapes in this fast-paced action game',
        'image': '/static/games/sky_surfers/cover.jpg',
        'game_folder': 'sky_surfers',
        'build_name': 'sky_surfers'
    },
]

# ============================================================================
# WEBSITES DATA
# TO ADD A NEW WEBSITE:
# 1. Add screenshot to: static/images/websites/your_website_name.jpg
# 2. Add entry below with proper details
# ============================================================================
WEBSITES = [
    {
        'id': 1,
        'name': 'ReelSpot',
        'description': 'The spot to save it all. Paste your link, download your video. Multi-platform media saving made simple.',
        'image': '/static/images/websites/ReelSpot.jpg',
        'url': 'https://arshvermagit.github.io/REELSPOT/',
        'technologies': ['JavaScript', 'HTML', 'CSS']
    },

]

# ============================================================================
# PHOTOGRAPHY DATA
# TO ADD A NEW PHOTO:
# 1. Add photo to: static/images/photography/your_photo_name.jpg
# 2. Add entry below with proper details
# ============================================================================
PHOTOS = [
    # {
    #     'id': 1,
    #     'title': 'Sunset Landscape',
    #     'description': 'Beautiful sunset captured in the mountains',
    #     'image': '/static/images/photography/sunset.jpg',
    #     'category': 'Landscape'
    # },
]

# ============================================================================
# VIDEOS DATA
# TO ADD A NEW VIDEO:
# 1. Add video to: static/videos/your_video_name.mp4
# 2. Add thumbnail to: static/images/video_thumbnails/your_video_name.jpg
# 3. Add entry below with proper details
# ============================================================================
VIDEOS = [
    # {
    #     'id': 1,
    #     'title': 'Game Trailer',
    #     'description': 'Official trailer for Sky Surfers game',
    #     'thumbnail': '/static/images/video_thumbnails/trailer.jpg',
    #     'video_url': '/static/videos/game_trailer.mp4',
    #     'category': 'Game Development'
    # },
]

def get_db_connection():
    """Create database connection"""
    conn = sqlite3.connect('portfolio.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_feedback_db():
    """Initialize feedback database table"""
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_feedback_db()

@app.route('/')
def index():
    """Homepage with all portfolio sections"""
    return render_template(
        'index.html', 
        games=GAMES,
        websites=WEBSITES,
        photos=PHOTOS,
        videos=VIDEOS
    )

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        # Get form data
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        contact_type = request.form.get('contact_type', '').strip()
        comment = request.form.get('comment', '').strip()
        
        # Validate required fields
        if not full_name or not email or not contact_type or not comment:
            return jsonify({
                'success': False,
                'message': 'Please fill in all required fields'
            }), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid email address'
            }), 400
        
        # Insert into database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feedback (name, email, phone, contact_type, message, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (full_name, email, phone if phone else None, contact_type, comment, datetime.now()))
        
        conn.commit()
        feedback_id = cursor.lastrowid
        conn.close()
        
        print(f"✅ New feedback received (ID: {feedback_id}) from {full_name} ({email})")
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'Thank you for reaching out! We will get back to you soon.',
            'feedback_id': feedback_id
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again.'
        }), 500

@app.route('/feedback-data')
def feedback_data():
    """Admin page to view all feedback"""
    conn = get_db_connection()
    feedback = [dict(row) for row in conn.execute(
        'SELECT * FROM feedback ORDER BY timestamp DESC'
    ).fetchall()]
    conn.close()
    return render_template('feedback_data.html', feedback=feedback)

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)