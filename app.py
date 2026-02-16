from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DB_PATH = "library.db"

@app.route("/")
def serve_index():
    return send_file('index.html')

# ─────────────────────────────────────────────
# DATABASE INIT
# ─────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS books (
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
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            membership_type TEXT DEFAULT 'standard',
            join_date TEXT DEFAULT CURRENT_TIMESTAMP,
            active INTEGER DEFAULT 1
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS borrowings (
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
    """)

    # Seed some demo data
    c.execute("SELECT COUNT(*) FROM books")
    if c.fetchone()[0] == 0:
        books = [
            ("The Great Gatsby", "F. Scott Fitzgerald", "978-0-7432-7356-5", "Fiction", 1925, 3, 2, "A story of the Jazz Age", ""),
            ("To Kill a Mockingbird", "Harper Lee", "978-0-06-112008-4", "Fiction", 1960, 2, 1, "A tale of racial injustice", ""),
            ("1984", "George Orwell", "978-0-452-28423-4", "Dystopian", 1949, 4, 4, "A dystopian novel", ""),
            ("Clean Code", "Robert C. Martin", "978-0-13-235088-4", "Technology", 2008, 2, 2, "A handbook of agile software craftsmanship", ""),
            ("The Pragmatic Programmer", "Andrew Hunt", "978-0-13-595705-9", "Technology", 1999, 3, 3, "Your journey to mastery", ""),
            ("Sapiens", "Yuval Noah Harari", "978-0-06-231609-7", "History", 2011, 2, 2, "A Brief History of Humankind", ""),
            ("Dune", "Frank Herbert", "978-0-441-17271-9", "Sci-Fi", 1965, 1, 0, "Epic science fiction saga", ""),
            ("Atomic Habits", "James Clear", "978-0-73-521129-2", "Self-Help", 2018, 5, 5, "Tiny changes, remarkable results", ""),
        ]
        c.executemany("INSERT INTO books (title, author, isbn, genre, year, total_copies, available_copies, description, cover_url) VALUES (?,?,?,?,?,?,?,?,?)", books)

        members = [
            ("Alice Johnson", "alice@email.com", "555-0101", "premium"),
            ("Bob Smith", "bob@email.com", "555-0102", "standard"),
            ("Carol White", "carol@email.com", "555-0103", "standard"),
            ("David Brown", "david@email.com", "555-0104", "premium"),
        ]
        c.executemany("INSERT INTO members (name, email, phone, membership_type) VALUES (?,?,?,?)", members)

        # Seed a borrowing (Dune is out)
        due = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
        c.execute("INSERT INTO borrowings (book_id, member_id, due_date) VALUES (7, 1, ?)", (due,))

    conn.commit()
    conn.close()

# ─────────────────────────────────────────────
# BOOKS
# ─────────────────────────────────────────────
@app.route("/api/books", methods=["GET"])
def get_books():
    q = request.args.get("q", "").lower()
    genre = request.args.get("genre", "")
    conn = get_db()
    c = conn.cursor()
    query = "SELECT * FROM books WHERE 1=1"
    params = []
    if q:
        query += " AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(isbn) LIKE ?)"
        params += [f"%{q}%", f"%{q}%", f"%{q}%"]
    if genre:
        query += " AND genre = ?"
        params.append(genre)
    c.execute(query, params)
    books = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(books)

@app.route("/api/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    book = c.fetchone()
    conn.close()
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(dict(book))

@app.route("/api/books", methods=["POST"])
def add_book():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("""INSERT INTO books (title, author, isbn, genre, year, total_copies, available_copies, description)
                     VALUES (?,?,?,?,?,?,?,?)""",
                  (data["title"], data["author"], data.get("isbn"), data.get("genre"),
                   data.get("year"), data.get("total_copies", 1), data.get("total_copies", 1), data.get("description")))
        conn.commit()
        book_id = c.lastrowid
        conn.close()
        return jsonify({"id": book_id, "message": "Book added"}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "ISBN already exists"}), 400

@app.route("/api/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute("""UPDATE books SET title=?, author=?, isbn=?, genre=?, year=?,
                 total_copies=?, description=? WHERE id=?""",
              (data["title"], data["author"], data.get("isbn"), data.get("genre"),
               data.get("year"), data.get("total_copies", 1), data.get("description"), book_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})

@app.route("/api/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM books WHERE id = ?", (book_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

# ─────────────────────────────────────────────
# MEMBERS
# ─────────────────────────────────────────────
@app.route("/api/members", methods=["GET"])
def get_members():
    q = request.args.get("q", "").lower()
    conn = get_db()
    c = conn.cursor()
    if q:
        c.execute("SELECT * FROM members WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ?", (f"%{q}%", f"%{q}%"))
    else:
        c.execute("SELECT * FROM members")
    members = [dict(row) for row in c.fetchall()]
    for member in members:
        member['member_type'] = member.pop('membership_type', 'standard')
    conn.close()
    return jsonify(members)

@app.route("/api/members", methods=["POST"])
def add_member():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO members (name, email, phone, membership_type) VALUES (?,?,?,?)",
                  (data["name"], data["email"], data.get("phone"), data.get("member_type", "standard")))
        conn.commit()
        mid = c.lastrowid
        conn.close()
        return jsonify({"id": mid, "message": "Member added"}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email already registered"}), 400

@app.route("/api/members/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM members WHERE id = ?", (member_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

# ─────────────────────────────────────────────
# BORROWINGS
# ─────────────────────────────────────────────
@app.route("/api/borrowings", methods=["GET"])
def get_borrowings():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT br.id, br.borrow_date, br.due_date, br.return_date, br.status,
               b.title as book_title, b.author as book_author,
               m.name as member_name, m.email as member_email,
               br.book_id, br.member_id
        FROM borrowings br
        JOIN books b ON br.book_id = b.id
        JOIN members m ON br.member_id = m.id
        ORDER BY br.borrow_date DESC
    """)
    rows = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route("/api/borrowings", methods=["POST"])
