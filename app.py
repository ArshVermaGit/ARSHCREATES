from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# Paths for data storage
DATA_DIR = 'data'
FEEDBACK_FILE = os.path.join(DATA_DIR, 'feedback.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize feedback file if it doesn't exist
if not os.path.exists(FEEDBACK_FILE):
    with open(FEEDBACK_FILE, 'w') as f:
        json.dump([], f)

# Sample data (replace with your actual data or database)
GAMES = [
    {
        'id': 1,
        'name': 'Sky Surfers',
        'overview': 'It is an intense dodging game where you fly a plane through a danger-filled valley.',
        'description': 'In this challenging flight game, you must skillfully pilot your plane through a narrow, hazard-filled canyon. Master the controls and dodge everything that stands in your path to set a new high-score.',
        'image': '/static/images/games/game1.jpg',
        'game_folder': 'sky_surfers',
        'build_name': 'sky_surfers'
    }
]

WEBSITES = [
    {
        'id': 1,
        'name': 'ReelSpot',
        'description': 'The spot to save it all. Paste your link, download your video. Multi-platform media saving made simple.',
        'image': '/static/images/websites/ReelSpot.jpg',
        'url': 'https://arshvermagit.github.io/REELSPOT/',
        'technologies': ['JavaScript', 'HTML', 'CSS']
    }
]

PHOTOS = [
    {
        'id': 1,
        'title': 'Golden Hour Landscape',
        'description': 'Beautiful sunset captured in the mountains',
        'category': 'Landscape',
        'image': '/static/images/photos/photo1.jpg'
    },
    {
        'id': 2,
        'title': 'Urban Architecture',
        'description': 'Modern cityscape with stunning architectural details',
        'category': 'Architecture',
        'image': '/static/images/photos/photo2.jpg'
    },
    {
        'id': 3,
        'title': 'Portrait Session',
        'description': 'Professional portrait photography with natural lighting',
        'category': 'Portrait',
        'image': '/static/images/photos/photo3.jpg'
    }
]

VIDEOS = [
    {
        'id': 1,
        'title': 'Brand Showcase',
        'description': 'Professional brand video with cinematic storytelling',
        'category': 'Commercial',
        'thumbnail': '/static/images/videos/video1-thumb.jpg',
        'video_url': '/static/videos/video1.mp4'
    },
    {
        'id': 2,
        'title': 'Event Highlights',
        'description': 'Dynamic event coverage with creative editing',
        'category': 'Event',
        'thumbnail': '/static/images/videos/video2-thumb.jpg',
        'video_url': '/static/videos/video2.mp4'
    }
]

@app.route('/')
def index():
    """Main portfolio page"""
    return render_template('index.html', 
                         games=GAMES,
                         websites=WEBSITES,
                         photos=PHOTOS,
                         videos=VIDEOS)

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        # Get form data
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        contact_type = request.form.get('contact_type', '').strip()
        comment = request.form.get('comment', '').strip()
        
        # Validate required fields
        if not all([full_name, email, contact_type, comment]):
            return jsonify({
                'success': False,
                'message': 'Please fill in all required fields'
            }), 400
        
        # Create feedback entry
        feedback_entry = {
            'id': datetime.now().strftime('%Y%m%d%H%M%S%f'),
            'full_name': full_name,
            'email': email,
            'phone': phone if phone else 'N/A',
            'contact_type': contact_type,
            'comment': comment,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Read existing feedback
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        # Add new feedback
        feedbacks.append(feedback_entry)
        
        # Save updated feedback
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump(feedbacks, f, indent=4)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We will get back to you soon.'
        })
        
    except Exception as e:
        print(f"Error saving feedback: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again later.'
        }), 500

@app.route('/admin/feedback')
def admin_feedback():
    """Admin page to view all feedback"""
    try:
        # Read feedback from file
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        # Sort by timestamp (newest first)
        feedbacks.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return render_template('admin_feedback.html', feedbacks=feedbacks)
        
    except Exception as e:
        print(f"Error loading feedback: {str(e)}")
        return render_template('admin_feedback.html', feedbacks=[])

@app.route('/api/feedback')
def api_feedback():
    """API endpoint to get feedback data as JSON"""
    try:
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        feedbacks.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': feedbacks,
            'count': len(feedbacks)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)