
from browser import document, window, timer
import json
import re

currentSlot = None
selectedType = ''
scheduleData = None
allSubjects = {}
lastAutoFilledCode = ''
downloadTimeout = None

timeSlotMap = {
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
}

def getTimeSlotIndex(timeStr):
    if not timeStr: return None
    timeStr = timeStr.strip()
    if timeStr in timeSlotMap: return timeSlotMap[timeStr]
    if len(timeStr) == 4 and timeStr[1] == ':':
        padded = '0' + timeStr
        if padded in timeSlotMap: return timeSlotMap[padded]
    return None

dayMap = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5
}

allBatchNames = [
    "1A11","1A12","1A13","1A14","1A15","1A16","1A17","1A18","1A21","1A22","1A23","1A24","1A25","1A26","1A27","1A28","1A31","1A32","1A33","1A34","1A35","1A36","1A37","1A38","1A41","1A42","1A43","1A44","1A45","1A51","1A52","1A53","1A54","1A55","1A61","1A62","1A63","1A64","1A65","1A71","1A72","1A73","1A74","1A75","1A81","1A82","1A83","1A84","1A85","1A91","1A92","1A93","1A94","1A95",
    "1B11","1B12","1B13","1B14","1B15","1B16","1B17","1B18","1B21","1B22","1B23","1B24","1B25","1B26","1B27","1B28","1B31","1B32","1B33","1B34","1B35","1B36","1B37","1B38","1B41","1B42","1B43","1B44","1B45","1B51","1B52","1B53","1B54","1B55","1B61","1B62","1B63","1B64","1B65","1B71","1B72","1B73","1B74","1B75","1B81","1B82","1B83","1B84","1B85","1B91","1B92","1B93","1B94","1B95",
    "1C11","1C12","1C13","1C14","1C15","1D11","1D12","1D13","1D14","1D15","1G11","1G12","1G13","1G14","1J11","1R11","1R12","1R13","1X11","1X12","1X13","1X14","1X21","1X22","1X23","1X24",
    "2A11","2A12","2B11","2B12","2B13","2C1A","2C11","2C12","2C13","2C14","2C15","2C16","2C17","2C18","2C21","2C22","2C23","2C24","2C25","2C31","2C32","2C33","2C34","2C35","2C41","2C42","2C43","2C44","2C45","2C51","2C52","2C53","2C54","2C55","2C61","2C62","2C63","2C64","2C65","2C71","2C72","2C73","2C74","2C75","2C81","2C82","2D11","2D12","2D13","2D14","2E11","2E12","2E13","2E14","2F11","2F12","2F13","2F14","2F21","2F22","2F23","2F31","2F32","2F33","2G11","2G12","2G13","2G14","2H11","2H12","2H13","2H21","2H22","2H23","2I11","2I12","2I13","2I14","2J11","2J12","2O11","2O12","2O13","2O14","2O15","2O21","2O22","2O23","2O24","2O25","2O31","2O32","2O33","2O34","2Q11","2Q12","2Q13","2Q14","2Q15","2Q21","2Q22","2Q23","2Q24","2Q25","2Q31","2Q32","2Q33","2Q34","2Q35","2Q41","2R11","2R12","2R13","2S11","2S12","2S13","2S14","2S15","2U11","2V11","2V12","2V13","2V14","2W11","2W12","2W13","2W14","2W15","2X11","2X12","2X13","2X14","2X15","2X21","2X22","2X23","2X24",
    "3A11","3A12","3B11","3B12","3B13","3C11","3C12","3C13","3C14","3C15","3C16","3C17","3C18","3C21","3C22","3C23","3C24","3C25","3C31","3C32","3C33","3C34","3C35","3C41","3C42","3C43","3C44","3C45","3C51","3C52","3C53","3C54","3C55","3C61","3C62","3C63","3C64","3C65","3C71","3C72","3C73","3C74","3C75","3D11","3D12","3D13","3D14","3E11","3E12","3E13","3F11","3F12","3F13","3F14","3F15","3F21","3F22","3F23","3F24","3F25","3F31","3F32","3F33","3G11","3G12","3G13","3G14","3G15","3H11","3H12","3H13","3H21","3H22","3H23","3I11","3I12","3I13","3J11","3O11","3O12","3O13","3O14","3O21","3O22","3O23","3O24","3O31","3O32","3O33","3O34","3P11","3P12","3P13","3P14","3Q11","3Q12","3Q13","3Q14","3Q15","3Q16","3Q21","3Q22","3Q23","3Q24","3Q25","3Q26","3Q31","3Q32","3Q33","3Q34","3Q35","3Q41","3R11","3R12","3R13","3S11","3S12","3S13","3S14","3S15","3U11","3V11","3V12","3V13","3W11","3W12","3W13","3W14","3X11","3X12","3X13","3X14","3X15",
    "4A11","4B11","4B12","4B13","4C11","4C12","4C13","4C14","4C15","4C16","4C17","4C18","4C19","4C20","4C21","4C22","4C23","4C24","4C25","4C26","4C27","4C28","4C29","4C30","4C31","4C32","4C33","4C34","4C35","4C36","4C37","4C38","4C39","4C40","4C41","4C42","4C43","4C44","4C45","4C46","4C47","4C48","4D11","4D12","4D13","4D14","4E11","4E12","4F11","4F12","4F13","4F14","4F15","4F21","4F22","4F23","4F24","4G11","4G12","4G13","4G14","4H11","4H12","4H13","4H21","4H22","4H23","4I11","4I12","4I13","4J11","4O11","4O12","4O13","4O14","4O15","4O16","4O21","4O22","4O23","4O24","4O25","4O31","4O32","4O33","4Q11","4Q12","4Q13","4Q14","4Q15","4Q16","4Q17","4Q18","4Q21","4Q22","4Q23","4Q24","4Q25","4Q26","4Q27","4Q28","4R11","4R12","4R13","4S11","4S12","4S13","4S14","4S15","4U11","4V11","4V12","4V13","4W11","4W12","4W13"
]

