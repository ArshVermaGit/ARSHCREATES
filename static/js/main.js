/* main.js — robust, cleaned, improved for theme, modal, media, contact, notifications */

/* -------------------------
   Global state
   ------------------------- */
let currentGame = null;
let unityInstance = null;
let unityLoaderScript = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;

/* -------------------------
   DOM Ready initialization
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavToggle();
  initPortfolioCards();
  initContactForm();
  initModalControls();
});

/* ===================================================================
   THEME TOGGLE (persistent)
   - Uses data-theme on <html>
   - Updates icon on button
   =================================================================== */
function initThemeToggle(){
  const themeBtn = document.getElementById('themeBtn');
  if (!themeBtn) return;

  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(themeBtn, theme);
  }

  // load saved theme
  const saved = localStorage.getItem('theme');
  const initial = saved || (document.documentElement.getAttribute('data-theme') || 'dark');
  setTheme(initial);

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}

function updateThemeIcon(button, theme){
  if (!button) return;
  // show moon icon if currently light (so click -> dark), sun icon if currently dark
  button.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

/* ===================================================================
   NAV TOGGLE (mobile)
   =================================================================== */
function initNavToggle(){
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (!navToggle || !navMenu) return;
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // close menu on resize > breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

/* ===================================================================
   PORTFOLIO CARDS INITIALIZATION
   =================================================================== */
function initPortfolioCards() {
  const cards = document.querySelectorAll('.portfolio-card');
  if (!cards) return;

  cards.forEach(card => {
    const type = card.dataset.type;
    if (type === 'game') {
      const gameData = safeParse(card.dataset.game);
      if (gameData) card.addEventListener('click', () => openGamePreview(gameData));
    } else if (type === 'website') {
      const websiteData = safeParse(card.dataset.website);
      if (websiteData) card.addEventListener('click', () => openWebsitePreview(websiteData));
    } else if (type === 'photo') {
      const photoData = safeParse(card.dataset.photo);
      if (photoData) card.addEventListener('click', () => openPhotoPreview(photoData));
    } else if (type === 'video') {
      const videoData = safeParse(card.dataset.video);
      if (videoData) card.addEventListener('click', () => openVideoPreview(videoData));
    }
  });
}

function safeParse(jsonStr){
  try{
    return JSON.parse(jsonStr);
  } catch(e){
    return null;
  }
}

/* ===================================================================
   MODAL HELPERS
   =================================================================== */
function openModal() {
  const modal = document.getElementById('portfolioModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('portfolioModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';

  // stop & cleanup media
  if (unityInstance && typeof unityInstance.Quit === 'function') {
    try { unityInstance.Quit(); } catch(e){ console.warn('Unity quit error', e); }
    unityInstance = null;
  }

  // if unity loader script was injected remove it to avoid duplicates (but only remove if safe)
  if (unityLoaderScript) {
    try { unityLoaderScript.remove(); } catch(e){}
    unityLoaderScript = null;
  }

  if (currentVideoElement) {
    try { currentVideoElement.pause(); } catch(e) {}
    currentVideoElement = null;
  }

  // reset preview areas safely
  const preview = document.getElementById('itemPreview');
  if (preview) {
    preview.innerHTML = `
      <img src="" alt="Preview" id="previewImage" style="display:none;">
      <iframe id="websiteFrame" style="display:none;"></iframe>
      <div id="photoViewer" style="display:none;"></div>
      <div id="videoPlayer" style="display:none;"></div>
      <button class="modal-play-btn" id="playItemBtn" style="display:none">
        <i class="fas fa-play"></i>
        <span>Play Game</span>
      </button>
    `;
  }

  // hide game container
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer) gameContainer.style.display = 'none';

  // leave fullscreen if needed
  if (document.fullscreenElement) {
    try { document.exitFullscreen(); } catch(e) { /* ignore */ }
  }

  currentGame = null;
  currentMediaType = null;
  currentItemData = null;
}

/* ensure modal close/overlay listeners attached */
function initModalControls(){
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('closeModal');
    if (overlay && e.target === overlay) closeModal();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('portfolioModal');
      if (modal && modal.classList.contains('active')) closeModal();
    }
  });
}

