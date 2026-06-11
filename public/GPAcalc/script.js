
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

let currentPool = null;
let grades = {};
let bootcampIncluded = {
    'A': true,
    'B': true
};

function switchYear(year) {
    // Update tabs
    document.querySelectorAll('.year-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Hide all year contents
    document.querySelectorAll('[id$="-content"]').forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected year content
    document.getElementById(year + '-content').classList.remove('hidden');

    // Reset pool selection when switching from year 1
    if (year !== 'year1') {
        currentPool = null;
        grades = {};
    } else {
        // When returning to year 1, show pool selector if no pool is selected
        if (!currentPool) {
            document.getElementById('pool-selector').classList.remove('hidden');
            document.getElementById('pool-content').classList.add('hidden');
        } else {
            document.getElementById('pool-selector').classList.add('hidden');
            document.getElementById('pool-content').classList.remove('hidden');
        }
    }
}

function selectPool(pool) {
    currentPool = pool;
    grades = {};
    bootcampIncluded[pool] = true; // reset to included when selecting a pool
    document.getElementById('pool-selector').classList.add('hidden');
    document.getElementById('pool-content').classList.remove('hidden');
    document.getElementById('current-pool').textContent = 'POOL ' + pool;
    renderSubjects();
}

function changePool() {
    currentPool = null;
    grades = {};
    document.getElementById('pool-selector').classList.remove('hidden');
    document.getElementById('pool-content').classList.add('hidden');
    document.getElementById('gpa-value').textContent = '0.00';
}

function renderSubjects() {
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
            const selected = grades[subject.name] === grade ? 'selected' : '';
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
        grades[subjectName] = grade;
    } else {
        delete grades[subjectName];
    }
    calculateGPA();
}

function deleteBootcamp(event) {
    if (event) event.stopPropagation();
    bootcampIncluded[currentPool] = false;
    // Clear the grade of the bootcamp subject from grades
    delete grades['Boot Camp (UTA032)'];
    renderSubjects();
    calculateGPA();
}

function addBootcamp() {
    bootcampIncluded[currentPool] = true;
    renderSubjects();
    calculateGPA();
}

function calculateGPA() {
    const subjects = currentPool === 'A' ? poolA : poolB;
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
        if (subject.isBootcamp && !bootcampIncluded[currentPool]) {
            return;
        }
        const grade = grades[subject.name];
        if (grade) {
            totalPoints += gradePoints[grade] * subject.credits;
            totalCredits += subject.credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('gpa-value').textContent = gpa;
}
