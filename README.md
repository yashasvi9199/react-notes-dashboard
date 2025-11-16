# Notes Dashboard

**Live Demo:** [https://yashasvi9199.github.io/react-notes-dashboard](https://yashasvi9199.github.io/react-notes-dashboard)

## 📋 Project Overview

A modern, responsive notes management application built with React.js that provides a seamless note-taking experience with both cloud and local storage capabilities. Features a beautiful glass-morphism design with real-time search, category organization, and comprehensive statistics.

## 🚀 Key Features

- ✨ **Dual Storage System** - Automatic fallback from MySQL to localStorage
- 🎨 **Glass Morphism UI** - Modern translucent design with dark/light themes
- 🔍 **Real-time Search** - Instant search across all notes with debouncing
- 📊 **Statistics Dashboard** - Visual insights into your notes usage
- 🏷️ **Category Management** - Organize notes with customizable categories
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🎯 **Keyboard Friendly** - Smooth interactions and keyboard shortcuts

## 🛠️ Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download Here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download Here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download Here](https://git-scm.com/)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yashasvi9199/react-notes-dashboard.git
cd react-notes-dashboard
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm run install:all
```

### 3. Database Setup

Install MySQL on your system:

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### Arch Linux/CachyOS:
```bash
sudo pacman -Syu
sudo pacman -S mariadb
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo systemctl start mariadb
sudo mysql_secure_installation
```

#### Windows:
Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/mysql/)

### 4. Configure Database

```bash
# Connect to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE react_notes_app;
CREATE USER 'notes_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON react_notes_app.* TO 'notes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Configure Environment

Create notes-backend/.env:
```bash
touch notes-backend/.env
```
```bash
DB_HOST=localhost
DB_USER=notes_user
DB_PASSWORD=your_password_here
DB_NAME=react_notes_app
PORT=5000
NODE_ENV=development
```

### 6. Run the Application

```bash
# Start both frontend and backend simultaneously
npm run dev
```
The application will be available at:
Frontend: [http://localhost:5173/react-notes-dashboard/](http://localhost:5173//react-notes-dashboard/)
Backend API: [http://localhost:5000](http://localhost:5000/)

## 📁 Project Structure
Using tree command output
```bash
# Generate tree in terminal
tree -I 'node_modules|dist|.git' --dirsfirst
```
```markdown
| Directory               | Purpose             | Key Files                             |
|-------------------------|---------------------|---------------------------------------|
| `src/components/`       | React components    | AddNoteForm, NoteCard, CategoryFilter |
| `src/services/`         | API communication   | notesApi.js, categoriesApi.js         |
| `src/styles/`           | CSS styling         | styles.css, components.css            |
| `notes-backend/`        | Node.js server      | server.js, routes/                    |
| `notes-backend/routes/` | API endpoints       | notes.js, categories.js, stats.js     |
```
**Frontend (React)**
- `src/components/` - UI components for notes, forms, filters
- `src/services/` - API communication layer
- `src/styles/` - CSS files with glass morphism design
- `src/context/` - React context for theme management

**Backend (Node.js/Express)**
- `notes-backend/routes/` - REST API endpoints
- `notes-backend/config/` - Database configuration
- `notes-backend/middleware/` - Express middleware

**Configuration**
- `public/` - Static files for GitHub Pages
- `package.json` - Project dependencies and scripts
  
## 🎯 Usage Guide

Local Development
```bash
# Start development servers
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Production Deployment
```bash
# Deploy to GitHub Pages
npm run deploy
```

Database Operations
```bash
# Access MySQL console
mysql -u notes_user -p react_notes_app

# View tables
SHOW TABLES;

# Check notes data
SELECT * FROM notes;
```

## 🌐 API Endpoints

|Method	  |  Endpoint	                |  Description        |
|---------|---------------------------|---------------------|
|GET	    |  /api/health	Server      |  health check       |
|GET	    |  /api/notes	              |  Fetch all notes    |
|POST	    |  /api/notes	              |  Create new note    |
|PUT	    |  /api/notes/:id	          |  Update note        |
|DELETE	  |  /api/notes/:id	          |  Delete note        |
|GET	    |  /api/notes/search/:query	|  Search notes       |
|GET	    |  /api/categories	        |  Get all categories |
|GET	    |  /api/stats	              |  Get statistics     |

## 💾 Smart Storage System
- Automatic Detection: Checks database connectivity on startup
- Graceful Fallback: Seamlessly switches to localStorage when database unavailable
- Data Persistence: Notes saved locally in browser when using GitHub Pages version
- Migration Ready: Easy transition between storage backends

## 🎭 Modern UI/UX
- Glass Morphism Design: Translucent panels with backdrop blur effects
- Theme System: Toggle between dark and light modes
- Responsive Layout: Three-panel design adapts to screen size
- Smooth Animations: CSS transitions and micro-interactions

## 🔧 Advanced Functionality
- Real-time Search: Debounced search with instant results
- Category Filtering: Organize and filter notes by categories
- Statistics Dashboard: Visual analytics of notes usage
- Bulk Operations: Efficient note management

## 🐛 Troubleshooting

### Common Issues
Database Connection Failed:
```bash
# Check MySQL service status
sudo systemctl status mariadb

# Restart MySQL service
sudo systemctl restart mariadb

# Test connection
mysql -u notes_user -p react_notes_app
```
Port Already in Use:
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>
```
Build Errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules notes-backend/node_modules
npm install
cd notes-backend && npm install && cd ..
```

## 🤝 Contributing

1. Fork the repository
1. Create a feature branch: git checkout -b feature/amazing-feature
1. Commit changes: git commit -m 'Add amazing feature'
1. Push to branch: git push origin feature/amazing-feature
1. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/yashasvi9199/react-notes-dashboard/blob/react-notes-dashboard/LICENSE) file for details.

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Vite team for fast build tooling
- MySQL for robust database solutions
- GitHub for free hosting services

### Happy Note-Taking! 📝✨
For questions or support, please open an issue on GitHub.
