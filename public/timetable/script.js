let currentSlot = null;
let selectedType = '';
let scheduleData = null;
let allSubjects = {};
let lastAutoFilledCode = '';
let downloadTimeout = null;

const timeSlotMap = {
    "08:00 AM": 0,
    "08:50 AM": 1,
    "09:40 AM": 2,
    "10:30 AM": 3,
    "11:20 AM": 4,
    "12:10 PM": 5,
    "01:00 PM": 6,
    "01:50 PM": 7,
    "02:40 PM": 8,
    "03:30 PM": 9,
    "04:20 PM": 10,
    "05:10 PM": 11,
    "06:00 PM": 12
};

const dayMap = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5
};

// --- Page Load Handler ---
window.onload = function () {
    fetch('schedule1.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            scheduleData = data;
            // Build subjects mapping from all batches
            for (const batch in data) {
                for (const day in data[batch]) {
                    for (const time in data[batch][day]) {
                        const slot = data[batch][day][time];
                        if (Array.isArray(slot) && slot.length >= 4) {
                            const code = slot[0];
                            const subject = slot[2];
                            if (subject && code) {
                                const normSubject = subject.trim().toUpperCase();
                                // Extract base code by stripping trailing L, P, T
                                let baseCode = code.trim();
                                if (baseCode.length > 3 && /[LPT]$/i.test(baseCode)) {
                                    baseCode = baseCode.slice(0, -1);
                                }
                                if (!allSubjects[normSubject]) {
                                    allSubjects[normSubject] = baseCode;
                                }
                            }
                        }
                    }
                }
            }
            populateSubjectDatalist();
            populateBatchDatalist(Object.keys(data));
        })
        .catch(error => {
            console.error("Error loading schedule1.json:", error);
        });
};

function populateSubjectDatalist() {
    const list = document.getElementById('subjectList');
    if (!list) return;
    list.innerHTML = '';
    const sortedSubjects = Object.keys(allSubjects).sort();
    sortedSubjects.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub;
        list.appendChild(option);
    });
}

function populateBatchDatalist(batches) {
    const list = document.getElementById('batchList');
    if (!list) return;
    list.innerHTML = '';
    const sortedBatches = batches.sort();
    sortedBatches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch;
        list.appendChild(option);
    });
}

// --- Subject Code Lookup Helper ---
function getSubjectCode(subjectName, type) {
    const normName = subjectName.trim().toUpperCase();
    const predefinedCodes = {
        "PROGRAMMING FOR PROBLEM SOLVING": "UES103",
        "ENERGY AND ENVIRONMENT": "UEN008",
        "ELECTRICAL & ELECTRONICS ENGINEERING": "UES013",
        "ELECTRICAL & ELECTRONIC ENGINEERING": "UES013",
        "CHEMISTRY": "UCB009",
        "CHEMISTRY / APPLIED CHEMISTRY": "UCB009",
        "CALCULUS FOR ENGINEERS": "UMA022",
        "PROGRAMMING FOR PROFESSIONAL COMMUNICATION": "UHU003",
        "PROFESSIONAL COMMUNICATION": "UHU003",
        "MANUFACTURING PROCESSES": "UES102",
        "DIFFERENTIAL EQUATIONS AND LINEAR ALGEBRA": "UMA023",
        "PHYSICS": "UPH013",
        "ENGINEERING DRAWING": "UES101"
    };

    let baseCode = predefinedCodes[normName] || allSubjects[normName];
    return baseCode || "";
}

// --- Auto-fill Code Function ---
function autoFillCode() {
    const inputName = document.getElementById('inpName');
    const inputCode = document.getElementById('inpCode');
    const val = inputName.value.trim();

    const code = getSubjectCode(val, selectedType);
    if (code) {
        inputCode.value = code;
        lastAutoFilledCode = code;
        inputCode.placeholder = "Code (Auto-filled)";
    } else {
        if (inputCode.value === lastAutoFilledCode || !val) {
            inputCode.value = '';
            lastAutoFilledCode = '';
        }
        if (val) {
            inputCode.placeholder = "Enter subject code";
        } else {
            inputCode.placeholder = "Code (Auto-filled)";
        }
    }
}

// --- Modal Functions ---
function openModal(slotElement) {
    if (slotElement.classList.contains('filled')) return;
    currentSlot = slotElement;
    document.getElementById('entryModal').style.display = 'flex';
    resetModal();
}

