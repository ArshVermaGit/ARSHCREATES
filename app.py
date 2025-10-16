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

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        # Get form data
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        contact_type = request.form.get('contact_type')
        comment = request.form.get('comment')
        
        # Basic validation
        if not all([full_name, email, contact_type, comment]):
            return jsonify({'success': False, 'error': 'All required fields must be filled'})
        
        # Email validation
        import re
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({'success': False, 'error': 'Please enter a valid email address'})
        
        # Here you would typically save to database
        # For SQLite example:
        """
        from datetime import datetime
        new_feedback = Feedback(
            full_name=full_name,
            email=email,
            phone=phone,
            contact_type=contact_type,
            comment=comment,
            timestamp=datetime.utcnow()
        )
        db.session.add(new_feedback)
        db.session.commit()
        """
        
        print(f"Feedback received: {full_name}, {email}, {contact_type}")
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    
@app.route('/delete_feedback/<int:feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    try:
        # Here you would delete from database
        """
        feedback = Feedback.query.get(feedback_id)
        if feedback:
            db.session.delete(feedback)
            db.session.commit()
        """
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    
@app.route('/export_feedback_csv')
def export_feedback_csv():
    try:
        # Get filter parameters
        search = request.args.get('search', '')
        contact_type = request.args.get('type', '')
        date_filter = request.args.get('date', '')
        
        # Here you would query your database with filters
        # feedbacks = Feedback.query.filter(...).all()
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Date', 'Name', 'Email', 'Phone', 'Type', 'Message'])
        
        # Write data (replace with actual database query)
        # for feedback in feedbacks:
        #     writer.writerow([
        #         feedback.timestamp,
        #         feedback.full_name,
        #         feedback.email,
        #         feedback.phone or '',
        #         feedback.contact_type,
        #         feedback.comment
        #     ])
        
        # For now, return empty CSV
        output.seek(0)
        
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": f"attachment; filename=feedback_{datetime.now().strftime('%Y%m%d')}.csv"}
        )
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

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