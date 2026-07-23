let currentSlot = null;
let selectedType = '';
let scheduleData = null;
let allSubjects = {};
let lastAutoFilledCode = '';
let downloadTimeout = null;

const timeSlotMap = {
    "08:00": 0, "08:00 AM": 0,
    "08:50": 1, "08:50 AM": 1,
    "09:40": 2, "09:40 AM": 2,
    "10:30": 3, "10:30 AM": 3,
    "11:20": 4, "11:20 AM": 4,
    "12:10": 5, "12:10 PM": 5, "12:10 AM": 5,
    "13:00": 6, "01:00 PM": 6,
    "13:50": 7, "01:50 PM": 7,
    "14:40": 8, "02:40 PM": 8,
    "15:30": 9, "03:30 PM": 9,
    "16:20": 10, "04:20 PM": 10,
    "17:10": 11, "05:10 PM": 11,
    "18:00": 12, "06:00 PM": 12
};

function getTimeSlotIndex(timeStr) {
    if (!timeStr) return undefined;
    timeStr = timeStr.trim();
    if (timeSlotMap[timeStr] !== undefined) return timeSlotMap[timeStr];
    if (timeStr.length === 4 && timeStr[1] === ':') {
        const padded = '0' + timeStr;
        if (timeSlotMap[padded] !== undefined) return timeSlotMap[padded];
    }
    return undefined;
}

const dayMap = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5
};

const allBatchNames = [
    "1A11","1A12","1A13","1A14","1A15","1A16","1A17","1A18","1A21","1A22","1A23","1A24","1A25","1A26","1A27","1A28","1A31","1A32","1A33","1A34","1A35","1A36","1A37","1A38","1A41","1A42","1A43","1A44","1A45","1A51","1A52","1A53","1A54","1A55","1A61","1A62","1A63","1A64","1A65","1A71","1A72","1A73","1A74","1A75","1A81","1A82","1A83","1A84","1A85","1A91","1A92","1A93","1A94","1A95",
    "1B11","1B12","1B13","1B14","1B15","1B16","1B17","1B18","1B21","1B22","1B23","1B24","1B25","1B26","1B27","1B28","1B31","1B32","1B33","1B34","1B35","1B36","1B37","1B38","1B41","1B42","1B43","1B44","1B45","1B51","1B52","1B53","1B54","1B55","1B61","1B62","1B63","1B64","1B65","1B71","1B72","1B73","1B74","1B75","1B81","1B82","1B83","1B84","1B85","1B91","1B92","1B93","1B94","1B95",
    "1C11","1C12","1C13","1C14","1C15","1D11","1D12","1D13","1D14","1D15","1G11","1G12","1G13","1G14","1J11","1R11","1R12","1R13","1X11","1X12","1X13","1X14","1X21","1X22","1X23","1X24",
    "2A11","2A12","2B11","2B12","2B13","2C11","2C12","2C13","2C14","2C15","2C16","2C17","2C18","2C21","2C22","2C23","2C24","2C25","2C31","2C32","2C33","2C34","2C35","2C41","2C42","2C43","2C44","2C45","2C51","2C52","2C53","2C54","2C55","2C61","2C62","2C63","2C64","2C65","2C71","2C72","2C73","2C74","2C75","2C81","2C82","2D11","2D12","2D13","2D14","2E11","2E12","2E13","2E14","2F11","2F12","2F13","2F14","2F21","2F22","2F23","2F31","2F32","2F33","2G11","2G12","2G13","2G14","2H11","2H12","2H13","2H21","2H22","2H23","2I11","2I12","2I13","2I14","2J11","2J12","2O11","2O12","2O13","2O14","2O15","2O21","2O22","2O23","2O24","2O25","2O31","2O32","2O33","2O34","2Q11","2Q12","2Q13","2Q14","2Q15","2Q21","2Q22","2Q23","2Q24","2Q25","2Q31","2Q32","2Q33","2Q34","2Q35","2Q41","2R11","2R12","2R13","2S11","2S12","2S13","2S14","2S15","2U11","2V11","2V12","2V13","2V14","2W11","2W12","2W13","2W14","2W15","2X11","2X12","2X13","2X14","2X15","2X21","2X22","2X23","2X24",
    "3A11","3A12","3B11","3B12","3B13","3C11","3C12","3C13","3C14","3C15","3C16","3C17","3C18","3C21","3C22","3C23","3C24","3C25","3C31","3C32","3C33","3C34","3C35","3C41","3C42","3C43","3C44","3C45","3C51","3C52","3C53","3C54","3C55","3C61","3C62","3C63","3C64","3C65","3C71","3C72","3C73","3C74","3C75","3D11","3D12","3D13","3D14","3E11","3E12","3E13","3F11","3F12","3F13","3F14","3F15","3F21","3F22","3F23","3F24","3F25","3F31","3F32","3F33","3G11","3G12","3G13","3G14","3G15","3H11","3H12","3H13","3H21","3H22","3H23","3I11","3I12","3I13","3J11","3O11","3O12","3O13","3O14","3O21","3O22","3O23","3O24","3O31","3O32","3O33","3O34","3P11","3P12","3P13","3P14","3Q11","3Q12","3Q13","3Q14","3Q15","3Q16","3Q21","3Q22","3Q23","3Q24","3Q25","3Q26","3Q31","3Q32","3Q33","3Q34","3Q35","3Q41","3R11","3R12","3R13","3S11","3S12","3S13","3S14","3S15","3U11","3V11","3V12","3V13","3W11","3W12","3W13","3W14","3X11","3X12","3X13","3X14","3X15",
    "4A11","4B11","4B12","4B13","4C11","4C12","4C13","4C14","4C15","4C16","4C17","4C18","4C19","4C20","4C21","4C22","4C23","4C24","4C25","4C26","4C27","4C28","4C29","4C30","4C31","4C32","4C33","4C34","4C35","4C36","4C37","4C38","4C39","4C40","4C41","4C42","4C43","4C44","4C45","4C46","4C47","4C48","4D11","4D12","4D13","4D14","4E11","4E12","4F11","4F12","4F13","4F14","4F15","4F21","4F22","4F23","4F24","4G11","4G12","4G13","4G14","4H11","4H12","4H13","4H21","4H22","4H23","4I11","4I12","4I13","4J11","4O11","4O12","4O13","4O14","4O15","4O16","4O21","4O22","4O23","4O24","4O25","4O31","4O32","4O33","4Q11","4Q12","4Q13","4Q14","4Q15","4Q16","4Q17","4Q18","4Q21","4Q22","4Q23","4Q24","4Q25","4Q26","4Q27","4Q28","4R11","4R12","4R13","4S11","4S12","4S13","4S14","4S15","4U11","4V11","4V12","4V13","4W11","4W12","4W13"
];