function closeModal() {
    document.getElementById('entryModal').style.display = 'none';
    currentSlot = null;
}

function showAlert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    if (alertModal && alertMessage) {
        alertMessage.innerText = message;
        alertModal.style.display = 'flex';
    }
}

function closeAlertModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        alertModal.style.display = 'none';
    }
}

function resetModal() {
    document.getElementById('modalTitle').innerText = 'Select Type';
    document.getElementById('typeSelection').style.display = 'flex';
    document.getElementById('dataForm').style.display = 'none';

    const selSubject = document.getElementById('selSubject');
    if (selSubject) selSubject.value = '';

    const inpName = document.getElementById('inpName');
    if (inpName) {
        inpName.value = '';
        inpName.style.display = 'none';
    }

    document.getElementById('inpVenue').value = '';
    
    const inpCode = document.getElementById('inpCode');
    if (inpCode) {
        inpCode.value = '';
        inpCode.placeholder = "Code (Auto-filled)";
    }
    lastAutoFilledCode = '';
}

function showForm(type) {
    selectedType = type;
    document.getElementById('modalTitle').innerText = 'Add ' + type;
    document.getElementById('typeSelection').style.display = 'none';
    document.getElementById('dataForm').style.display = 'flex';
    setTimeout(() => {
        const selSubject = document.getElementById('selSubject');
        if (selSubject) selSubject.focus();
    }, 100);
}