subjectDisplayNames = set()

predefinedCodes = {
    # Semester I & II
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

    # Semester III & IV
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

    # Semester V & VI
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

    # Semester VII & VIII
    "Compiler Construction": "UCS802",
    "Humanities for Engineers": "UHU005",
    "Agentic AI": "UCS714",
    "Project Semester": "UCS898",
    "Social Network Analysis": "UCS813",
    "Ethical Hacking": "UCS806",
    "Project": "UCS899",
    "Start-Up Semester": "UCS900",

    # Professional Electives
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

    # Generic Electives
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
}

def addSubjectToMap(name, code):
    if not name or not code: return
    cleanName = name.strip()
    baseCode = code.strip()
    if len(baseCode) > 3 and re.search(r'[LPT]$', baseCode, re.I):
        baseCode = baseCode[:-1]
    normKey = re.sub(r'[^a-z0-9]', '', cleanName.lower())

    allSubjects[normKey] = baseCode
    allSubjects[cleanName.upper()] = baseCode
    allSubjects[cleanName] = baseCode

    codeUpper = baseCode.upper()
    allSubjects["CODE_" + codeUpper] = cleanName
    allSubjects["CODE_" + code.strip().upper()] = cleanName

    if codeUpper.startswith("ME"):
        allSubjects["CODE_U" + codeUpper] = cleanName
    elif codeUpper.startswith("UME"):
        allSubjects["CODE_" + codeUpper[1:]] = cleanName

    existingName = None
    for dName in list(subjectDisplayNames):
        if re.sub(r'[^a-z0-9]', '', dName.lower()) == normKey:
            existingName = dName
            break

    if existingName:
        if cleanName in predefinedCodes:
            subjectDisplayNames.remove(existingName)
            subjectDisplayNames.add(cleanName)
    else:
        subjectDisplayNames.add(cleanName)

