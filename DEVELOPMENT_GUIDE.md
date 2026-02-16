# 🛠️ Development & Deployment Guide

## Table of Contents
1. [Development Environment](#development-environment)
2. [Running Locally](#running-locally)
3. [Project Structure](#project-structure)
4. [Making Changes](#making-changes)
5. [Troubleshooting](#troubleshooting)
6. [Deployment Options](#deployment-options)

---

## Development Environment

### System Requirements
- **OS**: Windows, Mac, or Linux
- **Python**: 3.8+ 
- **Browser**: Modern browser (Chrome, Firefox, Edge)
- **RAM**: 512MB+ (minimum)
- **Disk**: 100MB+ free space

### Initial Setup

#### 1. Clone/Download Project
```bash
cd c:\Users\sahil_exgi\OneDrive\Desktop\kp
```

#### 2. Create Virtual Environment (if not done)
```bash
python -m venv .venv
```

#### 3. Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
.venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source .venv/bin/activate
```

#### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 5. Verify Setup
```bash
python verify_setup.py
```

---

## Running Locally

### Start Development Server

```bash
python app.py
```

**Output should show:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### Access the Application

1. **Open in Browser**: http://localhost:5000
2. **API Base URL**: http://localhost:5000/api
3. **Flask Terminal**: Shows requests and errors in real-time

### Stop the Server

- Press `Ctrl+C` in the terminal
- Flask will gracefully shutdown

---

## Project Structure

### Core Application Files

#### `app.py` (245 lines)
```
Flask application with:
├── Database initialization (init_db)
├── Books endpoints (5 routes)
├── Members endpoints (3 routes)
├── Borrowings endpoints (3 routes)
└── Stats endpoint (1 route)
```

**Key Functions:**
- `get_db()` - Database connection
- `init_db()` - Initialize database with seed data
- `get_books()`, `add_book()`, `update_book()`, `delete_book()` - Book CRUD
- `get_members()`, `add_member()`, `delete_member()` - Member CRUD
- `borrow_book()`, `return_book()`, `get_borrowings()` - Borrowing operations
- `get_stats()` - Dashboard statistics

#### `index.html` (700+ lines)
```
React application with:
├── CSS Styling (400+ lines)
├── React Components
│   ├── Toast (notifications)
│   ├── Modal (dialogs)
│   ├── Dashboard (page)
│   ├── BooksPage (page)
│   ├── MembersPage (page)
│   ├── BorrowingsPage (page)
│   └── App (main)
└── API Integration
```

**Key Components:**
- `Toast` - User notifications
- `Modal` - Dialog boxes
- `Dashboard` - Statistics and charts
- `BooksPage` - Book management
- `MembersPage` - Member management
- `BorrowingsPage` - Borrowing system
- `App` - Main application container

#### `library.db`
SQLite database with:
- **books** table - Book catalog
- **members** table - Member registry
- **borrowings** table - Transaction log

---

## Making Changes

### Modifying the Backend

#### Adding a New API Endpoint

1. **Open `app.py`**

2. **Add route decorator and function:**
```python
@app.route("/api/books/<int:book_id>/reviews", methods=["GET"])
def get_book_reviews(book_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM reviews WHERE book_id = ?", (book_id,))
    reviews = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(reviews)
```

3. **Flask auto-reloads** - Changes apply immediately

4. **Test with browser** or **API client** (Postman, Insomnia)

#### Modifying Database Schema

1. **Edit `init_db()` function** in `app.py`

2. **Add table creation:**
```python
c.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        rating INTEGER DEFAULT 5,
        comment TEXT,
        FOREIGN KEY (book_id) REFERENCES books(id)
    )
""")
```

3. **Delete `library.db`** to recreate with new schema

4. **Restart Flask** - Database initializes automatically

### Modifying the Frontend

#### Adding a New Page

1. **Open `index.html`**

2. **Create a new React component:**
```javascript
function ReviewsPage({ bookId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${API}/books/${bookId}/reviews`)
      .then(r => r.json())
      .then(setReviews)
      .catch(e => console.error(e));
  }, [bookId]);

  return (
    <div>
      <h1>Book Reviews</h1>
      {/* ... render reviews ... */}
    </div>
  );
}
```

3. **Add to navigation** in main App:
```javascript
{ id: "reviews", icon: "⭐", label: "Reviews" }
```

4. **Add conditional render:**
```javascript
{page === "reviews" && <ReviewsPage bookId={selectedBook} />}
```

5. **Save file** - Browser auto-refreshes

#### Changing Colors/Styling

1. **Find CSS section** at top of `<style>` tag

2. **Modify color variables:**
```css
:root {
  --accent: #ff6b6b;  /* Changed from #e8c468 */
  --accent2: #4ecdc4; /* Changed from #a78bfa */
}
```

3. **Save and refresh browser** - Changes apply instantly

### Adding Dependencies

#### Install Python Package

1. **Find package on PyPI**: https://pypi.org

2. **Install via pip:**
```bash
pip install package-name==version
```

3. **Add to `requirements.txt`:**
```
flask==3.0.0
flask-cors==4.0.0
package-name==version
```

4. **Test the import:**
```python
import package_name
```

#### Frontend Dependencies

Frontend uses **CDN imports** (no npm needed):
```html
<script src="https://unpkg.com/package@version/dist/file.js"></script>
```

---

## Troubleshooting

### Issue: Port 5000 Already in Use

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace 1234 with PID)
taskkill /PID 1234 /F

# Or use different port in app.py
app.run(debug=True, port=5001)
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: Database Locked

```bash
# Delete corrupted database
rm library.db

# Restart Flask - recreates fresh database
python app.py
```

### Issue: React Not Updating

```bash
# Hard refresh browser
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)

# Or clear cache
Developer Tools → Application → Clear Storage
```

### Issue: CORS Error

Ensure Flask has CORS enabled:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

Check in browser console for error details.

### Issue: API Returns 404

1. **Check Flask terminal** for request logs
2. **Verify endpoint exists** in `app.py`
3. **Check URL spelling** in frontend
4. **Ensure Flask is running** on port 5000

---

## Deployment Options

### Option 1: Local Development (Current)
- **Use for**: Development, testing, learning
- **Pros**: Easy, fast, full control
- **Cons**: No external access

### Option 2: Heroku (Easy)

#### Setup
1. Create account at https://heroku.com
2. Install Heroku CLI
3. Create `Procfile`:
```
web: gunicorn app:app
```

4. Install gunicorn:
```bash
pip install gunicorn
pip freeze > requirements.txt
```

5. Deploy:
```bash
heroku login
heroku create your-app-name
git push heroku main
```

**Live at**: https://your-app-name.herokuapp.com

### Option 3: AWS (Professional)

#### Using Elastic Beanstalk
1. Install AWS CLI
2. Configure credentials
3. Create `.ebextensions/` directory
4. Deploy with `eb deploy`

**Benefits**: Scalable, professional, always-on

### Option 4: Docker (Advanced)

#### Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

#### Build & Run:
```bash
docker build -t library-app .
docker run -p 5000:5000 library-app
```

### Option 5: Traditional Server (Linux)

#### On Ubuntu/Debian:
```bash
# Install dependencies
sudo apt-get install python3-pip
pip3 install -r requirements.txt

# Run with supervisor for auto-restart
pip3 install supervisor
# ... configure supervisor ...

# Start
supervisorctl start library-app
```

**Benefits**: Full control, cheap hosting

---

## Best Practices

### Code Style
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Follow PEP 8 for Python
- ✅ Use meaningful component names for React

### Performance
- ✅ Minimize database queries (use joins)
- ✅ Cache frequently accessed data
- ✅ Compress responses when possible
- ✅ Use indexes on large tables
- ✅ Lazy load heavy components

### Security
- ✅ Always use parameterized queries
- ✅ Validate user input
- ✅ Never store passwords in plain text
- ✅ Use HTTPS in production
- ✅ Implement rate limiting

### Testing
```bash
# Test specific endpoint
python -c "from app import app; 
app.config['TESTING'] = True
client = app.test_client()
print(client.get('/api/books').json)"

# Or use Postman/Insomnia
```

---

## Git Workflow (if using version control)

```bash
# Initialize repo
git init

# Add files
git add .

# Commit changes
git commit -m "Add feature description"

# Create branch for features
git checkout -b feature-name

# Merge back to main
git checkout main
git merge feature-name
```

### `.gitignore`:
```
.venv/
__pycache__/
*.pyc
library.db
.DS_Store
node_modules/
```

---

## Monitoring & Logs

### Flask Logs
- All HTTP requests logged to terminal
- Format: `127.0.0.1 - - [timestamp] "GET /api/books HTTP/1.1" 200 -`
- Status codes: 200 (OK), 404 (Not Found), 500 (Server Error)

### Database Logs
- Enable SQLite logging:
```python
import logging
logging.basicConfig()
logging.getLogger('sqlite3').setLevel(logging.DEBUG)
```

### Browser Logs
- Open Developer Tools: F12
- **Console tab**: JavaScript errors
- **Network tab**: API requests/responses
- **Application tab**: Local storage, cookies

---

## Performance Optimization

### Backend Optimization
```python
# Use connection pooling
# Cache frequently accessed data
# Use database indexes
# Optimize queries with EXPLAIN PLAN
```

### Frontend Optimization
```javascript
// Lazy load components
// Memoize expensive calculations
// Use requestAnimationFrame for animations
// Compress images
```

---

## Conclusion

This guide covers the essential aspects of developing and deploying the Digital Library Management System. Start with **local development** and gradually move to **deployment** as needed.

For more details, see:
- **DOCUMENTATION.md** - Technical details
- **QUICKSTART.md** - Quick start
- **COMPLETION_SUMMARY.md** - Project overview

---

**Happy coding! 🚀**
