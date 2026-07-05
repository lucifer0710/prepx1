const gradePoints = {
    'A+': 10, 'A': 10, 'A-': 9, 'B': 8, 'B-': 7, 'C': 6, 'C-': 5, 'E': 2, 'F': 0
};

const poolA = [
    { name: 'Programming for Problem Solving (UES103)', credits: 4 },
    { name: 'Electrical & Electronics Engineering (UES013)', credits: 4.5 },
    { name: 'Calculus for Engineers (UMA022)', credits: 3.5 },
    { name: 'Energy and Environment (UEN008)', credits: 2 },
    { name: 'Chemistry (UCB009)', credits: 4 },
    { name: 'Boot Camp (UTA032)', credits: 1, isBootcamp: true }
];

const poolB = [
    { name: 'Professional Communication (UHU003)', credits: 3 },
    { name: 'Manufacturing Processes (UES102)', credits: 3 },
    { name: 'Differential Equations and Linear Algebra (UMA023)', credits: 3.5 },
    { name: 'Physics (UPH013)', credits: 4.5 },
    { name: 'Engineering Drawing (UES101)', credits: 4 },
    { name: 'Boot Camp (UTA032)', credits: 1, isBootcamp: true }
];

let activeView = 'dashboard'; // 'dashboard' or 'calculator'
let currentYear = null;       // 1, 2, 3, 4
let currentPool = null;       // 'A' or 'B'
let grades = {
    'A': {},
    'B': {}
};
let bootcampIncluded = {
    'A': true,
    'B': true
};

function openYear(yearNum) {
    currentYear = yearNum;
    activeView = 'calculator';
    
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('calculator-view').classList.remove('hidden');
    document.getElementById('calc-title').textContent = `Year ${yearNum} Calculator`;
    
    if (yearNum === 1) {
        document.getElementById('year1-calc-content').classList.remove('hidden');
        document.getElementById('other-years-calc-content').classList.add('hidden');
        
        // Show pool selector or active pool content based on state
        if (!currentPool) {
            document.getElementById('pool-selector').classList.remove('hidden');
            document.getElementById('pool-content').classList.add('hidden');
        } else {
            document.getElementById('pool-selector').classList.add('hidden');
            document.getElementById('pool-content').classList.remove('hidden');
            document.getElementById('current-pool').textContent = 'POOL ' + currentPool;
            renderSubjects();
            calculateGPA();
        }
    } else {
        document.getElementById('year1-calc-content').classList.add('hidden');
        document.getElementById('other-years-calc-content').classList.remove('hidden');
    }
}

function showDashboard() {
    activeView = 'dashboard';
    currentYear = null;
    
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('calculator-view').classList.add('hidden');
}

function selectPool(pool) {
    currentPool = pool;
    bootcampIncluded[pool] = true; // reset to included when selecting a pool
    document.getElementById('pool-selector').classList.add('hidden');
    document.getElementById('pool-content').classList.remove('hidden');
    document.getElementById('current-pool').textContent = 'POOL ' + pool;
    renderSubjects();
    calculateGPA();
}

function changePool() {
    currentPool = null;
    document.getElementById('pool-selector').classList.remove('hidden');
    document.getElementById('pool-content').classList.add('hidden');
    document.getElementById('gpa-value').textContent = '0.00';
}