def initSubjectsData():
    for name, code in predefinedCodes.items():
        addSubjectToMap(name, code)
    
    def on_courses_loaded(req):
        if req.status == 200 or req.status == 0:
            try:
                courses = json.loads(req.responseText)
                if isinstance(courses, list):
                    for item in courses:
                        if item and item.get('course_name') and item.get('course_code'):
                            addSubjectToMap(item['course_name'], item['course_code'])
            except:
                pass
        load_subjects()

    def load_subjects():
        def on_subjects_loaded(req):
            if req.status == 200 or req.status == 0:
                try:
                    data = json.loads(req.responseText)
                    for name, code in data.items():
                        addSubjectToMap(name, code)
                except:
                    pass
            populateSubjectDatalist()

        req2 = window.XMLHttpRequest.new()
        req2.open("GET", "subjects.json", True)
        req2.bind('load', lambda e: on_subjects_loaded(req2))
        req2.bind('error', lambda e: on_subjects_loaded(req2))
        req2.send()

    req = window.XMLHttpRequest.new()
    req.open("GET", "all_courses.json", True)
    req.bind('load', lambda e: on_courses_loaded(req))
    req.bind('error', lambda e: load_subjects())
    req.send()

def populateSubjectDatalist():
    lst = document.getElementById('subjectList')
    if not lst: return
    lst.innerHTML = ''
    sortedSubjects = sorted(list(subjectDisplayNames), key=lambda s: s.lower())
    for sub in sortedSubjects:
        opt = document.createElement('option')
        opt.value = sub
        lst <= opt

def populateBatchDatalist(batches):
    lst = document.getElementById('batchList')
    if not lst: return
    lst.innerHTML = ''
    sortedBatches = sorted(batches)
    for batch in sortedBatches:
        opt = document.createElement('option')
        opt.value = batch
        lst <= opt

def getSubjectCode(subjectName, type):
    if not subjectName: return ""
    clean = subjectName.strip()
    normKey = re.sub(r'[^a-z0-9]', '', clean.lower())

    baseCode = predefinedCodes.get(clean) or predefinedCodes.get(clean.upper()) or allSubjects.get(normKey) or allSubjects.get(clean.upper()) or allSubjects.get(clean)
    if baseCode: return baseCode

    codeKey = clean.upper()
    if len(codeKey) > 3 and re.search(r'[LPT]$', codeKey, re.I):
        codeKey = codeKey[:-1]
    if allSubjects.get("CODE_" + codeKey):
        return codeKey

    return ""

def getSubjectNameFromCode(code):
    if not code: return ""
    cleanCode = code.strip().upper()
    if len(cleanCode) > 3 and re.search(r'[LPT]$', cleanCode, re.I):
        cleanCode = cleanCode[:-1]
    return allSubjects.get("CODE_" + cleanCode) or allSubjects.get("CODE_" + code.strip().upper()) or ""

def autoFillCode(*args):
    global lastAutoFilledCode
    inputName = document.getElementById('inpName')
    inputCode = document.getElementById('inpCode')
    val = inputName.value.strip()

    code = getSubjectCode(val, selectedType)
    if code:
        inputCode.value = code
        lastAutoFilledCode = code
        inputCode.placeholder = "Code (Auto-filled)"
    else:
        if inputCode.value == lastAutoFilledCode or not val:
            inputCode.value = ''
            lastAutoFilledCode = ''
        if val:
            inputCode.placeholder = "Enter subject code"
        else:
            inputCode.placeholder = "Code (Auto-filled)"

def autoFillName(*args):
    inputName = document.getElementById('inpName')
    inputCode = document.getElementById('inpCode')
    codeVal = inputCode.value.strip()

    if codeVal:
        matchedName = getSubjectNameFromCode(codeVal)
        if matchedName and (not inputName.value.strip() or "Auto-filled" in inputName.placeholder):
            inputName.value = matchedName