let subjectDisplayNames = new Set();

// Master PDF & Curriculum Subject Codes
const predefinedCodes = {
    // Semester I & II
    "Chemistry": "UCB009",
    "Applied Chemistry": "UCB008",
    "Programming for Problem Solving": "UES103",
    "Electrical & Electronics Engineering": "UES013",
    "Energy and Environment": "UEN008",
    "Calculus for Engineers": "UMA022",
    "Physics": "UPH013",
    "Engineering Drawing": "UES101",
    "Professional Communication": "UHU003",
    "Manufacturing Processes": "UES102",
    "Differential Equations and Linear Algebra": "UMA023",

    // Semester III & IV
    "Operating Systems": "UCS303",
    "Object Oriented Programming": "UTA018",
    "Data Structures": "UCS301",
    "Discrete Mathematical Structures": "UCS405",
    "Discrete Mathematics": "UNC305",
    "Electronics Devices and Circuits": "UEC304",
    "Engineering Design Project I": "UTA016",
    "Numerical Linear Algebra": "UMA021",
    "The Evolutionary Basis of Human Behaviour for Engineers": "UHU052",
    "Introduction to Sustainable Green Computing": "UCS320",
    "Design and Analysis of Algorithms": "UCS415",
    "Database Management Systems": "UCS310",
    "Computer Networks": "UCS414",
    "AI for Engineers": "UCS321",
    "Probability and Statistics": "UMA401",
    "Engineering Design Project II": "UTA024",
    "Aptitude Skills Building": "UTD003",

    // Semester V & VI
    "Machine Learning": "UML501",
    "Cognitive Computing": "UCS420",
    "Enterprise Web Application": "UCS553",
    "Software Engineering": "UCS503",
    "Computer Architecture and Organization": "UCS510",
    "Ethics and Risk Mitigation in AI": "UCS421",
    "Theory of Computation": "UCS701",
    "Optimization Techniques": "UMA071",
    "Numerical Optimization": "UMA035",
    "Quantum Computing": "UCS619",
    "Image Processing": "UCS615",
    "Innovation and Entrepreneurship": "UTA025",
    "Capstone Project": "UCS797",

    // Semester VII & VIII
    "Compiler Construction": "UCS802",
    "Humanities for Engineers": "UHU005",
    "Agentic AI": "UCS714",
    "Project Semester": "UCS898",
    "Social Network Analysis": "UCS813",
    "Ethical Hacking": "UCS806",
    "Project": "UCS899",
    "Start-Up Semester": "UCS900",

    // Professional Electives
    "Cloud Computing": "UCS531",
    "GPU Computing": "UCS635",
    "Parallel & Distributed Computing": "UCS645",
    "Simulation & Modelling": "UCS751",
    "Computer Vision": "UCS532",
    "3D Modelling and Animation": "UCS636",
    "Game Design & Development": "UCS646",
    "Augmented and Virtual Reality": "UCS752",
    "Computer & Network Security": "UCS534",
    "Secure Coding": "UCS638",
    "Cyber Forensics": "UCS648",
    "Blockchain Technology and Applications": "UCS754",
    "Linear Algebra for Artificial Intelligence and Machine Learning": "UMC513",
    "Financial Mathematics": "UMC632",
    "Mathematics for Quantum Computing": "UMC633",
    "Cryptography and Coding Theory": "UMC744",
    "Foundation of Data Science": "UCS548",
    "Predictive Analytics using Statistics": "UCS654",
    "Deep Learning": "UCS761",
    "Data Science: Computer Vision & NLP": "UCS772",
    "Finance, Accounting and Valuation": "UCS539",
    "Financial Markets and Portfolio Theory": "UCS675",
    "Derivatives Pricing, Trading and Strategies": "UCS658",
    "Quantitative and Statistical Methods for Finance": "UMC743",
    "Source Code Management": "UCS537",
    "Build and Release Management": "UCS659",
    "Continuous Integration and Continuous Deployment": "UCS660",
    "System Provisioning and Configuration Management": "UCS758",
    "UI & UX Specialist": "UCS542",
    "Data Engineering": "UCS677",
    "Test Automation": "UCS662",
    "Cloud & DevOps": "UCS745",
    "Conversational AI: Accelerated Data Science": "UCS551",
    "Conversational AI: Natural Language Processing": "UCS664",
    "Conversational AI: Speech Processing & Synthesis": "UCS749",
    "Generative AI": "UCS748",
    "Edge AI and Robotics: Data Centre Vision": "UCS668",
    "Edge AI and Robotics: Accelerated Data Science": "UCS547",
    "Edge AI and Robotics: Embedded Vision": "UCS671",
    "Edge AI and Robotics: Reinforcement Learning & Conversational AI": "UCS760",
    "Network Defence": "UCS550",
    "Ethical Hacking-1": "UCS673",
    "Ethical Hacking-2": "UCS674",
    "Computer Hacking and Forensic Investigation": "UCS750",
    "Network and Communication for Connected Vehicles": "UEC646",
    "Intelligent Transportation Systems": "UCS678",
    "Data Analytics in Automobile Engineering": "UCS679",
    "Matrix Computation": "UMC622",
    "Mathematical Modeling and Simulation": "UMC512",
    "Computational Number Theory": "UMC742",

    // Generic Electives
    "Introductory Course in French": "UHU016",
    "Introduction to Cognitive Science": "UHU017",
    "Introduction to Corporate Finance": "UHU018",
    "Introduction to Cyber Security": "UCS002",
    "Nanoscience and Nanomaterials": "UPH064",
    "Technologies for Sustainable Development": "UEN006",
    "Graph Theory and Applications": "UMA069",
    "Biology for Engineers": "UBT510",
    "Advanced Numerical Methods": "UMA070",
    "Campus 2 Corporate": "UTD004",
    "Creative Writing": "UHU051"
};