function onSubjectSelectChange() {
    const selSubject = document.getElementById('selSubject');
    const inpName = document.getElementById('inpName');
    const inpCode = document.getElementById('inpCode');

    if (selSubject.value === 'other') {
        inpName.style.display = 'block';
        inpName.value = '';
        inpCode.value = '';
        lastAutoFilledCode = '';
        inpCode.placeholder = "Enter subject code";
        inpName.focus();
    } else {
        inpName.style.display = 'none';
        inpName.value = selSubject.value;
        inpCode.placeholder = "Code (Auto-filled)";
        autoFillCode();
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') saveSlot();
}

function saveSlot() {
    const name = document.getElementById('inpName').value.trim();
    const venue = document.getElementById('inpVenue').value.trim();
    const code = document.getElementById('inpCode').value.trim();

    if (!name) { showAlert("Please enter or select a subject name."); return; }
    if (!code) { showAlert("Please enter a subject code."); return; }

    let tagClass = '';
    if (selectedType === 'Lecture') tagClass = 'lecture';
    else if (selectedType === 'Practical') tagClass = 'practical';
    else if (selectedType === 'Tutorial') tagClass = 'tutorial';

    const htmlContent = `
        <div class="delete-btn" onclick="clearSlot(event, this.parentElement)">×</div>
        <div class="subject-info">
            <div class="subject-name" title="${name}">${name}</div>
            <div class="room-number">${venue}</div>
        </div>
        <div class="tags">
            <span class="tag ${tagClass}">${selectedType}</span>
            <span class="tag code">${code}</span>
        </div>
    `;

    currentSlot.innerHTML = htmlContent;
    currentSlot.classList.remove('empty');
    currentSlot.classList.add('filled');
    currentSlot.removeAttribute('onclick');

    closeModal();
    resetDownloadButton();
}

function clearSlot(event, slotElement) {
    if (event) event.stopPropagation();
    slotElement.innerHTML = '<div class="edit-icon">✎</div>';
    slotElement.classList.remove('filled');
    slotElement.classList.add('empty');
    slotElement.setAttribute('onclick', 'openModal(this)');
    resetDownloadButton();
}

// Close modal when clicking outside
window.onclick = function (event) {
    const entryModal    = document.getElementById('entryModal');
    const batchModal    = document.getElementById('batchModal');
    const alertModal    = document.getElementById('alertModal');
    const electiveModal = document.getElementById('electiveModal');
    if (event.target == entryModal)    closeModal();
    if (event.target == batchModal)    closeBatchModal();
    if (event.target == alertModal)    closeAlertModal();
    if (event.target == electiveModal) closeElectiveModal();
}

// --- Elective Modal ---
let currentElectiveSlot = null;

function openElectiveModal(slotEl, encodedOptions) {
    currentElectiveSlot = slotEl;
    const options = JSON.parse(decodeURIComponent(encodedOptions));
    const list = document.getElementById('electiveList');
    list.innerHTML = '';

    options.forEach((opt, i) => {
        const card = document.createElement('button');
        card.className = 'elective-card';
        card.innerHTML = `
            <div class="elective-card-name">${opt.subject}</div>
            <div class="elective-card-meta">
                <span class="tag ${opt.type.toLowerCase()}" style="font-size:0.7rem;padding:2px 7px;">${opt.type}</span>
                ${opt.code ? `<span class="tag code" style="font-size:0.7rem;padding:2px 7px;">${opt.code}</span>` : ''}
                ${opt.room ? `<span class="elective-card-room">📍 ${opt.room}</span>` : ''}
            </div>
        `;
        card.onclick = () => pickElective(opt);
        list.appendChild(card);
    });

    document.getElementById('electiveModal').style.display = 'flex';
}

function closeElectiveModal() {
    document.getElementById('electiveModal').style.display = 'none';
    currentElectiveSlot = null;
}

function pickElective(opt) {
    if (!currentElectiveSlot) return;
    const tagClass = opt.type.toLowerCase();
    currentElectiveSlot.innerHTML = `
        <div class="delete-btn" onclick="clearElectiveSlot(event, this.parentElement)">×</div>
        <div class="subject-info">
            <div class="subject-name" title="${opt.subject}">${opt.subject}</div>
            <div class="room-number">${opt.room}</div>
        </div>
        <div class="tags">
            <span class="tag ${tagClass}">${opt.type}</span>
            ${opt.code ? `<span class="tag code">${opt.code}</span>` : ''}
        </div>
    `;
    currentElectiveSlot.classList.remove('elective-slot');
    currentElectiveSlot.classList.add('filled');
    currentElectiveSlot.removeAttribute('onclick');
    resetDownloadButton();
    closeElectiveModal();
}

function clearElectiveSlot(event, slotEl) {
    // Same as clearSlot — reset back to empty
    clearSlot(event, slotEl);
}

// --- Download Function ---
function downloadImage() {
    const hasFilledSlot = document.querySelector('.slot.filled') !== null ||
                          document.querySelector('.slot.elective-slot') !== null;
    if (!hasFilledSlot) {
        showAlert("Please select a batch or fill in a slot first.");
        return;
    }

    const btn = document.getElementById('downloadBtn');
    if (!btn || btn.classList.contains('btn-loading') || btn.classList.contains('btn-success')) return;

    const originalHTML = btn.innerHTML;

    // Set loading state
    btn.classList.add('btn-loading');
    btn.innerHTML = `<span class="btn-spinner"></span> Downloading...`;

    const captureElement = document.getElementById('timetable-capture-area');
    const bgColor = '#0f0f15';

    // Temporarily scroll to top so html2canvas captures from origin
    const prevScrollX = window.scrollX;
    const prevScrollY = window.scrollY;
    window.scrollTo(0, 0);

    html2canvas(captureElement, {
        scale: 3,
        backgroundColor: bgColor,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: captureElement.scrollWidth,
        height: captureElement.scrollHeight,
        windowWidth: captureElement.scrollWidth,
        windowHeight: captureElement.scrollHeight
    }).then(canvas => {
        // Restore scroll position
        window.scrollTo(prevScrollX, prevScrollY);

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'my-timetable.png';
        link.href = image;
        link.click();

        // Set success state
        btn.classList.remove('btn-loading');
        btn.classList.add('btn-success');
        btn.innerHTML = `<span class="btn-tick">✓</span> Saved`;

        if (downloadTimeout) clearTimeout(downloadTimeout);
        downloadTimeout = setTimeout(() => {
            btn.classList.remove('btn-success');
            btn.innerHTML = originalHTML;
            downloadTimeout = null;
        }, 10000);
    }).catch(err => {
        window.scrollTo(prevScrollX, prevScrollY);
        console.error("Export failed:", err);
        btn.classList.remove('btn-loading');
        btn.innerHTML = originalHTML;
    });
}

function resetDownloadButton() {
    const btn = document.getElementById('downloadBtn');
    if (btn) {
        btn.classList.remove('btn-loading', 'btn-success');
        btn.innerHTML = 'Download';
    }
    if (downloadTimeout) {
        clearTimeout(downloadTimeout);
        downloadTimeout = null;
    }
}

// --- BATCH MANAGEMENT ---
function openBatchModal() {
    document.getElementById('batchModal').style.display = 'flex';
    document.getElementById('inpBatch').value = '';
    setTimeout(() => {
        const inpBatch = document.getElementById('inpBatch');
        if (inpBatch) inpBatch.focus();
    }, 100);
}

function closeBatchModal() {
    document.getElementById('batchModal').style.display = 'none';
}

function handleBatchEnter(event) {
    if (event.key === 'Enter') submitBatch();
}

function submitBatch() {
    const inpBatch = document.getElementById('inpBatch');
    const batchName = inpBatch.value.trim().toUpperCase();

    if (!batchName) {
        showAlert("Please enter a batch name.");
        return;
    }

    if (!scheduleData) {
        showAlert("Schedule data is still loading. Please try again in a moment.");
        return;
    }

    if (!scheduleData[batchName]) {
        showAlert(`Batch "${batchName}" not found in schedule database.`);
        return;
    }

    const selectBtn = document.getElementById('selectBatchBtn');
    if (selectBtn) {
        selectBtn.innerText = "Batch: " + batchName;
    }

    loadBatch(batchName);
    closeBatchModal();
}

function loadBatch(batchName) {
    clearAllSlots();
    if (!batchName || !scheduleData || !scheduleData[batchName]) return;

    const batchSchedule = scheduleData[batchName];
    const gridChildren = document.getElementById('grid').children;

    for (const day in batchSchedule) {
        const dIdx = dayMap[day];
        if (dIdx === undefined) continue;

        const daySlots = batchSchedule[day];
        for (const timeStr in daySlots) {
            const tIdx = timeSlotMap[timeStr];
            if (tIdx === undefined) continue;

            const slotData = daySlots[timeStr];
            if (!Array.isArray(slotData) || slotData.length < 4) continue;

            const rawCode = slotData[0];
            const rawRoom = slotData[1];
            const rawSubject = slotData[2];
            const type = slotData[3];

            const index = 6 + (tIdx * 6) + dIdx;
            const slot = gridChildren[index];
            if (!slot) continue;

            // --- Elective detection ---
            // A slot is a true multi-elective only when BOTH the subject AND the code
            // contain multiple '/'-separated parts. If only the subject has a slash
            // (e.g. "Chemistry / Applied Chemistry" with a single code) it's just an alias.
            const codeParts = rawCode ? rawCode.split('/').map(s => s.trim()).filter(Boolean) : [];
            const isMultiElective = rawSubject && rawSubject.includes('/') && codeParts.length > 1;

            if (isMultiElective) {
                const codes    = rawCode.split('/');
                const rooms    = rawRoom.split('/');
                const subjects = rawSubject.split('/');

                // Build a JSON-safe array of elective option objects
                const options = subjects.map((sub, i) => ({
                    subject: sub.trim(),
                    code: (codes[i] || '').trim().replace(/\(.*?\)/g, '').trim(),
                    room: (rooms[i] || '').trim(),
                    type: type
                }));

                const optionsAttr = encodeURIComponent(JSON.stringify(options));
                slot.innerHTML = `
                    <div class="elective-banner">
                        <span class="elective-icon">🎓</span>
                        <span class="elective-label">Elective</span>
                    </div>
                    <div class="elective-hint">Tap to choose your subject</div>
                    <div class="tags"><span class="tag ${type.toLowerCase()}">${type}</span></div>
                `;
                slot.classList.remove('empty');
                slot.classList.add('elective-slot');
                slot.setAttribute('onclick', `openElectiveModal(this, '${optionsAttr}')`);
            } else {
                // Normal single subject
                let code = rawCode;
                if (code && code.length > 3 && /[LPT]$/i.test(code.trim())) {
                    code = code.trim().slice(0, -1);
                }
                const tagClass = type.toLowerCase();
                const htmlContent = `
                    <div class="delete-btn" onclick="clearSlot(event, this.parentElement)">×</div>
                    <div class="subject-info">
                        <div class="subject-name" title="${rawSubject}">${rawSubject}</div>
                        <div class="room-number">${rawRoom}</div>
                    </div>
                    <div class="tags">
                        <span class="tag ${tagClass}">${type}</span>
                        <span class="tag code">${code}</span>
                    </div>
                `;
                slot.innerHTML = htmlContent;
                slot.classList.remove('empty');
                slot.classList.add('filled');
                slot.removeAttribute('onclick');
            }
        }
    }
}

function clearAllSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.innerHTML = '<div class="edit-icon">✎</div>';
        slot.classList.remove('filled', 'elective-slot');
        slot.classList.add('empty');
        slot.setAttribute('onclick', 'openModal(this)');
    });
    resetDownloadButton();
}