# Modal Functions
def openModal(slotElement):
    global currentSlot, selectedType
    currentSlot = slotElement
    document.getElementById('entryModal').style.display = 'flex'
    resetModal()

    if 'filled' in list(slotElement.classList):
        subjEl = slotElement.querySelector('.subject-name')
        roomEl = slotElement.querySelector('.room-number')
        codeTag = slotElement.querySelector('.tag.code')
        typeTag = slotElement.querySelector('.tag:not(.code):not(.alternate)')
        altTag = slotElement.querySelector('.tag.alternate')

        subj = subjEl.innerText.strip() if subjEl else ''
        roomRaw = roomEl.getAttribute('data-raw-room') if roomEl and roomEl.hasAttribute('data-raw-room') else (roomEl.innerText.strip() if roomEl else '')
        
        parsed = parseAlternateWeekInfo(roomRaw, subj)
        cleanRoom = parsed['room']
        alternateText = parsed['alternateText']
        
        code = codeTag.innerText.strip() if codeTag else ''
        type = typeTag.innerText.strip() if typeTag else 'Lecture'
        
        selectedType = type
        document.getElementById('modalTitle').innerText = 'Edit ' + type
        document.getElementById('typeSelection').style.display = 'none'
        document.getElementById('dataForm').style.display = 'flex'

        inpName = document.getElementById('inpName')
        inpVenue = document.getElementById('inpVenue')
        inpCode = document.getElementById('inpCode')

        if inpName: inpName.value = subj
        if inpVenue: inpVenue.value = cleanRoom
        if inpCode: inpCode.value = code

        effectiveAlt = altTag.innerText.strip() if altTag else alternateText
        if effectiveAlt == 'Alternate : Week 1':
            chk1 = document.getElementById('chkAltWeek1')
            if chk1: chk1.checked = True
        elif effectiveAlt == 'Alternate : Week 2':
            chk2 = document.getElementById('chkAltWeek2')
            if chk2: chk2.checked = True

def closeModal(*args):
    global currentSlot
    document.getElementById('entryModal').style.display = 'none'
    currentSlot = None

def toggleAltWeek(selected):
    chk1 = document.getElementById('chkAltWeek1')
    chk2 = document.getElementById('chkAltWeek2')
    if selected == 'week1' and chk1 and chk1.checked:
        if chk2: chk2.checked = False
    elif selected == 'week2' and chk2 and chk2.checked:
        if chk1: chk1.checked = False

def showAlert(message):
    alertModal = document.getElementById('alertModal')
    alertMessage = document.getElementById('alertMessage')
    if alertModal and alertMessage:
        alertMessage.innerText = message
        alertModal.style.display = 'flex'

def closeAlertModal(*args):
    alertModal = document.getElementById('alertModal')
    if alertModal:
        alertModal.style.display = 'none'

def resetModal():
    global lastAutoFilledCode
    document.getElementById('modalTitle').innerText = 'Select Type'
    document.getElementById('typeSelection').style.display = 'flex'
    document.getElementById('dataForm').style.display = 'none'

    inpName = document.getElementById('inpName')
    if inpName:
        inpName.value = ''

    document.getElementById('inpVenue').value = ''
    
    inpCode = document.getElementById('inpCode')
    if inpCode:
        inpCode.value = ''
        inpCode.placeholder = "Code (Auto-filled)"

    chk1 = document.getElementById('chkAltWeek1')
    chk2 = document.getElementById('chkAltWeek2')
    if chk1: chk1.checked = False
    if chk2: chk2.checked = False

    lastAutoFilledCode = ''

def showForm(type):
    global selectedType
    selectedType = type
    document.getElementById('modalTitle').innerText = 'Add ' + type
    document.getElementById('typeSelection').style.display = 'none'
    document.getElementById('dataForm').style.display = 'flex'
    def focus_input():
        inpName = document.getElementById('inpName')
        if inpName: inpName.focus()
    timer.set_timeout(focus_input, 100)

def handleEnter(event):
    if event.key == 'Enter': saveSlot()

def parseAlternateWeekInfo(roomStr, subjectStr):
    room = (roomStr or '').strip()
    subject = (subjectStr or '').strip()
    alternateText = None

    combined = (room + ' ' + subject).upper()

    if "FIRST" in combined or "1ST" in combined or "WEEK 1" in combined or "WEEK1" in combined:
        if "ALTERNATE" in combined:
            alternateText = "Alternate : Week 1"
    
    if not alternateText and ("SECOND" in combined or "2ND" in combined or "WEEK 2" in combined or "WEEK2" in combined):
        if "ALTERNATE" in combined:
            alternateText = "Alternate : Week 2"

    room = re.sub(r'FIRST\s*WEEK\s*ONWARDS\s*ALTERNATE\s*WEEK', '', room, flags=re.I)
    room = re.sub(r'FIRSTWEEKONWARDSALTERNATEWEEK', '', room, flags=re.I)
    room = re.sub(r'ALTERNATE\s*FROM\s*FIRST\s*WEEK', '', room, flags=re.I)
    room = re.sub(r'ALTERNATEFROMFIRSTWEEK', '', room, flags=re.I)
    room = re.sub(r'ALTERNATE\s*FROM\s*SECOND\s*WEEK', '', room, flags=re.I)
    room = re.sub(r'ALTERNATEFROMSECONDWEEK', '', room, flags=re.I)
    room = re.sub(r'\(Alternate\s*:\s*Week\s*[12]\)', '', room, flags=re.I)
    room = re.sub(r'Alternate\s*:\s*Week\s*[12]', '', room, flags=re.I)
    room = re.sub(r'\s+', ' ', room).strip()

    return {'room': room, 'alternateText': alternateText}