/* ===================================================================
   GAME PREVIEW & LOADING (Unity)
   =================================================================== */
function openGamePreview(gameData) {
  if (!gameData) return;
  currentGame = gameData;
  currentItemData = gameData;
  currentMediaType = 'game';

  const previewImage = getEl('previewImage');
  const modalTitle = getEl('modalTitle');
  const modalDescription = getEl('modalDescription');
  const playBtn = getEl('playItemBtn');
  const gamePreview = getEl('itemPreview');
  const gameContainer = getEl('gameContainer');
  const modalActions = getEl('modalActions');

  if (!modalTitle || !modalDescription || !gamePreview) return;

  hideAllPreviewElements();

  // set preview image
  if (previewImage) {
    previewImage.src = gameData.image || '';
    previewImage.style.display = 'block';
    previewImage.style.cursor = 'default';
  }

  modalTitle.textContent = gameData.name || 'Game';
  modalDescription.textContent = gameData.description || '';

  if (gamePreview) gamePreview.style.display = 'flex';
  if (gameContainer) gameContainer.style.display = 'none';
  if (playBtn) {
    playBtn.style.display = 'flex';
    playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
    playBtn.onclick = loadUnityGame;
  }

  modalActions.innerHTML = `<button class="btn btn-glass" id="fullscreenBtn" style="display:none"><i class="fas fa-expand"></i> Fullscreen</button>`;
  openModal();
}

function loadUnityGame(){
  if (!currentGame) {
    showNotification('No game selected', 'error'); return;
  }
  const gameContainer = getEl('gameContainer');
  const gamePreview = getEl('itemPreview');
  const gameLoading = getEl('gameLoading');
  const loadingProgress = getEl('loadingProgress');
  const fullscreenBtn = getEl('fullscreenBtn');

  if (gamePreview) gamePreview.style.display = 'none';
  if (gameContainer) gameContainer.style.display = 'block';
  if (gameLoading) gameLoading.style.display = 'flex';

  if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';

  // ensure we don't inject loader twice for same game
  // loader script URL
  const buildUrl = `/static/games/${currentGame.game_folder}/Build`;
  const loaderUrl = `${buildUrl}/${currentGame.build_name}.loader.js`;
  // if a previous loader exists and it's the same URL we don't re-add
  if (unityLoaderScript && unityLoaderScript.src === loaderUrl) {
    // already loaded (or loading) - just wait briefly for instance (if created externally)
    return;
  }

  // remove any prior unity loader script
  if (unityLoaderScript) {
    try { unityLoaderScript.remove(); } catch(e){}
    unityLoaderScript = null;
  }

  // inject loader
  unityLoaderScript = document.createElement('script');
  unityLoaderScript.src = loaderUrl;
  unityLoaderScript.async = true;
  unityLoaderScript.onerror = () => {
    showNotification('Failed to load game files. Check game build exists.', 'error');
    closeModal();
  };

  unityLoaderScript.onload = () => {
    // config for createUnityInstance
    const config = {
      dataUrl: `${buildUrl}/${currentGame.build_name}.data`,
      frameworkUrl: `${buildUrl}/${currentGame.build_name}.framework.js`,
      codeUrl: `${buildUrl}/${currentGame.build_name}.wasm`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: currentGame.companyName || "ArshVerma",
      productName: currentGame.name || "UnityGame",
      productVersion: currentGame.version || "1.0",
    };

    const canvas = document.querySelector("#unity-canvas");
    if (!canvas) {
      showNotification('Unity canvas not found', 'error'); closeModal(); return;
    }

    // create instance if createUnityInstance is available
    if (typeof createUnityInstance !== 'function') {
      // if loader hasn't exposed createUnityInstance yet, wait a bit
      setTimeout(() => {
        if (typeof createUnityInstance !== 'function') {
          showNotification('Game engine not initialized', 'error'); closeModal();
          return;
        }
        instantiateUnity(canvas, config, loadingProgress, gameLoading);
      }, 300);
    } else {
      instantiateUnity(canvas, config, loadingProgress, gameLoading);
    }
  };

  document.body.appendChild(unityLoaderScript);

  // fullscreen handler
  setTimeout(() => {
    const fsBtn = getEl('fullscreenBtn');
    if (fsBtn) fsBtn.onclick = toggleGameFullscreen;
  }, 250);
}

