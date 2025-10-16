from flask import Flask, render_template, request, jsonify, Response
import json
import csv
import io
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

# Sample data
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
    }
]

@app.route('/')
def index():
    """Main portfolio page"""
    return render_template('index.html', 
                         games=GAMES,
                         websites=WEBSITES,
                         photos=PHOTOS,
                         videos=VIDEOS,
                         now=datetime.now())

@app.route('/contact', methods=['POST'])
@app.route('/submit_feedback', methods=['POST'])
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
                'error': 'Please fill in all required fields'
            }), 400
        
        # Email validation
        import re
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({
                'success': False,
                'error': 'Please enter a valid email address'
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
        try:
            with open(FEEDBACK_FILE, 'r') as f:
                feedbacks = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            feedbacks = []
        
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
            'error': 'An error occurred. Please try again later.'
        }), 500

@app.route('/admin/feedback')
def admin_feedback():
    """Admin page to view all feedback"""
    try:
        # Read feedback from file
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        # Sort by timestamp (newest first)
        feedbacks.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return render_template('admin_feedback.html', 
                             feedbacks=feedbacks,
                             now=datetime.now())
        
    except FileNotFoundError:
        # If file doesn't exist, create it and return empty list
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump([], f)
        return render_template('admin_feedback.html', 
                             feedbacks=[],
                             now=datetime.now())
    except Exception as e:
        print(f"Error loading feedback: {str(e)}")
        return render_template('admin_feedback.html', 
                             feedbacks=[],
                             now=datetime.now())

@app.route('/delete_feedback/<feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    """Delete feedback entry"""
    try:
        # Read feedback from file
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        # Filter out the feedback to delete
        feedbacks = [f for f in feedbacks if f.get('id') != feedback_id]
        
        # Save updated feedback
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump(feedbacks, f, indent=4)
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Error deleting feedback: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/export_feedback_csv')
def export_feedback_csv():
    """Export feedback as CSV"""
    try:
        # Get filter parameters
        search = request.args.get('search', '')
        contact_type = request.args.get('type', '')
        date_filter = request.args.get('date', '')
        
        # Read feedback from file
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        # Apply filters if provided
        if search:
            search_lower = search.lower()
            feedbacks = [f for f in feedbacks if 
                        search_lower in f.get('full_name', '').lower() or
                        search_lower in f.get('email', '').lower() or
                        search_lower in f.get('comment', '').lower()]
        
        if contact_type:
            feedbacks = [f for f in feedbacks if f.get('contact_type') == contact_type]
        
        if date_filter:
            now = datetime.now()
            if date_filter == 'today':
                today = now.strftime('%Y-%m-%d')
                feedbacks = [f for f in feedbacks if f.get('timestamp', '').startswith(today)]
            elif date_filter == 'week':
                # Filter last 7 days
                from datetime import timedelta
                week_ago = (now - timedelta(days=7)).strftime('%Y-%m-%d')
                feedbacks = [f for f in feedbacks if f.get('timestamp', '') >= week_ago]
            elif date_filter == 'month':
                # Filter last 30 days
                from datetime import timedelta
                month_ago = (now - timedelta(days=30)).strftime('%Y-%m-%d')
                feedbacks = [f for f in feedbacks if f.get('timestamp', '') >= month_ago]
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Date', 'Name', 'Email', 'Phone', 'Type', 'Message'])
        
        # Write data
        for feedback in feedbacks:
            writer.writerow([
                feedback.get('timestamp', ''),
                feedback.get('full_name', ''),
                feedback.get('email', ''),
                feedback.get('phone', ''),
                feedback.get('contact_type', '').replace('_', ' ').title(),
                feedback.get('comment', '')
            ])
        
        output.seek(0)
        
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": f"attachment; filename=feedback_{datetime.now().strftime('%Y%m%d')}.csv"}
        )
        
    except Exception as e:
        print(f"Error exporting CSV: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/feedback')
def api_feedback():
    """API endpoint to get feedback data as JSON"""
    try:
        with open(FEEDBACK_FILE, 'r') as f:
            feedbacks = json.load(f)
        
        feedbacks.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
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
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return render_template('500.html'), 500

# Template filter for safe string operations
@app.template_filter('lower')
def lower_filter(s):
    """Convert string to lowercase"""
    return str(s).lower() if s else ''

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Initialize feedback file if it doesn't exist
    if not os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump([], f)
    
    print("=" * 50)
    print("Server starting...")
    print(f"Data directory: {os.path.abspath(DATA_DIR)}")
    print(f"Feedback file: {os.path.abspath(FEEDBACK_FILE)}")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5002)