def buildSlotInnerHTML(displaySubject, rawRoom, type, code, explicitAltText=None):
    parsed = parseAlternateWeekInfo(rawRoom, displaySubject)
    cleanRoom = parsed['room']
    alternateText = parsed['alternateText']
    
    if explicitAltText:
        alternateText = explicitAltText
    
    finalRoom = cleanRoom
    if alternateText and "Alternate" not in rawRoom:
        finalRoom = f"{cleanRoom} ({alternateText})" if cleanRoom else f"({alternateText})"

    finalSubject = displaySubject
    if "ALTERNATEFROM" in finalSubject.upper() or "FIRSTWEEKONWARDS" in finalSubject.upper():
        finalSubject = "Class"

    tagClass = (type or 'Lecture').lower()
    
    html = f'''
        <div class="delete-btn" onclick="clearSlot(event, this.parentElement)">×</div>
        <div class="subject-info">
            <div class="subject-name" title="{finalSubject}">{finalSubject}</div>
            '''
    if cleanRoom:
        html += f'<div class="room-number" data-raw-room="{finalRoom}">{cleanRoom}</div>'
    html += f'''
        </div>
        <div class="tags">
            <span class="tag {tagClass}">{type or 'Lecture'}</span>
            '''
    if code:
        html += f'<span class="tag code">{code}</span>'
    if alternateText:
        html += f'<span class="tag alternate">{alternateText}</span>'
    html += '''
        </div>
    '''
    return html

def saveSlot(*args):
    global currentSlot
    name = document.getElementById('inpName').value.strip()
    venue = document.getElementById('inpVenue').value.strip()
    code = document.getElementById('inpCode').value.strip()

    if not name:
        showAlert("Please enter or select a subject name.")
        return
    if not code:
        showAlert("Please enter a subject code.")
        return

    chk1 = document.getElementById('chkAltWeek1')
    chk2 = document.getElementById('chkAltWeek2')
    altWeekText = ''
    if chk1 and chk1.checked: altWeekText = 'Alternate : Week 1'
    if chk2 and chk2.checked: altWeekText = 'Alternate : Week 2'

    htmlContent = buildSlotInnerHTML(name, venue, selectedType, code, altWeekText)

    currentSlot.innerHTML = htmlContent
    currentSlot.classList.remove('empty')
    currentSlot.classList.add('filled')
    currentSlot.setAttribute('onclick', 'openModal(this)')

    closeModal()
    resetDownloadButton()

def clearSlot(event, slotElement):
    if event: event.stopPropagation()
    slotElement.innerHTML = '<div class="edit-icon">✎</div>'
    slotElement.classList.remove('filled')
    slotElement.classList.add('empty')
    slotElement.setAttribute('onclick', 'openModal(this)')
    resetDownloadButton()

def window_onclick(event):
    entryModal    = document.getElementById('entryModal')
    batchModal    = document.getElementById('batchModal')
    alertModal    = document.getElementById('alertModal')
    electiveModal = document.getElementById('electiveModal')
    if event.target == entryModal:    closeModal()
    if event.target == batchModal:    closeBatchModal()
    if event.target == alertModal:    closeAlertModal()
    if event.target == electiveModal: closeElectiveModal()

window.onclick = window_onclick

currentElectiveSlot = None

