# PrepX 📚

A modern, sleek web interface for accessing academic course materials organized by year and semester. Built with a stunning glassmorphic design and smooth animations.

![PrepX Preview](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

- **Elegant UI/UX**: Glassmorphic cards with smooth hover effects and animations
- **Dynamic Background**: Animated video background with gradient fallback
- **Organized Structure**: Content arranged by academic year and semester
- **Real-time Search**: Filter courses instantly with the search bar
- **Accordion Navigation**: Expandable/collapsible year sections for better organization
- **Direct Integration**: View and download buttons linked to Google Drive folders
- **Responsive Design**: Fully mobile-friendly and adapts to all screen sizes
- **Modern Typography**: Clean, readable Outfit font family

## 🎨 Design Highlights

- Cyberpunk-inspired color scheme with cyan accents
- Floating text animations
- Glassmorphism effects with backdrop blur
- Smooth transitions and hover states
- Radial gradient overlays for depth
- Custom icon buttons with glow effects

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Drive links for your course materials

### Installation

1. **Clone or download** this repository:
```bash
git clone https://github.com/yourusername/prepx.git
cd prepx
```

2. **Open the file**:
   - Simply double-click `index.html` or
   - Right-click → Open with → Your preferred browser

3. **Add your content**:
   - Replace `YOUR_DRIVE_LINK_HERE` with actual Google Drive folder links
   - Update course names, codes, and images as needed

## 📁 Project Structure

```
prepx/
│
├── index.html          # Main HTML file with embedded CSS and JavaScript
└── README.md          # Project documentation
```

## 🔧 Customization Guide

### Adding New Courses

Locate the appropriate semester block and add a new note card:

```html
<div class="note-card">
    <img src="ICON_URL" alt="Subject" class="subject-img">
    <div class="note-details">
        <span class="note-title">Your Course Name</span>
        <span class="note-prof">Course Code</span>
    </div>
    <div class="actions">
        <button class="btn-icon view-btn" onclick="openLink('YOUR_DRIVE_LINK', 'view')">👁</button>
        <button class="btn-icon dl-btn" onclick="openLink('YOUR_DRIVE_LINK', 'download')">⬇</button>
    </div>
</div>
```

### Changing Colors

Modify the CSS variables in the `:root` section:

```css
:root {
    --primary: #00f2fe;      /* Main accent color */
    --secondary: #4facfe;    /* Secondary accent */
    --glass: rgba(20, 20, 30, 0.75);  /* Card background */
    --border: rgba(255, 255, 255, 0.15);  /* Border color */
}
```

### Updating Background Video

Replace the video source URL in the HTML:

```html
<source src="YOUR_VIDEO_URL.mp4" type="video/mp4">
```

Or use the animated gradient fallback by removing the video element entirely.

## 🎯 Usage

### For Students

1. **Browse by Year**: Click on any year header to expand course listings
2. **Search Courses**: Type in the search bar to filter specific subjects
3. **Access Materials**: 
   - Click the 👁 (eye) icon to view files in Google Drive
   - Click the ⬇ (download) icon to download materials

### For Administrators

1. **Organize Content**: Upload course materials to Google Drive folders
2. **Get Shareable Links**: Generate sharing links for each folder
3. **Update HTML**: Replace placeholder links with actual Drive URLs
4. **Deploy**: Host on any web server or GitHub Pages

## 🌐 Deployment Options

### GitHub Pages (Free)

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and save
4. Access at `https://yourusername.github.io/prepx`

### Netlify/Vercel (Free)

1. Connect your repository
2. Deploy with one click
3. Get instant HTTPS and CDN

### Traditional Hosting

Upload `index.html` to any web server via FTP/SFTP

## 🔍 Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome  | ✅ | Fully supported |
| Firefox | ✅ | Fully supported |
| Safari  | ✅ | Requires webkit prefixes (included) |
| Edge    | ✅ | Fully supported |
| Opera   | ✅ | Fully supported |

## 📱 Mobile Support

PrepX is fully responsive and works seamlessly on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop monitors

## ⚡ Performance

- **Lightweight**: Single HTML file with no external dependencies
- **Fast Loading**: Minimal assets, optimized animations
- **Efficient**: CSS animations use GPU acceleration
- **Cached Resources**: External fonts and icons load from CDN

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 To-Do

- [ ] Add dark/light theme toggle
- [ ] Implement user authentication
- [ ] Add favorites/bookmarks feature
- [ ] Include download progress indicators
- [ ] Add multi-language support
- [ ] Integrate calendar for exam dates
- [ ] Add professor ratings/reviews

## 🐛 Known Issues

- Download button redirects to Drive folder (not direct download) for folder links
- Search doesn't persist across page reloads
- Video may not play on some mobile browsers with strict autoplay policies

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with 💙 by [Your Name]

## 🙏 Acknowledgments

- Background video from [Pexels](https://www.pexels.com/)
- Icons from [Flaticon](https://www.flaticon.com/)
- Font from [Google Fonts](https://fonts.google.com/)
- Inspired by modern web design trends

## 📧 Contact

Have questions or suggestions? Reach out:

- 📧 Email: your.email@example.com
- 🐦 Twitter: [@yourhandle](https://twitter.com/yourhandle)
- 💼 LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

⭐ **Star this repo** if you find it helpful!

Made with ❤️ for students everywhere
