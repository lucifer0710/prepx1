import { parseGIF, decompressFrames } from 'gifuct-js';
import faviconGifUrl from './favicon4.gif';

function toggleCard(header) {
    const card = header.parentElement;
    const content = header.nextElementSibling;
    const video = content.querySelector('.year-video');

    card.classList.toggle('active');

    if (card.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
        // Play video when section opens
        if (video) {
            video.play();
        }
        
        // Scroll to show the entire card after expansion completes
        setTimeout(() => {
            const cardBottom = card.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // If card extends beyond viewport, scroll to show it fully
            if (cardBottom > windowHeight) {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end'
                });
            }
        }, 600);
    } else {
        content.style.maxHeight = null;
        // Pause video when section closes
        if (video) {
            video.pause();
        }
    }
}
        function filterContent(input) {
            const filter = input.value.toUpperCase();
            const cards = document.querySelectorAll('.note-card');

            cards.forEach(card => {
                const title = card.querySelector('.note-title').innerText;
                const parentYear = card.closest('.year-card');
                const content = parentYear.querySelector('.year-content');

                if (title.toUpperCase().indexOf(filter) > -1) {
                    card.style.display = "";
                    if (filter !== "") {
                        parentYear.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                } else {
                    card.style.display = "none";
                }
            });
        }

        function openLink(driveLink, action) {
            if (driveLink === 'YOUR_DRIVE_LINK_HERE') {
                alert('Please add your Google Drive link for this subject!');
                return;
            }

            if (action === 'view') {
                window.open(driveLink, '_blank');
            } else if (action === 'download') {
                const fileId = extractFileId(driveLink);
                if (fileId) {
                    window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
                } else {
                    window.open(driveLink, '_blank');
                }
            }
        }

        function extractFileId(url) {
            const match = url.match(/[-\w]{25,}/);
            return match ? match[0] : null;
        }
        function openGPACalculator() {
           window.open('https://gpacalcxx.vercel.app/' , '_blank');
        }

        function openTimetable() {
    window.open('https://timetablexx.vercel.app/', '_blank');
}
window.toggleCard = toggleCard;
window.filterContent = filterContent;
window.openLink = openLink;
window.openGPACalculator = openGPACalculator;
window.openTimetable = openTimetable;

async function initAnimatedFavicon() {
    try {
        const response = await fetch(faviconGifUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);
        
        if (!frames || frames.length === 0) return;
        
        const size = gif.lsd.width; // favicon size matching the source GIF
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = gif.lsd.width;
        tempCanvas.height = gif.lsd.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        const faviconLink = document.getElementById('favicon');
        if (!faviconLink) return;
        
        // Pre-render all frames to data URLs on load for maximum smoothness and 0% runtime CPU lag
        const renderedFrames = [];
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            
            if (i === 0) {
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            } else {
                const prevFrame = frames[i - 1];
                if (prevFrame.disposalType === 2) {
                    tempCtx.clearRect(
                        prevFrame.dims.left, 
                        prevFrame.dims.top, 
                        prevFrame.dims.width, 
                        prevFrame.dims.height
                    );
                }
            }
            
            const imgData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
            imgData.data.set(frame.patch);
            tempCtx.putImageData(imgData, frame.dims.left, frame.dims.top);
            
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(tempCanvas, 0, 0, size, size);
            
            renderedFrames.push({
                dataUrl: canvas.toDataURL('image/png'),
                delay: frame.delay
            });
        }
        
        let frameIndex = 0;
        
        function renderFrame() {
            const frame = renderedFrames[frameIndex];
            faviconLink.href = frame.dataUrl;
            frameIndex = (frameIndex + 1) % renderedFrames.length;
            setTimeout(renderFrame, frame.delay);
        }
        
        renderFrame();
    } catch (e) {
        console.error('Failed to animate favicon:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimatedFavicon);
} else {
    initAnimatedFavicon();
}

// --- WIFI CREDENTIALS FEATURE ---
const wifiData = [
    { name: "Audi", pass: "audi@net" },
    { name: "CSED", pass: "csed@123#" },
    { name: "CSED_LAB", pass: "hecllab768" },
    { name: "Directorate", pass: "dir@tu&98765" },
    { name: "EACCESS", pass: "hostelnet" },
    { name: "Hostel J", pass: "LetMeC@@nnectViaCISH2010@Thapar" },
    { name: "Machine Tool", pass: "workshop@54321" },
    { name: "Placement Cell", pass: "Cilp@98765" },
    { name: "THights", pass: "abcd1234" },
    { name: "TU", pass: "tu@inet1" },
    { name: "LC", pass: "lc@tiet1" },
    { name: "E-Block", pass: "hostelnet" },
    { name: "F-Block", pass: "hostelnet" }
];

function populateWifiList() {
    const wifiListContainer = document.getElementById('wifi-list');
    if (!wifiListContainer) return;
    wifiListContainer.innerHTML = '';
    
    wifiData.forEach((wifi, index) => {
        const wifiItem = document.createElement('div');
        wifiItem.className = 'wifi-item';
        wifiItem.id = `wifi-item-${index}`;
        
        wifiItem.onclick = (e) => handleWifiClick(e, index, wifi.pass);
        
        wifiItem.innerHTML = `
            <span class="wifi-name">${wifi.name}</span>
            <div class="wifi-pass-container">
                <span class="wifi-pass" id="wifi-pass-${index}">${wifi.pass}</span>
            </div>
            <div class="copy-indicator" id="copy-indicator-${index}">Copied!</div>
        `;
        wifiListContainer.appendChild(wifiItem);
    });
}

function handleWifiClick(event, index, password) {
    const item = document.getElementById(`wifi-item-${index}`);
    if (!item) return;
    
    if (!item.classList.contains('revealed')) {
        item.classList.add('revealed');
    } else {
        // Copy to clipboard
        navigator.clipboard.writeText(password).then(() => {
            item.classList.add('copied');
            const indicator = document.getElementById(`copy-indicator-${index}`);
            if (indicator) {
                indicator.style.opacity = '1';
                indicator.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
            setTimeout(() => {
                item.classList.remove('copied');
                if (indicator) {
                    indicator.style.opacity = '0';
                    indicator.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }, 1200);
        }).catch(err => {
            console.error('Could not copy password: ', err);
        });
    }
}

function openWifiModal() {
    const modal = document.getElementById('wifi-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Force reflow
        modal.offsetHeight;
        modal.classList.add('show');
        populateWifiList();
    }
}

function closeWifiModal() {
    const modal = document.getElementById('wifi-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function downloadWifiListImage() {
    const cardWidth = 600;
    const cardHeight = 780;
    const scale = 2; // For high-DPI crisp rendering
    
    const canvas = document.createElement('canvas');
    canvas.width = cardWidth * scale;
    canvas.height = cardHeight * scale;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
    bgGrad.addColorStop(0, '#0a0a16');
    bgGrad.addColorStop(1, '#020205');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    
    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < cardWidth; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cardHeight);
        ctx.stroke();
    }
    for (let y = 0; y < cardHeight; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cardWidth, y);
        ctx.stroke();
    }

    // Outer Border with Cyan Glow
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, cardWidth - 24, cardHeight - 24);
    
    // Glowing corners
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3.5;
    const len = 20;
    
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(12, 12 + len);
    ctx.lineTo(12, 12);
    ctx.lineTo(12 + len, 12);
    ctx.stroke();
    
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(cardWidth - 12, 12 + len);
    ctx.lineTo(cardWidth - 12, 12);
    ctx.lineTo(cardWidth - 12 - len, 12);
    ctx.stroke();
    
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(12, cardHeight - 12 - len);
    ctx.lineTo(12, cardHeight - 12);
    ctx.lineTo(12 + len, cardHeight - 12);
    ctx.stroke();
    
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cardWidth - 12, cardHeight - 12 - len);
    ctx.lineTo(cardWidth - 12, cardHeight - 12);
    ctx.lineTo(cardWidth - 12 - len, cardHeight - 12);
    ctx.stroke();

    // Title text
    ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 24px 'Outfit', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText("WIFI CREDENTIALS", cardWidth / 2, 60);
    
    ctx.shadowBlur = 0; // Reset shadow
    
    ctx.fillStyle = '#888888';
    ctx.font = "14px 'Outfit', sans-serif";
    ctx.fillText("Quick-Connect Network Guide", cardWidth / 2, 85);
    
    // Table Headers
    ctx.fillStyle = '#e0e0e3';
    ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText("NETWORK NAME", 50, 115);
    ctx.textAlign = 'right';
    ctx.fillText("PASSWORD", cardWidth - 50, 115);
    
    // Separator line (now below the headers)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 130);
    ctx.lineTo(cardWidth - 35, 130);
    ctx.stroke();
    
    // Table rows
    const startY = 160;
    const rowHeight = 42;
    
    wifiData.forEach((wifi, index) => {
        const rowY = startY + (index * rowHeight);
        
        // Background for each row
        ctx.fillStyle = index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        const rx = 35;
        const ry = rowY - 18;
        const rw = cardWidth - 70;
        const rh = 30;
        const radius = 6;
        if (ctx.roundRect) {
            ctx.roundRect(rx, ry, rw, rh, radius);
        } else {
            ctx.rect(rx, ry, rw, rh);
        }
        ctx.fill();
        
        // Network Name
        ctx.fillStyle = '#ffffff';
        ctx.font = "500 14px 'Outfit', sans-serif";
        ctx.textAlign = 'left';
        ctx.fillText(wifi.name, 50, rowY);
        
        // Password
        ctx.fillStyle = '#00f2fe';
        ctx.font = "bold 13px monospace";
        ctx.textAlign = 'right';
        ctx.fillText(wifi.pass, cardWidth - 50, rowY);
    });
    
    // Footer line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(35, cardHeight - 65);
    ctx.lineTo(cardWidth - 35, cardHeight - 65);
    ctx.stroke();
    
    ctx.fillStyle = '#555555';
    ctx.font = "12px 'Outfit', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText("© prepx.fun • Access your entire syllabus in one click.", cardWidth / 2, cardHeight - 40);
    
    // Download trigger
    const link = document.createElement('a');
    link.download = 'prepx-wifi-credentials.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Expose open/close functions globally for inline onclick handlers
window.openWifiModal = openWifiModal;
window.closeWifiModal = closeWifiModal;
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;

function openMapModal() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.offsetHeight; // Force reflow
        modal.classList.add('show');
    }
}