function renderSubjects() {
    if (!currentPool) return;
    const subjects = currentPool === 'A' ? poolA : poolB;
    const grid = document.getElementById('subjects-grid');
    grid.innerHTML = '';

    subjects.forEach((subject, index) => {
        if (subject.isBootcamp && !bootcampIncluded[currentPool]) {
            // Render add bootcamp placeholder card
            const addCard = document.createElement('div');
            addCard.className = 'add-bootcamp-card';
            addCard.onclick = () => addBootcamp();
            addCard.innerHTML = `
                        <span class="add-bootcamp-icon">＋</span>
                        <span>Add Boot Camp (UTA032)</span>
                    `;
            grid.appendChild(addCard);
            return;
        }

        const card = document.createElement('div');
        card.className = 'subject-card';

        let deleteButtonHtml = '';
        if (subject.isBootcamp) {
            deleteButtonHtml = `
                        <button class="delete-btn" onclick="deleteBootcamp(event)" title="Remove Boot Camp">✕</button>
                    `;
        }

        card.innerHTML = `
                    <div class="subject-info">
                        <div class="subject-name">${subject.name}</div>
                    </div>
                    <div class="subject-credits">${subject.credits} Credits</div>
                    <div class="subject-actions">
                        <select class="grade-select" onchange="updateGrade('${subject.name}', this.value)">
                            <option value="">Select Grade</option>
                            ${Object.keys(gradePoints).map(grade => {
            const selected = grades[currentPool][subject.name] === grade ? 'selected' : '';
            return `<option value="${grade}" ${selected}>${grade}</option>`;
        }).join('')}
                        </select>
                        ${deleteButtonHtml}
                    </div>
                `;

        grid.appendChild(card);
    });
}

function updateGrade(subjectName, grade) {
    if (grade) {
        grades[currentPool][subjectName] = grade;
    } else {
        delete grades[currentPool][subjectName];
    }
    calculateGPA();
}

function deleteBootcamp(event) {
    if (event) event.stopPropagation();
    bootcampIncluded[currentPool] = false;
    delete grades[currentPool]['Boot Camp (UTA032)'];
    renderSubjects();
    calculateGPA();
}

function addBootcamp() {
    bootcampIncluded[currentPool] = true;
    renderSubjects();
    calculateGPA();
}

function calculateGPA() {
    if (!currentPool) return;
    const subjects = currentPool === 'A' ? poolA : poolB;
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        if (subject.isBootcamp && !bootcampIncluded[currentPool]) {
            return;
        }
        const grade = grades[currentPool][subject.name];
        if (grade) {
            totalPoints += gradePoints[grade] * subject.credits;
            totalCredits += subject.credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('gpa-value').textContent = gpa;

    // Trigger CGPA calculation
    calculateCGPA();
}

function calculateCGPA() {
    // 1. Calculate Pool A Stats
    let poolAPoints = 0;
    let poolACredits = 0;
    poolA.forEach(subject => {
        if (subject.isBootcamp && !bootcampIncluded['A']) return;
        const grade = grades['A'][subject.name];
        if (grade) {
            poolAPoints += gradePoints[grade] * subject.credits;
            poolACredits += subject.credits;
        }
    });
    const poolAGPA = poolACredits > 0 ? (poolAPoints / poolACredits).toFixed(2) : '0.00';

    // 2. Calculate Pool B Stats
    let poolBPoints = 0;
    let poolBCredits = 0;
    poolB.forEach(subject => {
        if (subject.isBootcamp && !bootcampIncluded['B']) return;
        const grade = grades['B'][subject.name];
        if (grade) {
            poolBPoints += gradePoints[grade] * subject.credits;
            poolBCredits += subject.credits;
        }
    });
    const poolBGPA = poolBCredits > 0 ? (poolBPoints / poolBCredits).toFixed(2) : '0.00';



    // 3. Calculate Overall CGPA (weighted)
    const totalPoints = poolAPoints + poolBPoints;
    const totalCredits = poolACredits + poolBCredits;

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    
    // Update CGPA displays
    const cgpaValEl = document.getElementById('cgpa-value');
    if (cgpaValEl) cgpaValEl.textContent = cgpa;

    const yearCgpaValEl = document.getElementById('year-cgpa-value');
    if (yearCgpaValEl) yearCgpaValEl.textContent = cgpa;
}

function resetAll() {
    grades = {
        'A': {},
        'B': {}
    };
    bootcampIncluded = {
        'A': true,
        'B': true
    };
    
    // Update UI elements
    document.getElementById('gpa-value').textContent = '0.00';
    
    if (currentPool) {
        renderSubjects();
    }
    
    calculateCGPA();
}
