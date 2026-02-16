# 📚 Digital Library Management System - Complete Prototype

## Overview
A full-stack library management system built with **React (Frontend)**, **Flask (Backend)**, and **SQLite (Database)**. This is a professional-grade internship project demonstrating modern web development practices.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | ReactJS 18 | Interactive UI with hooks |
| **Backend** | Flask 3.0 | REST API with CORS support |
| **Database** | SQLite3 | Lightweight, file-based database |
| **Styling** | CSS3 + Design System | Modern dark theme UI |
| **Build Tool** | Babel Standalone | Client-side JSX compilation |

---

## 📁 Project Structure

```
kp/
├── app.py                      # Flask backend application
├── index.html                  # React frontend (single file)
├── library.db                  # SQLite database (auto-created)
├── requirements.txt            # Python dependencies
├── LibraryApp.jsx             # Original JSX component (archived)
├── README.md                  # Original documentation
└── .venv/                     # Python virtual environment
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Modern web browser (Chrome, Firefox, Edge)
- Internet connection (for CDN React libraries)

### Setup & Run

**1. Install Dependencies**
```bash
cd c:\Users\sahil_exgi\OneDrive\Desktop\kp
pip install -r requirements.txt
```

**2. Start Backend Server**
```bash
python app.py
```
- Flask API runs on: `http://localhost:5000`
- Database auto-initializes with seed data
- Debug mode enabled for development

**3. Open Frontend**
- Navigate to: `http://localhost:5000`
- App loads automatically from Flask

---

## 💻 Features Implemented

### Dashboard Page
- 📊 **Statistics Cards**: Total books, available copies, members, borrowings, overdue count
- 📈 **Genre Distribution Chart**: Visual bar chart of book genres
- 📜 **Recent Borrowings**: Latest 4 borrowing transactions with status badges
- Real-time data sync with backend API

### Books Management
- 📕 **View All Books**: Comprehensive list with details
- 🔍 **Search & Filter**: By title, author, ISBN, or genre
- ✏️ **Add New Book**: Modal form with validation
- 🗑️ **Delete Books**: With confirmation dialog
- 📊 **Availability Status**: Live copy tracking (available/out)
- **Columns**: Title, Author, Genre, Year, Copies, Status

### Members Management
- 👥 **Manage Members**: Add, view, and remove library members
- 🎯 **Member Types**: Standard and Premium memberships
- 🔍 **Search Members**: By name or email
- 👤 **Member Profiles**: Avatar, contact info, membership type
- 📅 **Join Date Tracking**: Automatic timestamp recording

### Borrowings System
- 📋 **Issue Books**: Select book and member from dropdowns
- ⏰ **Auto Due Date**: Books auto-set to 14-day lending period
- 📖 **Return Books**: Mark books as returned with return date
- ⚠️ **Overdue Tracking**: Highlights overdue items in red
- 🔄 **Filter Borrowings**: View all, borrowed, or returned items
- 💾 **Status Management**: Track borrowing lifecycle

---

## 🔌 REST API Endpoints

### Books
```
GET    /api/books              # List all books (with search/filter)
GET    /api/books/<id>         # Get single book
POST   /api/books              # Add new book
PUT    /api/books/<id>         # Update book
DELETE /api/books/<id>         # Delete book
```

### Members
```
GET    /api/members            # List all members (with search)
POST   /api/members            # Add new member
DELETE /api/members/<id>       # Delete member
```

### Borrowings
```
GET    /api/borrowings         # List all borrowings with details
POST   /api/borrowings         # Issue a book
POST   /api/borrowings/<id>/return  # Return a book
```

### Statistics
```
GET    /api/stats              # Dashboard statistics
```

---

## 🗄️ Database Schema