// --- Page Load Handler ---
window.onload = function () {
    populateBatchDatalist(allBatchNames);
    initSubjectsData();

    const savedBatch = localStorage.getItem('selectedBatch');
    if (savedBatch) {
        loadBatch(savedBatch);
    }
};

function addSubjectToMap(name, code) {
    if (!name || !code) return;
    const cleanName = name.trim();
    let baseCode = code.trim();
    if (baseCode.length > 3 && /[LPT]$/i.test(baseCode)) {
        baseCode = baseCode.slice(0, -1);
    }
    const normKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    allSubjects[normKey] = baseCode;
    allSubjects[cleanName.toUpperCase()] = baseCode;
    allSubjects[cleanName] = baseCode;

    // Code to Subject Name reverse lookup mapping
    const codeUpper = baseCode.toUpperCase();
    allSubjects["CODE_" + codeUpper] = cleanName;
    allSubjects["CODE_" + code.trim().toUpperCase()] = cleanName;

    if (codeUpper.startsWith("ME")) {
        allSubjects["CODE_U" + codeUpper] = cleanName;
    } else if (codeUpper.startsWith("UME")) {
        allSubjects["CODE_" + codeUpper.slice(1)] = cleanName;
    }

    // Deduplicate in subjectDisplayNames case-insensitively
    let existingName = null;
    for (const dName of subjectDisplayNames) {
        if (dName.toLowerCase().replace(/[^a-z0-9]/g, "") === normKey) {
            existingName = dName;
            break;
        }
    }

    if (existingName) {
        if (predefinedCodes[cleanName]) {
            subjectDisplayNames.delete(existingName);
            subjectDisplayNames.add(cleanName);
        }
    } else {
        subjectDisplayNames.add(cleanName);
    }
}

