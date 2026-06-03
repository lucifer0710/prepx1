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