### Books Table
```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    genre TEXT,
    year INTEGER,
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    description TEXT,
    cover_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### Members Table
```sql
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    membership_type TEXT DEFAULT 'standard',
    join_date TEXT DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1
)
```

### Borrowings Table
```sql
CREATE TABLE borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date TEXT DEFAULT CURRENT_TIMESTAMP,
    due_date TEXT,
    return_date TEXT,
    status TEXT DEFAULT 'borrowed',
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
)
```

---

## 🎨 Design System

### Color Palette
```css
--bg: #0f0e17              /* Dark background */
--surface: #1a1828         /* Card background */
--surface2: #252336        /* Hover state */
--accent: #e8c468          /* Primary gold */
--accent2: #a78bfa         /* Secondary purple */
--red: #ff6b6b             /* Error/overdue */
--green: #6bffb8           /* Success/available */
--text: #fffffe            /* Main text */
--muted: #a7a5b8           /* Secondary text */
--border: #2e2c42          /* Dividers */
```

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)
- **Font Weights**: 300, 400, 500, 600, 700

---

## 📊 Seed Data

### Books (8 demo books)
1. The Great Gatsby - F. Scott Fitzgerald (Fiction, 1925)
2. To Kill a Mockingbird - Harper Lee (Fiction, 1960)
3. 1984 - George Orwell (Dystopian, 1949)
4. Clean Code - Robert C. Martin (Technology, 2008)
5. The Pragmatic Programmer - Andrew Hunt (Technology, 1999)
6. Sapiens - Yuval Noah Harari (History, 2011)
7. Dune - Frank Herbert (Sci-Fi, 1965) *[Currently borrowed by Alice Johnson]*
8. Atomic Habits - James Clear (Self-Help, 2018)

### Members (4 demo members)
1. Alice Johnson - Premium (alice@email.com)
2. Bob Smith - Standard (bob@email.com)
3. Carol White - Standard (carol@email.com)
4. David Brown - Premium (david@email.com)

### Sample Borrowing
- Dune borrowed by Alice Johnson
- Due: 2026-02-15
- Status: Borrowed

---

## 🔧 Configuration

### Flask Settings (app.py)
```python
DEBUG = True           # Development mode
PORT = 5000            # Server port
CORS enabled           # Allow cross-origin requests
Auto-reload = True     # Reload on file changes
```

### Frontend Settings (index.html)
```javascript
const API = "http://localhost:5000/api"
React 18 from CDN      # @18/umd
Babel Standalone       # Client JSX compilation
```

---

## 🚀 Advanced Features

### Error Handling
- Toast notifications for success/error messages
- Validation on form inputs
- Confirmation dialogs for destructive actions
- Loading states with spinners

### State Management
- React hooks (useState, useEffect, useCallback)
- Automatic data refetch on mutations
- In-memory state for UI responsiveness

### User Experience
- Responsive design (mobile-friendly)
- Dark theme optimized for eyes
- Smooth animations and transitions
- Real-time search and filtering

---

## 📝 How to Use

### Adding a Book
1. Click **Books** in sidebar
2. Click **+ Add Book** button
3. Fill in: Title*, Author*, ISBN, Genre, Year, Copies, Description
4. Click **Add Book**

### Managing Members
1. Click **Members** in sidebar
2. Click **+ Add Member** button
3. Fill in: Name*, Email*, Phone, Membership Type
4. Click **Add Member**
5. Search members by name or email
6. Click **Remove** to delete a member

### Issuing a Book
1. Click **Borrowings** in sidebar
2. Click **+ Issue Book** button
3. Select book and member from dropdowns
4. Due date auto-sets to 14 days
5. Click **Issue Book**

### Returning a Book
1. Click **Borrowings** in sidebar
2. Filter by "Borrowed" status
3. Click **Return** button on the book
4. Book marked as returned with today's date

### Dashboard Insights
1. **Statistics**: View library metrics at a glance
2. **Genre Chart**: See distribution of book genres
3. **Recent Activity**: Latest borrowing transactions

---

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in app.py
app.run(debug=True, port=5001)
```

### CORS Errors
- Ensure Flask-CORS is installed: `pip install flask-cors==4.0.0`
- CORS is pre-configured in app.py with `CORS(app)`

### Database Errors
- Delete `library.db` to reset: `rm library.db`
- Restart Flask to reinitialize with seed data

### Frontend Not Loading
- Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Check Flask is running on port 5000
- Check browser console for JavaScript errors

---

## 📦 Dependencies

### Backend (requirements.txt)
```
flask==3.0.0
flask-cors==4.0.0
```

### Frontend (CDN-based)
```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=..."></link>
```

---

## 🎯 Future Enhancements

### Phase 2 Features
- 📧 Email notifications for due dates
- 📊 Advanced analytics dashboard
- 🔐 User authentication & roles
- 📱 Mobile app version
- 🔄 Fine/penalty system
- 📚 Book recommendations
- 🏷️ Barcode scanning
- 👮 Admin controls

### Technical Improvements
- TypeScript for type safety
- Jest/React Testing Library for tests
- Docker containerization
- PostgreSQL for production
- JWT token authentication
- Rate limiting
- API documentation (Swagger)

---

## 📄 License & Credits

**Project Type**: Internship Project  
**Stack**: MERN-like (React + Flask)  
**Level**: Intermediate  
**Estimated Hours**: 20-30 hours development

### Key Components
- **Frontend Architecture**: Component-based React with hooks
- **Backend Design**: RESTful API with Flask
- **Database**: Normalized SQLite schema
- **Styling**: Custom CSS with design system

---

## 📞 Support & Questions

For issues or questions:
1. Check the **Troubleshooting** section
2. Review Flask terminal output for errors
3. Check browser console (F12) for frontend errors
4. Ensure all dependencies are installed

---

## ✅ Verification Checklist

- ✅ Flask backend running on port 5000
- ✅ SQLite database initialized with seed data
- ✅ React frontend loads from index.html
- ✅ All API endpoints functional
- ✅ CRUD operations on Books, Members, Borrowings
- ✅ Search and filter features working
- ✅ Toast notifications displaying
- ✅ Responsive design functioning
- ✅ Error handling implemented
- ✅ UI dark theme applied

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack web development
- ✅ RESTful API design
- ✅ React hooks and state management
- ✅ Database design and SQL
- ✅ Frontend-backend integration
- ✅ Error handling and validation
- ✅ UI/UX design principles
- ✅ Code organization and structure

---

**Version**: 1.0.0  
**Created**: February 2026  
**Status**: Production Ready  

🚀 **The Digital Library Management System is complete and ready to use!**
