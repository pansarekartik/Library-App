# 🚀 Quick Start Guide - Digital Library Management System

## ⚡ One-Minute Setup

### Currently Running:
✅ **Backend**: Flask API on http://localhost:5000  
✅ **Frontend**: React UI on http://localhost:5000  
✅ **Database**: SQLite (auto-initialized)  

### Open the App:
Just navigate to → **http://localhost:5000** in your browser

---

## 📖 First Steps

### 1. View Dashboard
- See library statistics
- Genre distribution chart  
- Recent borrowing activity

### 2. Explore Books
- Click **Books** in sidebar
- View 8 demo books with different genres
- Search by title, author, or ISBN
- Filter by genre

### 3. Check Members
- Click **Members** in sidebar
- See 4 registered members
- Standard and Premium memberships
- Member contact information

### 4. Manage Borrowings
- Click **Borrowings** in sidebar
- See Dune borrowed by Alice Johnson
- Filter by status (All, Borrowed, Returned)

---

## ✨ Try These Features

### Add a New Book
```
Click: + Add Book button
Enter: Title, Author, Genre, etc.
Click: Add Book
Result: Book appears in table
```

### Add a New Member
```
Click: + Add Member button
Enter: Name, Email, Phone, Type
Click: Add Member
Result: Member added to system
```

### Issue a Book
```
Click: + Issue Book button
Select: Book + Member from dropdowns
Due date: Auto-set to 14 days
Click: Issue Book
Result: Borrowing record created
```

### Search & Filter
```
Books page: Search by title/author/ISBN
Members page: Search by name/email
Borrowings page: Filter by status
```

---

## 🗂️ File Structure

```
c:\Users\sahil_exgi\OneDrive\Desktop\kp\
├── app.py                # Flask backend (REST API)
├── index.html           # React frontend (single file)
├── library.db           # SQLite database
├── requirements.txt     # Python dependencies
├── DOCUMENTATION.md     # Full documentation
└── .venv/              # Virtual environment
```

---

## 🔧 If Server Stops

### Restart Flask:
```bash
cd c:\Users\sahil_exgi\OneDrive\Desktop\kp
python app.py
```

Then open: **http://localhost:5000**

---

## 📊 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/books` | List books |
| POST | `/api/books` | Add book |
| DELETE | `/api/books/<id>` | Delete book |
| GET | `/api/members` | List members |
| POST | `/api/members` | Add member |
| DELETE | `/api/members/<id>` | Delete member |
| GET | `/api/borrowings` | List borrowings |
| POST | `/api/borrowings` | Issue book |
| POST | `/api/borrowings/<id>/return` | Return book |
| GET | `/api/stats` | Dashboard stats |

---

## 🎯 Demo Data Included

### Books (8)
- The Great Gatsby, To Kill a Mockingbird, 1984
- Clean Code, The Pragmatic Programmer
- Sapiens, Dune, Atomic Habits

### Members (4)
- Alice Johnson (Premium)
- Bob Smith (Standard)
- Carol White (Standard)
- David Brown (Premium)

### Active Borrowing
- **Dune** → Alice Johnson (Due: 2026-02-15)

---

## 🎨 UI Highlights

- 🌙 Dark theme with gold accents
- ⚡ Smooth animations & transitions
- 📱 Responsive design
- 🔔 Toast notifications
- ✅ Form validation
- ⏳ Loading states

---

## 💡 Pro Tips

1. **Reset Database**: Delete `library.db` and restart Flask
2. **Check Errors**: Open browser console (F12) for errors
3. **API Testing**: Use Postman or Thunder Client
4. **Search**: Use partial matches (e.g., "Gatsby" finds "The Great Gatsby")
5. **Overdue Books**: Automatically highlighted in red

---

## 📚 More Information

For detailed documentation, see: **DOCUMENTATION.md**

---

**Status**: ✅ Ready to Use  
**Last Updated**: February 16, 2026  
**Version**: 1.0.0