function initSubjectsData() {
    for (const [name, code] of Object.entries(predefinedCodes)) {
        addSubjectToMap(name, code);
    }

    fetch('all_courses.json')
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Could not load all_courses.json");
        })
        .then(courses => {
            if (Array.isArray(courses)) {
                courses.forEach(item => {
                    if (item && item.course_name && item.course_code) {
                        addSubjectToMap(item.course_name, item.course_code);
                    }
                });
            }
        })
        .catch(err => {
            console.log("all_courses.json notice:", err);
        })
        .finally(() => {
            fetch('subjects.json')
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Could not load subjects.json");
                })
                .then(data => {
                    for (const [name, code] of Object.entries(data)) {
                        addSubjectToMap(name, code);
                    }
                })
                .catch(err => {
                    console.log("Using built-in subject database:", err);
                })
                .finally(() => {
                    populateSubjectDatalist();
                });
        });
}

function populateSubjectDatalist() {
    const list = document.getElementById('subjectList');
    if (!list) return;
    list.innerHTML = '';
    const sortedSubjects = Array.from(subjectDisplayNames).sort((a, b) => a.localeCompare(b));
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

// --- Subject Code & Name Lookup Helpers ---
function getSubjectCode(subjectName, type) {
    if (!subjectName) return "";
    const clean = subjectName.trim();
    const normKey = clean.toLowerCase().replace(/[^a-z0-9]/g, "");

    let baseCode = predefinedCodes[clean] || predefinedCodes[clean.toUpperCase()] || allSubjects[normKey] || allSubjects[clean.toUpperCase()] || allSubjects[clean];
    if (baseCode) return baseCode;

    let codeKey = clean.toUpperCase();
    if (codeKey.length > 3 && /[LPT]$/i.test(codeKey)) {
        codeKey = codeKey.slice(0, -1);
    }
    if (allSubjects["CODE_" + codeKey]) {
        return codeKey;
    }

    return "";
}

function getSubjectNameFromCode(code) {
    if (!code) return "";
    let cleanCode = code.trim().toUpperCase();
    if (cleanCode.length > 3 && /[LPT]$/i.test(cleanCode)) {
        cleanCode = cleanCode.slice(0, -1);
    }
    return allSubjects["CODE_" + cleanCode] || allSubjects["CODE_" + code.trim().toUpperCase()] || "";
}

// --- Auto-fill Functions ---
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

function autoFillName() {
    const inputName = document.getElementById('inpName');
    const inputCode = document.getElementById('inpCode');
    const codeVal = inputCode.value.trim();

    if (codeVal) {
        const matchedName = getSubjectNameFromCode(codeVal);
        if (matchedName && (!inputName.value.trim() || inputName.placeholder.includes("Auto-filled"))) {
            inputName.value = matchedName;
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

    const inpName = document.getElementById('inpName');
    if (inpName) {
        inpName.value = '';
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
        const inpName = document.getElementById('inpName');
        if (inpName) inpName.focus();
    }, 100);
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

    loadBatch(batchName);
}

function loadBatch(batchName) {
    clearAllSlots();
    if (!batchName) return;

    fetch(`schedules/${batchName}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Batch "${batchName}" not found in schedules.`);
            }
            return response.json();
        })
        .then(data => {
            const selectBtn = document.getElementById('selectBatchBtn');
            if (selectBtn) {
                selectBtn.innerText = "Batch: " + batchName;
            }
            localStorage.setItem('selectedBatch', batchName);
            renderBatchData(data);
            closeBatchModal();
        })
        .catch(error => {
            showAlert(error.message || `Error loading batch "${batchName}".`);
        });
}