function closeMapModal() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function downloadMapImage() {
    const link = document.createElement('a');
    link.download = 'tiet-campus-map.png';
    link.href = 'map.png';
    link.click();
}

function wrapDownloadWithAnimation(btnId, downloadFn) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    btn.addEventListener('click', async () => {
        if (btn.classList.contains('loading') || btn.classList.contains('saved')) return;
        
        const originalContent = btn.innerHTML;
        
        btn.classList.add('loading');
        btn.innerHTML = `
            <div class="spinner"></div>
            <span>Downloading...</span>
        `;
        
        // Simulate download delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Execute actual download
        downloadFn();
        
        btn.classList.remove('loading');
        btn.classList.add('saved');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Saved</span>
        `;
        
        setTimeout(() => {
            btn.classList.remove('saved');
            btn.innerHTML = originalContent;
        }, 2000);
    });
}

// Initialize button event listeners once DOM is ready
function initFeatures() {
    const wifiBtn = document.getElementById('wifi-btn');
    if (wifiBtn) {
        wifiBtn.addEventListener('click', openWifiModal);
    }
    wrapDownloadWithAnimation('wifi-download-btn', downloadWifiListImage);
    
    // Map features
    const mapBtn = document.getElementById('map-btn');
    if (mapBtn) {
        mapBtn.addEventListener('click', openMapModal);
    }
    wrapDownloadWithAnimation('map-download-btn', downloadMapImage);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatures);
} else {
    initFeatures();
}