def openElectiveModal(slotEl, encodedOptions):
    global currentElectiveSlot
    currentElectiveSlot = slotEl
    options_str = window.decodeURIComponent(encodedOptions)
    options = json.loads(options_str)
    lst = document.getElementById('electiveList')
    lst.innerHTML = ''

    for opt in options:
        card = document.createElement('button')
        card.className = 'elective-card'
        
        subj = opt.get('subject', '')
        typ = opt.get('type', '')
        cod = opt.get('code', '')
        rm = opt.get('room', '')
        
        html = f'''
            <div class="elective-card-name">{subj}</div>
            <div class="elective-card-meta">
                <span class="tag {typ.lower()}" style="font-size:0.7rem;padding:2px 7px;">{typ}</span>
        '''
        if cod:
            html += f'<span class="tag code" style="font-size:0.7rem;padding:2px 7px;">{cod}</span>'
        if rm:
            html += f'<span class="elective-card-room">📍 {rm}</span>'
        html += '''
            </div>
        '''
        card.innerHTML = html
        def make_callback(o):
            return lambda ev: pickElective(o)
        card.bind('click', make_callback(opt))
        lst <= card

    document.getElementById('electiveModal').style.display = 'flex'

def closeElectiveModal(*args):
    global currentElectiveSlot
    document.getElementById('electiveModal').style.display = 'none'
    currentElectiveSlot = None

def pickElective(opt):
    global currentElectiveSlot
    if not currentElectiveSlot: return
    htmlContent = buildSlotInnerHTML(opt.get('subject', ''), opt.get('room', ''), opt.get('type', ''), opt.get('code', ''))
    currentElectiveSlot.innerHTML = htmlContent
    currentElectiveSlot.classList.remove('elective-slot')
    currentElectiveSlot.classList.add('filled')
    currentElectiveSlot.removeAttribute('onclick')
    resetDownloadButton()
    closeElectiveModal()

def clearElectiveSlot(event, slotEl):
    clearSlot(event, slotEl)

def downloadImage(*args):
    global downloadTimeout
    hasFilledSlot = document.querySelector('.slot.filled') is not None or document.querySelector('.slot.elective-slot') is not None
    if not hasFilledSlot:
        showAlert("Please select a batch or fill in a slot first.")
        return

    btn = document.getElementById('downloadBtn')
    if not btn or 'btn-loading' in list(btn.classList) or 'btn-success' in list(btn.classList): return

    originalHTML = btn.innerHTML
    btn.classList.add('btn-loading')
    btn.innerHTML = '<span class="btn-spinner"></span> Downloading...'

    captureElement = document.getElementById('timetable-capture-area')
    bgColor = '#0f0f15'

    prevScrollX = window.scrollX
    prevScrollY = window.scrollY
    window.scrollTo(0, 0)

    options = window.Object.new()
    options.scale = 3
    options.backgroundColor = bgColor
    options.useCORS = True
    options.logging = False
    options.scrollX = 0
    options.scrollY = 0
    options.width = captureElement.scrollWidth
    options.height = captureElement.scrollHeight
    options.windowWidth = captureElement.scrollWidth
    options.windowHeight = captureElement.scrollHeight
    
    def on_canvas(canvas):
        window.scrollTo(prevScrollX, prevScrollY)
        image = canvas.toDataURL("image/png")
        link = document.createElement('a')
        link.download = 'my-timetable.png'
        link.href = image
        link.click()

        btn.classList.remove('btn-loading')
        btn.classList.add('btn-success')
        btn.innerHTML = '<span class="btn-tick">✓</span> Saved'
        
        global downloadTimeout
        if downloadTimeout:
            timer.clear_timeout(downloadTimeout)
        def reset_btn():
            global downloadTimeout
            btn.classList.remove('btn-success')
            btn.innerHTML = originalHTML
            downloadTimeout = None
        downloadTimeout = timer.set_timeout(reset_btn, 10000)
        
    def on_error(err):
        window.scrollTo(prevScrollX, prevScrollY)
        print("Export failed:", err)
        btn.classList.remove('btn-loading')
        btn.innerHTML = originalHTML

    window.html2canvas(captureElement, options).then(on_canvas).catch(on_error)