function renderBatchData(data) {
    if (!data || !Array.isArray(data.classes)) return;

    const gridChildren = document.getElementById('grid').children;

    data.classes.forEach(classObj => {
        const day = classObj.day;
        const dIdx = dayMap[day];
        if (dIdx === undefined) return;

        const tIdx = getTimeSlotIndex(classObj.start_time);
        if (tIdx === undefined) return;

        const index = 6 + (tIdx * 6) + dIdx;
        const slot = gridChildren[index];
        if (!slot) return;

        let rawSubject = (classObj.subject || '').trim();
        let rawCode = (classObj.code || '').trim();
        const rawRoom = (classObj.room || '').trim();
        const type = classObj.type || 'Lecture';

        // Fallback dynamic resolution if subject is missing or equal to code
        if ((!rawSubject || rawSubject === rawCode || rawSubject === rawCode.slice(0, -1)) && rawCode) {
            const resolvedName = getSubjectNameFromCode(rawCode);
            if (resolvedName) rawSubject = resolvedName;
        }
        if (!rawCode && rawSubject) {
            const resolvedCode = getSubjectCode(rawSubject, type);
            if (resolvedCode) rawCode = resolvedCode;
        }

        // Check if options array exists and has items > 1
        const hasExplicitOptions = Array.isArray(classObj.options) && classObj.options.length > 1;

        // Check slash-separated multi-elective as fallback
        const codeParts = rawCode ? rawCode.split('/').map(s => s.trim()).filter(Boolean) : [];
        const singleSubjectAliases = [
            "CHEMISTRY/APPLIED CHEMISTRY",
            "APPLIED CHEMISTRY/CHEMISTRY"
        ];
        const isSingleAlias = singleSubjectAliases.some(
            alias => rawSubject.toUpperCase() === alias.toUpperCase()
        );
        const isSlashMultiElective = !isSingleAlias && rawSubject && rawSubject.includes('/') && codeParts.length > 1;

        if (hasExplicitOptions || isSlashMultiElective) {
            let options = [];
            if (hasExplicitOptions) {
                options = classObj.options.map(opt => {
                    let s = (opt.subject_name || opt.subject || '').trim();
                    let c = (opt.subject_code || opt.code || '').trim();
                    if ((!s || s === c || s === c.slice(0, -1)) && c) {
                        const resName = getSubjectNameFromCode(c);
                        if (resName) s = resName;
                    }
                    if (!c && s) {
                        const resCode = getSubjectCode(s, opt.type || type);
                        if (resCode) c = resCode;
                    }
                    if (c && c.length > 3 && /[LPT]$/i.test(c)) {
                        c = c.slice(0, -1);
                    }
                    return {
                        subject: s || c || 'Elective',
                        code: c,
                        room: (opt.place || opt.room || '').trim(),
                        type: opt.type || type
                    };
                });
            } else {
                const codes = rawCode.split('/');
                const rooms = rawRoom.split('/');
                const subjects = rawSubject.split('/');
                options = subjects.map((sub, i) => {
                    let s = sub.trim();
                    let c = (codes[i] || '').trim().replace(/\(.*?\)/g, '').trim();
                    if ((!s || s === c || s === c.slice(0, -1)) && c) {
                        const resName = getSubjectNameFromCode(c);
                        if (resName) s = resName;
                    }
                    if (!c && s) {
                        const resCode = getSubjectCode(s, type);
                        if (resCode) c = resCode;
                    }
                    if (c && c.length > 3 && /[LPT]$/i.test(c)) {
                        c = c.slice(0, -1);
                    }
                    return {
                        subject: s || c || 'Elective',
                        code: c,
                        room: (rooms[i] || '').trim(),
                        type: type
                    };
                });
            }

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
            const displaySubject = rawSubject || rawCode || 'Class';
            const htmlContent = `
                <div class="delete-btn" onclick="clearSlot(event, this.parentElement)">×</div>
                <div class="subject-info">
                    <div class="subject-name" title="${displaySubject}">${displaySubject}</div>
                    <div class="room-number">${rawRoom}</div>
                </div>
                <div class="tags">
                    <span class="tag ${tagClass}">${type}</span>
                    ${code ? `<span class="tag code">${code}</span>` : ''}
                </div>
            `;
            slot.innerHTML = htmlContent;
            slot.classList.remove('empty');
            slot.classList.add('filled');
            slot.removeAttribute('onclick');

            if (displaySubject && rawCode) {
                const normSubject = displaySubject.trim().toUpperCase();
                if (!allSubjects[normSubject]) {
                    allSubjects[normSubject] = code;
                }
                subjectDisplayNames.add(displaySubject.trim());
            }
        }
    });

    populateSubjectDatalist();
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
