// Video control functions
function togglePlayPause() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        if (videoPlayer.paused) {
            videoPlayer.play();
            document.getElementById('playPauseIcon').className = 'fas fa-pause';
            document.getElementById('playPauseText').textContent = 'Pause';
        } else {
            videoPlayer.pause();
            document.getElementById('playPauseIcon').className = 'fas fa-play';
            document.getElementById('playPauseText').textContent = 'Play';
        }
    }
}

function toggleMute() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        videoPlayer.muted = !videoPlayer.muted;
        const muteIcon = document.getElementById('muteIcon');
        const muteText = document.getElementById('muteText');
        
        if (videoPlayer.muted) {
            muteIcon.className = 'fas fa-volume-mute';
            muteText.textContent = 'Unmute';
        } else {
            muteIcon.className = 'fas fa-volume-up';
            muteText.textContent = 'Mute';
        }
    }
}

// Utility functions
function downloadMedia(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function toggleFullscreen(type) {
    alert(`${type} fullscreen mode would activate here`);
    // In a real implementation, we would use the Fullscreen API
}

function exitFullscreen() {
    openMedia(currentMediaType, currentMediaIndex, false);
}

function visitWebsite(url) {
    window.open(url, '_blank');
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Media Gallery Pro',
            text: 'Check out this amazing media gallery website!',
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support the Web Share API
        alert('Share this website: ' + window.location.href);
    }
}

// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Settings form submission
    const saveSettingsBtn = document.querySelector('.save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            const siteTitle = document.getElementById('siteTitle').value;
            const maxFileSize = document.getElementById('maxFileSize').value;
            const autoPlay = document.getElementById('autoPlay').checked;
            const allowDownloads = document.getElementById('allowDownloads').checked;
            
            // In a real application, you would save these settings to a server
            alert('Settings saved successfully!');
            
            // Update page title if changed
            if (siteTitle) {
                document.title = siteTitle + ' - Admin Panel';
                const headerTitle = document.querySelector('header h1');
                if (headerTitle) {
                    headerTitle.textContent = siteTitle;
                }
            }
        });
    }
    
    // Feedback actions
    const feedbackActions = document.querySelectorAll('.feedback-actions .btn');
    feedbackActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const feedbackItem = this.closest('.feedback-item');
            if (this.classList.contains('btn-primary')) {
                // Reply button
                const userName = feedbackItem.querySelector('.user-name').textContent;
                const reply = prompt(`Enter your reply to ${userName}:`);
                if (reply) {
                    alert(`Reply sent to ${userName}: ${reply}`);
                }
            } else {
                // Mark as read button
                feedbackItem.style.opacity = '0.7';
                alert('Feedback marked as read');
            }
        });
    });
});