def resetDownloadButton():
    global downloadTimeout
    btn = document.getElementById('downloadBtn')
    if btn:
        btn.classList.remove('btn-loading', 'btn-success')
        btn.innerHTML = 'Download'
    if downloadTimeout:
        timer.clear_timeout(downloadTimeout)
        downloadTimeout = None

def openBatchModal(*args):
    document.getElementById('batchModal').style.display = 'flex'
    document.getElementById('inpBatch').value = ''
    def focus_input():
        inpBatch = document.getElementById('inpBatch')
        if inpBatch: inpBatch.focus()
    timer.set_timeout(focus_input, 100)

def closeBatchModal(*args):
    document.getElementById('batchModal').style.display = 'none'

def handleBatchEnter(event):
    if getattr(event, 'key', '') == 'Enter': submitBatch()

def submitBatch(*args):
    inpBatch = document.getElementById('inpBatch')
    batchName = inpBatch.value.strip().upper()

    if not batchName:
        showAlert("Please enter a batch name.")
        return

    loadBatch(batchName)

def loadBatch(batchName):
    clearAllSlots()
    if not batchName: return

    def on_batch_loaded(req):
        if req.status == 200 or req.status == 0:
            try:
                data = json.loads(req.responseText)
                selectBtn = document.getElementById('selectBatchBtn')
                if selectBtn:
                    selectBtn.innerText = "Batch: " + batchName
                window.localStorage.setItem('selectedBatch', batchName)
                renderBatchData(data)
                closeBatchModal()
            except Exception as e:
                showAlert(f"Error loading batch '{batchName}': {str(e)}")
        else:
            showAlert(f"Batch '{batchName}' not found in schedules.")

    req = window.XMLHttpRequest.new()
    req.open("GET", f"schedules/{batchName}.json", True)
    req.bind('load', lambda e: on_batch_loaded(req))
    req.bind('error', lambda e: showAlert(f"Batch '{batchName}' not found in schedules."))
    req.send()

