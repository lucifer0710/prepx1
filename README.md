<div align="center">

  <img src="favicon5.gif" alt="PrepX Logo" width="120" height="120" style="border-radius: 20px;">

  # 📚 PrepX

  ### *Your Ultimate All-in-One Academic & Campus Companion*

  A modern, high-aesthetic web application designed for students to seamlessly access course materials, compute CGPA, view batch timetables, and navigate campus life with a single click.

  [![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()

  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-utility-suite">Utility Suite</a> •
    <a href="#-tech-stack--dependencies">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-customization-guide">Customization</a> •
    <a href="#-contributing">Contributing</a>
  </p>

</div>

---

## 🌟 Overview

**PrepX** replaces fragmented drives and lost links with an ultra-sleek, cyberpunk & glassmorphism-inspired academic portal. Whether you need first-year Engineering notes, quick WiFi credentials, your daily batch timetable, or instant CGPA calculation, PrepX puts everything right at your fingertips with dynamic search and retro animations.

---

## ✨ Key Features

| Feature | Description | Highlights |
| :--- | :--- | :--- |
| 📚 **Academic Notes Vault** | Organizes course materials by Year, Semester (Pool A & Pool B), and Course Code. | 1-Click View (👁) & Direct Download (⬇) via Google Drive |
| ⚡ **Instant Search** | Filter courses instantly by subject title or course code (e.g., `UES103`, `UMA022`). | Live client-side DOM filtering with auto-expanding accordions |
| 📅 **Interactive Timetable** | Dedicated schedule portal for batch-wise class timings and rooms. | Powered by interactive JSON schedule datasets |
| 📊 **CGPA Calculator** | Built-in grade calculator to estimate term and cumulative GPA. | Clean interface tailored to academic credit points |
| 📶 **WiFi Credentials Vault** | Quick-access secret modal containing campus WiFi network passwords. | One-click copy & credential list download |
| 🗺️ **Campus Map Viewer** | Interactive modal displaying high-resolution campus maps. | Full zoom & download capabilities |
| 🎨 **Glassmorphism Design** | Modern dark theme with floating text, glowing accents, and smooth scroll focus. | Cyberpunk cyan accents (`#00f2fe`) & backdrop blur |

---

## 🛠️ Utility Suite

PrepX comes packed with integrated utilities accessible directly from the interface:

### 1. 📅 Batch Timetable Portal (`/timetable/`)
- View full schedules filtered by batch, branch, and day of the week.
- Fast JSON-driven lookups for lecture halls and lab slots.

### 2. 📊 CGPA / GPA Calculator (`/GPAcalc/`)
- Calculate your Semester GPA (SGPA) and Cumulative GPA (CGPA) on the fly.
- Customized for university grading structures and credit weightings.

### 3. 📶 Campus WiFi & Map Modals
- **WiFi Vault**: Accessible via top-left action button. Displays network SSIDs and passwords with one-click copy.
- **Campus Map**: Accessible via top-right action button (`map.png` viewer with instant download).

---

## 💻 Tech Stack & Dependencies

- **Frontend Core**: HTML5, Vanilla CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Animations)
- **Module Bundler**: [Vite 5.2](https://vitejs.dev/)
- **Libraries**:
  - `gifuct-js` - GIF parsing engine for live animated favicons
  - `@vercel/analytics` - Web analytics integration
- **Typography & Icons**: [Outfit Font Family](https://fonts.google.com/specimen/Outfit) via Google Fonts, SVG icons, Flaticon assets

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- `npm` or `yarn`

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/lucifer0710/prepx1.git
   cd prepx1
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch Local Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**
   ```bash
   npm run build
   ```
   The production build artifacts will be generated in the `dist/` directory.

---

## 📁 Project Structure

```
prepx1/
├── index.html              # Main application entry file & glassmorphic layout
├── style.css               # Main design system, glassmorphism, animations & CSS variables
├── script.js               # Application logic, search engine, accordion & favicon animator
├── analytics.js            # Vercel analytics integration
├── vite.config.js          # Vite bundler configuration
├── package.json            # Dependencies & script definitions
│
├── public/                 # Static assets & sub-applications
│   ├── map.png             # High-resolution campus map asset
│   ├── GPAcalc/            # CGPA / GPA Calculator mini-app
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── timetable/          # Interactive Timetable portal
│       ├── index.html
│       ├── schedule.json   # Timetable dataset
│       ├── script.js
│       └── style.css
│
└── assets / media /        # Video & GIF background media
    ├── favicon4.gif        # Animated site favicon
    ├── mario.gif           # Desktop background GIF
    ├── pmario.mov          # Mobile background video
    └── asprepx1.mp4        # Interactive video asset
```

---

## 🔧 Customization Guide

### Adding New Courses

To add new course cards, locate the target `.notes-grid` block in `index.html` and append a new course item:

```html
<div class="note-card">
    <img src="YOUR_ICON_URL.png" alt="Subject Name" class="subject-img">
    <div class="note-details">
        <span class="note-title">Course Title</span>
        <span class="note-prof">Course Code (e.g., UES103)</span>
    </div>
    <div class="actions">
        <button class="btn-icon view-btn" onclick="openLink('YOUR_GOOGLE_DRIVE_FOLDER_LINK', 'view')">👁</button>
        <button class="btn-icon dl-btn" onclick="openLink('YOUR_GOOGLE_DRIVE_FILE_LINK', 'download')">⬇</button>
    </div>
</div>
```

### Customizing Design System & Theme Colors

Modify the root CSS custom properties inside `style.css`:

```css
:root {
    --primary: #00f2fe;               /* Primary Neon Cyan Accent */
    --secondary: #4facfe;             /* Electric Blue Secondary Accent */
    --glass: rgba(20, 20, 30, 0.75);   /* Card Glassmorphic Background */
    --border: rgba(255, 255, 255, 0.15); /* Subtle Glass Border */
}
```

---

## 🌐 Deployment

### Deploying on Vercel / Netlify

1. Push your repository to GitHub.
2. Connect your repo to **Vercel** or **Netlify**.
3. Set Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**!

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project (`https://github.com/lucifer0710/prepx1/fork`)
2. Create your Feature Branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your Changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the Branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

  **Made with ❤️ for students everywhere**

  ⭐ **Star this repository** if you find PrepX useful!

</div>