function instantiateUnity(canvas, config, loadingProgress, gameLoading){
  createUnityInstance(canvas, config, (progress) => {
    if (loadingProgress) loadingProgress.style.width = (100 * progress) + '%';
  }).then(instance => {
    unityInstance = instance;
    if (gameLoading) gameLoading.style.display = 'none';
  }).catch(err => {
    console.error('Unity init error', err);
    showNotification('Failed to initialize game: ' + (err && err.message ? err.message : err), 'error');
    closeModal();
  });
}

function toggleGameFullscreen(){
  const gameContainer = document.getElementById('gameContainer');
  if (!gameContainer) return;

  if (!document.fullscreenElement) {
    if (gameContainer.requestFullscreen) gameContainer.requestFullscreen();
    else if (gameContainer.webkitRequestFullscreen) gameContainer.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

/* ===================================================================
   WEBSITE PREVIEW
   =================================================================== */
function openWebsitePreview(websiteData) {
  if (!websiteData) return;
  currentItemData = websiteData;
  currentMediaType = 'website';

  hideAllPreviewElements();
  const previewImage = getEl('previewImage');
  const modalTitle = getEl('modalTitle');
  const modalDescription = getEl('modalDescription');
  const modalActions = getEl('modalActions');

  if (previewImage) {
    previewImage.src = websiteData.image || '';
    previewImage.style.display = 'block';
    previewImage.style.cursor = 'pointer';
    previewImage.onclick = () => { if (websiteData.url) window.open(websiteData.url, '_blank'); };
  }

  if (modalTitle) modalTitle.textContent = websiteData.name || 'Website';
  if (modalDescription) modalDescription.textContent = websiteData.description || '';

  modalActions.innerHTML = `<button class="btn btn-primary" id="visitWebsiteBtn"><i class="fas fa-external-link-alt"></i> Visit Website</button>`;
  setTimeout(() => {
    const visit = getEl('visitWebsiteBtn');
    if (visit && websiteData.url) visit.onclick = () => window.open(websiteData.url, '_blank');
  }, 100);

  openModal();
}

/* ===================================================================
   PHOTO PREVIEW
   =================================================================== */
function openPhotoPreview(photoData){
  if (!photoData) return;
  currentItemData = photoData;
  currentMediaType = 'photo';

  hideAllPreviewElements();
  const photoViewer = getEl('photoViewer');
  const modalTitle = getEl('modalTitle');
  const modalDescription = getEl('modalDescription');
  const modalActions = getEl('modalActions');

  if (photoViewer) {
    photoViewer.innerHTML = `<img id="photoImage" src="${photoData.image}" alt="${escapeHtml(photoData.title||'Photo')}" style="width:100%;height:auto;max-height:72vh;object-fit:contain;cursor:pointer;border-radius:8px">`;
    photoViewer.style.display = 'flex';
    photoViewer.style.alignItems = 'center';
    photoViewer.style.justifyContent = 'center';
  }

  if (modalTitle) modalTitle.textContent = photoData.title || 'Photo';
  if (modalDescription) modalDescription.textContent = photoData.description || '';

  modalActions.innerHTML = `
    <button class="btn btn-glass" id="downloadPhotoBtn"><i class="fas fa-download"></i> Download</button>
    <button class="btn btn-glass" id="fullscreenPhotoBtn"><i class="fas fa-expand"></i> Fullscreen</button>
  `;

  // attach listeners
  setTimeout(() => {
    const downloadBtn = getEl('downloadPhotoBtn'), fsBtn = getEl('fullscreenPhotoBtn'), photoImg = document.getElementById('photoImage');
    if (downloadBtn) downloadBtn.onclick = () => downloadMedia(photoData.image, (photoData.title || 'photo') + '.jpg');
    if (fsBtn && photoImg) fsBtn.onclick = () => requestFullscreenSafe(photoImg);
    if (photoImg) photoImg.onclick = () => requestFullscreenSafe(photoImg);
  }, 80);

  openModal();
}

/* ===================================================================
   VIDEO PREVIEW
   =================================================================== */
function openVideoPreview(videoData){
  if (!videoData) return;
  currentItemData = videoData;
  currentMediaType = 'video';

  hideAllPreviewElements();
  const videoPlayer = getEl('videoPlayer');
  const modalTitle = getEl('modalTitle');
  const modalDescription = getEl('modalDescription');
  const modalActions = getEl('modalActions');

  if (videoPlayer) {
    videoPlayer.innerHTML = `
      <video id="mainVideo" controls style="width:100%;height:auto;max-height:72vh;object-fit:contain;border-radius:8px">
        <source src="${videoData.video_url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    videoPlayer.style.display = 'flex';
  }

  currentVideoElement = videoPlayer ? videoPlayer.querySelector('#mainVideo') : null;

  if (modalTitle) modalTitle.textContent = videoData.title || 'Video';
  if (modalDescription) modalDescription.textContent = videoData.description || '';

  modalActions.innerHTML = `
    <button class="btn btn-glass" id="playPauseBtn"><i class="fas fa-pause"></i> Pause</button>
    <button class="btn btn-glass" id="muteBtn"><i class="fas fa-volume-up"></i> Mute</button>
    <button class="btn btn-glass" id="downloadVideoBtn"><i class="fas fa-download"></i> Download</button>
    <button class="btn btn-glass" id="fullscreenVideoBtn"><i class="fas fa-expand"></i> Fullscreen</button>
  `;

  setTimeout(() => {
    const playPauseBtn = getEl('playPauseBtn'), muteBtn = getEl('muteBtn'), downloadBtn = getEl('downloadVideoBtn'), fsBtn = getEl('fullscreenVideoBtn');
    if (playPauseBtn) playPauseBtn.onclick = () => togglePlayPause(playPauseBtn);
    if (muteBtn) muteBtn.onclick = () => toggleMute(muteBtn);
    if (downloadBtn) downloadBtn.onclick = () => downloadMedia(videoData.video_url, (videoData.title || 'video') + '.mp4');
    if (fsBtn && currentVideoElement) fsBtn.onclick = () => requestFullscreenSafe(currentVideoElement);

    if (currentVideoElement) {
      currentVideoElement.play().catch(()=>{/* autoplay may fail */});
      currentVideoElement.addEventListener('play', ()=>{ if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause'; });
      currentVideoElement.addEventListener('pause', ()=>{ if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play'; });
    }
  }, 80);

  openModal();
}

/* ===================================================================
   Media utilities
   =================================================================== */
function togglePlayPause(btn){
  if (!currentVideoElement) return;
  if (currentVideoElement.paused) { currentVideoElement.play(); btn.innerHTML = '<i class="fas fa-pause"></i> Pause'; }
  else { currentVideoElement.pause(); btn.innerHTML = '<i class="fas fa-play"></i> Play'; }
}
function toggleMute(btn){
  if (!currentVideoElement) return;
  currentVideoElement.muted = !currentVideoElement.muted;
  btn.innerHTML = currentVideoElement.muted ? '<i class="fas fa-volume-mute"></i> Unmute' : '<i class="fas fa-volume-up"></i> Mute';
}
function downloadMedia(url, filename){
  if (!url) { showNotification('Download URL missing', 'error'); return; }
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showNotification('Download started', 'success');
}
function requestFullscreenSafe(el){
  if (!el) return;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}
function getEl(id){ return document.getElementById(id); }
function escapeHtml(str){ return String(str).replace(/[&<>"'`=\/]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'": '&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;' })[s]); }

/* hide preview sections (safe) */
function hideAllPreviewElements(){
  const previewImage = getEl('previewImage');
  const websiteFrame = getEl('websiteFrame');
  const photoViewer = getEl('photoViewer');
  const videoPlayer = getEl('videoPlayer');

  if (previewImage) { previewImage.style.display = 'none'; previewImage.onclick = null; previewImage.src = ''; }
  if (websiteFrame) { websiteFrame.style.display = 'none'; websiteFrame.src = ''; }
  if (photoViewer) { photoViewer.style.display = 'none'; photoViewer.innerHTML = ''; }
  if (videoPlayer) { videoPlayer.style.display = 'none'; videoPlayer.innerHTML = ''; currentVideoElement = null; }
}

/* ===================================================================
   Notification system
   =================================================================== */
function showNotification(message, type='info'){
  const container = document.getElementById('notificationContainer');
  if (!container) return;
  // remove oldest if > 3
  while (container.children.length >= 3) container.children[0].remove();
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info';
  n.innerHTML = `<div class="notification-icon"><i class="fas ${icon}"></i></div><div class="notification-body"><h4>${title}</h4><p>${escapeHtml(message)}</p></div>`;
  container.appendChild(n);
  setTimeout(()=>{ n.style.animation = 'notifOut .28s forwards'; setTimeout(()=>{ n.remove(); }, 280); }, 4500);
}

/* Expose for other scripts */
window.showNotification = showNotification;

/* ===================================================================
   CONTACT FORM (improved UX + validation + prevents double submit)
   =================================================================== */
function initContactForm(){
  const frm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!frm || !submitBtn) return;

  let submitting = false;

  frm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    submitting = true;
    const origHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try{
      // Basic required validation
      const required = ['full_name','email','contact_type','comment'];
      let valid = true;
      required.forEach(name=>{
        const el = frm.querySelector(`[name="${name}"]`);
        if (el && !el.value.trim()) { el.style.borderColor = 'rgba(239,68,68,0.6)'; valid=false; }
      });
      if (!valid) throw new Error('Please fill all required fields');

      const emailEl = frm.querySelector('[name="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailEl && !emailRegex.test(emailEl.value.trim())) { emailEl.style.borderColor = 'rgba(239,68,68,0.6)'; throw new Error('Please enter a valid email'); }

      const formData = new FormData(frm);

      const res = await fetch(frm.action || '/submit_feedback', {
        method: frm.method || 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();
      if (data && data.success) {
        showNotification("Message sent successfully! I'll get back to you soon.", 'success');
        frm.reset();
        // reset borders
        frm.querySelectorAll('input,select,textarea').forEach(i=>i.style.borderColor='');
      } else {
        throw new Error((data && data.error) || 'Failed to send message');
      }
    } catch(err) {
      console.error(err);
      showNotification(err.message || 'Network error. Try again later.', 'error');
    } finally {
      submitBtn.innerHTML = origHtml;
      submitBtn.disabled = false;
      submitting = false;
    }
  });

  // realtime validation UI
  frm.querySelectorAll('input,select,textarea').forEach(el=>{
    el.addEventListener('input', () => el.style.borderColor = '');
    el.addEventListener('blur', () => {
      if (el.required && !el.value.trim()) el.style.borderColor = 'rgba(239,68,68,0.5)';
    });
  });
}

/* ===================================================================
   Utility: attach modal close buttons (if they exist)
   =================================================================== */
document.addEventListener('click', (ev) => {
  if (ev.target && (ev.target.matches('.modal-close') || ev.target.closest('.modal-close'))) {
    closeModal();
  }
});

/* expose closeModal for inline HTML if needed */
window.closeModal = closeModal;