def renderBatchData(data):
    if not data or not isinstance(data.get('classes'), list): return

    gridChildren = document.getElementById('grid').children

    for classObj in data['classes']:
        day = classObj.get('day')
        dIdx = dayMap.get(day)
        if dIdx is None: continue

        tIdx = getTimeSlotIndex(classObj.get('start_time'))
        if tIdx is None: continue

        index = 6 + (tIdx * 6) + dIdx
        slot = gridChildren[index]
        if not slot: continue

        rawSubject = (classObj.get('subject') or '').strip()
        rawCode = (classObj.get('code') or '').strip()
        rawRoom = (classObj.get('room') or '').strip()
        type = classObj.get('type') or 'Lecture'

        if (not rawSubject or rawSubject == rawCode or rawSubject == rawCode[:-1]) and rawCode:
            resolvedName = getSubjectNameFromCode(rawCode)
            if resolvedName: rawSubject = resolvedName
        if not rawCode and rawSubject:
            resolvedCode = getSubjectCode(rawSubject, type)
            if resolvedCode: rawCode = resolvedCode

        hasExplicitOptions = isinstance(classObj.get('options'), list) and len(classObj['options']) > 1
        
        codeParts = [s.strip() for s in rawCode.split('/') if s.strip()] if rawCode else []
        singleSubjectAliases = [
            "CHEMISTRY/APPLIED CHEMISTRY",
            "APPLIED CHEMISTRY/CHEMISTRY"
        ]
        isSingleAlias = False
        for alias in singleSubjectAliases:
            if rawSubject.upper() == alias.upper():
                isSingleAlias = True
                break
        
        isSlashMultiElective = not isSingleAlias and rawSubject and '/' in rawSubject and len(codeParts) > 1

        if hasExplicitOptions or isSlashMultiElective:
            options = []
            if hasExplicitOptions:
                for opt in classObj['options']:
                    s = (opt.get('subject_name') or opt.get('subject') or '').strip()
                    c = (opt.get('subject_code') or opt.get('code') or '').strip()
                    if (not s or s == c or s == c[:-1]) and c:
                        resName = getSubjectNameFromCode(c)
                        if resName: s = resName
                    if not c and s:
                        resCode = getSubjectCode(s, opt.get('type') or type)
                        if resCode: c = resCode
                    if c and len(c) > 3 and re.search(r'[LPT]$', c, re.I):
                        c = c[:-1]
                    options.append({
                        'subject': s or c or 'Elective',
                        'code': c,
                        'room': (opt.get('place') or opt.get('room') or '').strip(),
                        'type': opt.get('type') or type
                    })
            else:
                codes = rawCode.split('/')
                rooms = rawRoom.split('/')
                subjects = rawSubject.split('/')
                for i, sub in enumerate(subjects):
                    s = sub.strip()
                    c = (codes[i] if i < len(codes) else '').strip()
                    c = re.sub(r'\(.*?\)', '', c).strip()
                    if (not s or s == c or s == c[:-1]) and c:
                        resName = getSubjectNameFromCode(c)
                        if resName: s = resName
                    if not c and s:
                        resCode = getSubjectCode(s, type)
                        if resCode: c = resCode
                    if c and len(c) > 3 and re.search(r'[LPT]$', c, re.I):
                        c = c[:-1]
                    options.append({
                        'subject': s or c or 'Elective',
                        'code': c,
                        'room': (rooms[i] if i < len(rooms) else '').strip(),
                        'type': type
                    })
                    
            optionsAttr = window.encodeURIComponent(json.dumps(options))
            htmlContent = f'''
                <div class="elective-banner">
                    <span class="elective-icon">🎓</span>
                    <span class="elective-label">Elective</span>
                </div>
                <div class="elective-hint">Tap to choose your subject</div>
                <div class="tags"><span class="tag {type.lower()}">{type}</span></div>
            '''
            slot.innerHTML = htmlContent
            slot.classList.remove('empty')
            slot.classList.add('elective-slot')
            slot.setAttribute('onclick', f"openElectiveModal(this, '{optionsAttr}')")
        else:
            code = rawCode
            if code and len(code) > 3 and re.search(r'[LPT]$', code.strip(), re.I):
                code = code.strip()[:-1]
            displaySubject = rawSubject or rawCode or 'Class'
            htmlContent = buildSlotInnerHTML(displaySubject, rawRoom, type, code)
            slot.innerHTML = htmlContent
            slot.classList.remove('empty')
            slot.classList.add('filled')
            slot.removeAttribute('onclick')

            if displaySubject and rawCode:
                normSubject = displaySubject.strip().upper()
                if normSubject not in allSubjects:
                    allSubjects[normSubject] = code
                subjectDisplayNames.add(displaySubject.strip())

    populateSubjectDatalist()

def clearAllSlots():
    slots = document.querySelectorAll('.slot')
    for slot in slots:
        slot.innerHTML = '<div class="edit-icon">✎</div>'
        slot.classList.remove('filled', 'elective-slot')
        slot.classList.add('empty')
        slot.setAttribute('onclick', 'openModal(this)')
    resetDownloadButton()

# Initialize everything
def window_onload(*args):
    populateBatchDatalist(allBatchNames)
    initSubjectsData()

    savedBatch = window.localStorage.getItem('selectedBatch')
    if savedBatch:
        loadBatch(savedBatch)

    if not window.sessionStorage.getItem('timetableDisclaimerShown'):
        showAlert("Please once verify your timetable with the official Excel sheet, as this site is a student-led project and not anything official.")
        window.sessionStorage.setItem('timetableDisclaimerShown', 'true')

window.onload = window_onload

# Bind to window
window.openBatchModal = openBatchModal
window.downloadImage = downloadImage
window.openModal = openModal
window.showForm = showForm
window.closeModal = closeModal
window.autoFillCode = autoFillCode
window.autoFillName = autoFillName
window.handleEnter = handleEnter
window.toggleAltWeek = toggleAltWeek
window.resetModal = resetModal
window.saveSlot = saveSlot
window.handleBatchEnter = handleBatchEnter
window.submitBatch = submitBatch
window.closeBatchModal = closeBatchModal
window.closeAlertModal = closeAlertModal
window.closeElectiveModal = closeElectiveModal
window.clearSlot = clearSlot
window.openElectiveModal = openElectiveModal
window.clearElectiveSlot = clearElectiveSlot