def borrow_book():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT available_copies FROM books WHERE id = ?", (data["book_id"],))
    book = c.fetchone()
    if not book or book["available_copies"] < 1:
        conn.close()
        return jsonify({"error": "Book not available"}), 400
    due = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
    c.execute("INSERT INTO borrowings (book_id, member_id, due_date) VALUES (?,?,?)",
              (data["book_id"], data["member_id"], due))
    c.execute("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?", (data["book_id"],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Book borrowed", "due_date": due}), 201

@app.route("/api/borrowings/<int:borrow_id>/return", methods=["POST"])
def return_book(borrow_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM borrowings WHERE id = ? AND status = 'borrowed'", (borrow_id,))
    borrow = c.fetchone()
    if not borrow:
        conn.close()
        return jsonify({"error": "Borrowing record not found or already returned"}), 404
    today = datetime.now().strftime("%Y-%m-%d")
    c.execute("UPDATE borrowings SET return_date = ?, status = 'returned' WHERE id = ?", (today, borrow_id))
    c.execute("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?", (borrow["book_id"],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Book returned"})

# ─────────────────────────────────────────────
# STATS / DASHBOARD
# ─────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as total FROM books")
    total_books = c.fetchone()["total"]
    c.execute("SELECT SUM(available_copies) as avail FROM books")
    available = c.fetchone()["avail"] or 0
    c.execute("SELECT COUNT(*) as total FROM members WHERE active = 1")
    total_members = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM borrowings WHERE status = 'borrowed'")
    active_borrows = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM borrowings WHERE status = 'borrowed' AND due_date < date('now')")
    overdue = c.fetchone()["total"]
    c.execute("SELECT genre, COUNT(*) as cnt FROM books GROUP BY genre ORDER BY cnt DESC")
    genre_rows = [dict(row) for row in c.fetchall()]
    genre_distribution = {row["genre"]: row["cnt"] for row in genre_rows}
    conn.close()
    return jsonify({
        "total_books": total_books,
        "available_books": available,
        "borrowed_books": active_borrows,
        "total_members": total_members,
        "genre_distribution": genre_distribution
    })

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
