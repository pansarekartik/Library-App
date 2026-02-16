# 📚 Digital Library Management System
### Complete Full-Stack Prototype — React + Flask + SQLite

A modern digital library management system with books, members, and borrowing tracking. Perfect for internship projects or portfolio demonstrations!

---

## ⚡ Quick Start (2 Minutes)

### For Your Friend:

**Requirements:**
- Python 3.8+
- Modern web browser

**Setup:**
```bash
# 1. Open project folder
cd kp

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# Mac/Linux:
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the server
python app.py
```

**That's it!** 🎉

Open your browser to: **http://localhost:5000**

---

## 📋 Features

✅ **Dashboard** — Statistics, charts, recent activity
✅ **Books Management** — Add, search, filter, delete books
✅ **Members** — Add/remove members, track member types
✅ **Borrowings** — Issue & return books, track due dates
✅ **Dark Theme** — Professional modern UI
✅ **Real-time API** — Instant updates across pages
✅ **Demo Data** — Comes with sample books and members

---

## 🗂️ Project Files

```
kp/
├── app.py              ← Flask backend (main server)
├── index.html          ← React frontend (all-in-one)
├── library.db          ← SQLite database (auto-created)
├── requirements.txt    ← Python dependencies
├── README.md           ← This file
├── QUICKSTART.md       ← Feature guide
├── DOCUMENTATION.md    ← Technical details
├── DEVELOPMENT_GUIDE.md ← Advanced setup & deployment
├── COMPLETION_SUMMARY.md ← Project overview
└── verify_setup.py     ← System check tool
```


---

## 🔌 API Endpoints Reference

All requests go to `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /stats | Dashboard statistics & genre distribution |
| GET | /books | List all books (filter: ?q=&genre=) |
| POST | /books | Add new book |
| DELETE | /books/:id | Remove book |
| GET | /members | List all members |
| POST | /members | Register new member |
| DELETE | /members/:id | Remove member |
| GET | /borrowings | List all borrowing records |
| POST | /borrowings | Issue book to member |
| POST | /borrowings/:id/return | Return borrowed book |

---

## 📚 Demo Data Included

**Sample Books:**
- The Great Gatsby, To Kill a Mockingbird, 1984, Clean Code, The Pragmatic Programmer, Sapiens, Dune, Atomic Habits

**Sample Members:**
- Alice Johnson (Premium), Bob Smith (Standard), Carol White (Standard), David Brown (Premium)

**Sample Borrowing:**
- Dune borrowed by Alice Johnson (due Feb 15, 2026)

---

## 🆘 Troubleshooting

### Port 5000 Already in Use?
```bash
# Change port in app.py (last line):
app.run(debug=True, port=5001)  # Use 5001 instead
```

### Database Issues?
```bash
# Delete the database and restart Flask
rm library.db
python app.py  # Creates fresh database with demo data
```

### Verify Everything Works
```bash
python verify_setup.py
```

---

## 📖 Documentation

For more details, see:
- **[QUICKSTART.md](QUICKSTART.md)** — Feature walkthrough & first steps
- **[DOCUMENTATION.md](DOCUMENTATION.md)** — Full technical reference
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** — Building & deploying
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** — Project overview

---

## 🚀 Deployment Options

### Local Network (LAN)
Share with friends on same WiFi:
```bash
# In app.py, change:
app.run(debug=True, host='0.0.0.0', port=5000)
# Access from: http://YOUR_IP:5000
```

### Online Deployment
- **Heroku** — Free tier available
- **AWS** — EC2 or Elastic Beanstalk
- **Replit** — Browser-based IDE (great for demos)
- **PythonAnywhere** — Easy Python hosting

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for deployment instructions.

---

## 📝 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Flask | 3.0.0 |
| Frontend | React | 18+ |
| Database | SQLite | Built-in |
| Styling | CSS3 | Custom |
| Fonts | Google Fonts | Playfair Display, DM Sans |

---

## 👤 Author
Created as a full-stack internship project demonstrating professional web development practices.

**Status:** ✅ Complete and production-ready

---

**Happy coding! 🎉**

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Flask (Python) |
| Database | SQLite (via sqlite3 stdlib) |
| Styling | Pure CSS (no framework) |
| CORS | flask-cors |

---

## 💡 Connecting Frontend to Backend

In `LibraryApp.jsx`, the `API` constant at the top of the file points to the backend:
```js
const API = "http://localhost:5000/api";
```
The prototype uses mock data for instant demo. To switch to live API calls, replace the mock state setters with `fetch()` calls to the endpoints above.
