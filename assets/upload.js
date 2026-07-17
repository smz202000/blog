/*******************************************************************************
LIVE PHOTO UPLOADER
Client-side upload & preview tool for live photos.
Stores photo metadata in IndexedDB for persistence.
*******************************************************************************/

(function () {
  'use strict';

  const DB_NAME = 'live-photos-db';
  const DB_VERSION = 1;
  const STORE_NAME = 'photos';

  // --- IndexedDB ---
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function savePhoto(photo) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.add(photo);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllPhotos() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function deletePhoto(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- DOM helpers ---
  function $(sel, parent) { return (parent || document).querySelector(sel); }
  function $$(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  // --- Upload UI ---
  const dropZone = $('#drop-zone');
  const imageInput = $('#image-input');
  const videoInput = $('#video-input');
  const previewArea = $('#preview-area');
  const gallery = $('#gallery');
  const codeOutput = $('#code-output');

  let pendingImage = null;
  let pendingVideo = null;

  // File input handlers
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      pendingImage = e.target.files[0];
      updatePreview();
    });
  }

  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      pendingVideo = e.target.files[0];
      updatePreview();
    });
  }

  // Drag & drop
  if (dropZone) {
    ['dragenter', 'dragover'].forEach((evt) => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (evt === 'drop') {
          const files = e.dataTransfer.files;
          handleDroppedFiles(files);
        }
      });
    });

    // Click to browse
    dropZone.addEventListener('click', () => {
      imageInput.click();
    });
  }

  function handleDroppedFiles(files) {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        pendingImage = file;
        // Update the file input label
        const label = $('.file-label-image');
        if (label) label.textContent = file.name;
      } else if (file.type.startsWith('video/')) {
        pendingVideo = file;
        const label = $('.file-label-video');
        if (label) label.textContent = file.name;
      }
    }
    updatePreview();
  }

  function updatePreview() {
    if (!previewArea) return;
    previewArea.innerHTML = '';

    if (!pendingImage && !pendingVideo) {
      previewArea.innerHTML = '<p class="upload-hint">选择一张静态图片和一段短视频即可预览效果</p>';
      return;
    }

    // Create live photo preview
    const imageUrl = pendingImage ? URL.createObjectURL(pendingImage) : '';
    const videoUrl = pendingVideo ? URL.createObjectURL(pendingVideo) : '';

    const container = document.createElement('div');
    container.className = 'live-photo';
    container.dataset.videoSrc = videoUrl;

    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = pendingImage ? pendingImage.name : '';
      container.appendChild(img);
    }

    const badge = document.createElement('span');
    badge.className = 'live-photo-badge';
    badge.textContent = 'LIVE';
    container.appendChild(badge);

    // Init the live photo behavior
    if (window.initLivePhoto) {
      window.initLivePhoto(container);
    }

    previewArea.appendChild(container);

    // Generate code snippet
    updateCodeOutput();
  }

  function updateCodeOutput() {
    if (!codeOutput) return;
    const imgName = pendingImage ? pendingImage.name : 'photo.jpg';
    const vidName = pendingVideo ? pendingVideo.name : 'photo.mp4';

    codeOutput.textContent =
      `#import "../tufted-lib/live-photo.typ": live-photo\n\n` +
      `#live-photo(\n` +
      `  "uploads/live-photos/${escapeHTML(imgName)}",\n` +
      `  video: "uploads/live-photos/${escapeHTML(vidName)}",\n` +
      `  caption: [在这里写图片描述],\n` +
      `)`;
  }

  // Save button
  const saveBtn = $('#save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!pendingImage || !pendingVideo) {
        alert('请先选择一张图片和一段视频');
        return;
      }

      const imageUrl = URL.createObjectURL(pendingImage);
      const videoUrl = URL.createObjectURL(pendingVideo);

      try {
        await savePhoto({
          imageName: pendingImage.name,
          videoName: pendingVideo.name,
          imageUrl: imageUrl,
          videoUrl: videoUrl,
          createdAt: new Date().toISOString(),
        });

        // Reset and refresh
        pendingImage = null;
        pendingVideo = null;
        if (imageInput) imageInput.value = '';
        if (videoInput) videoInput.value = '';
        if (previewArea) previewArea.innerHTML = '<p class="upload-hint success">✅ 已保存！刷新页面后在下方画廊查看</p>';
        if (codeOutput) codeOutput.textContent = '';

        loadGallery();
      } catch (err) {
        console.error('Save failed:', err);
        alert('保存失败: ' + err.message);
      }
    });
  }

  // Gallery
  async function loadGallery() {
    if (!gallery) return;

    try {
      const photos = await getAllPhotos();
      gallery.innerHTML = '';

      if (photos.length === 0) {
        gallery.innerHTML = '<p class="upload-hint">还没有保存的实况照片，上传一张吧～</p>';
        return;
      }

      photos.reverse().forEach((photo) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';

        const lp = document.createElement('div');
        lp.className = 'live-photo';
        lp.dataset.videoSrc = photo.videoUrl;

        const img = document.createElement('img');
        img.src = photo.imageUrl;
        img.alt = photo.imageName;
        lp.appendChild(img);

        const badge = document.createElement('span');
        badge.className = 'live-photo-badge';
        badge.textContent = 'LIVE';
        lp.appendChild(badge);

        card.appendChild(lp);

        // Info
        const info = document.createElement('div');
        info.className = 'gallery-info';
        info.innerHTML = `
          <span class="gallery-name">${escapeHTML(photo.imageName)}</span>
          <span class="gallery-date">${new Date(photo.createdAt).toLocaleDateString('zh-CN')}</span>
        `;
        card.appendChild(info);

        // Typst code
        const code = document.createElement('pre');
        code.className = 'gallery-code';
        code.textContent =
          `#live-photo(\n` +
          `  "uploads/live-photos/${escapeHTML(photo.imageName)}",\n` +
          `  video: "uploads/live-photos/${escapeHTML(photo.videoName)}",\n` +
          `  caption: [描述],\n` +
          `)`;
        card.appendChild(code);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'gallery-delete-btn';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', async () => {
          if (confirm('确定删除这张实况照片吗？')) {
            URL.revokeObjectURL(photo.imageUrl);
            URL.revokeObjectURL(photo.videoUrl);
            await deletePhoto(photo.id);
            loadGallery();
          }
        });
        card.appendChild(delBtn);

        gallery.appendChild(card);
      });
    } catch (err) {
      console.error('Load gallery failed:', err);
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Init gallery on load
  if (gallery) {
    loadGallery();
  }

  // Expose initLivePhoto for use by the preview
  if (typeof window !== 'undefined' && !window.initLivePhoto) {
    // This will be called by the live-photo.js script
    window._livePhotoUploadReady = true;
  }
})();
