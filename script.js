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
function extractFileId(url) {
            const match = url.match(/[-\w]{25,}/);
            return match ? match[0] : null;
        }
        function openGPACalculator() {
            alert('GPA Calculator feature coming soon!');
            // You can replace this with actual GPA calculator functionality
        }

        function openTimetable() {
    window.open('https://timetablexx.vercel.app/', '_blank');
}
