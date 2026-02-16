import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────
const API = "http://localhost:5000/api";

// ─── MOCK DATA (for standalone prototype demo) ──────────────
const MOCK = {
  stats: {
    total_books: 8, available_books: 19, total_members: 4,
    active_borrowings: 1, overdue: 0,
    genres: [
      { genre: "Fiction", cnt: 2 }, { genre: "Technology", cnt: 2 },
      { genre: "Sci-Fi", cnt: 1 }, { genre: "History", cnt: 1 },
      { genre: "Self-Help", cnt: 1 }, { genre: "Dystopian", cnt: 1 },
    ]
  },
  books: [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-7432-7356-5", genre: "Fiction", year: 1925, total_copies: 3, available_copies: 2, description: "A story of the Jazz Age" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", genre: "Fiction", year: 1960, total_copies: 2, available_copies: 1, description: "A tale of racial injustice" },
    { id: 3, title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", genre: "Dystopian", year: 1949, total_copies: 4, available_copies: 4, description: "A dystopian novel" },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", genre: "Technology", year: 2008, total_copies: 2, available_copies: 2, description: "A handbook of agile software craftsmanship" },
    { id: 5, title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0-13-595705-9", genre: "Technology", year: 1999, total_copies: 3, available_copies: 3, description: "Your journey to mastery" },
    { id: 6, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0-06-231609-7", genre: "History", year: 2011, total_copies: 2, available_copies: 2, description: "A Brief History of Humankind" },
    { id: 7, title: "Dune", author: "Frank Herbert", isbn: "978-0-441-17271-9", genre: "Sci-Fi", year: 1965, total_copies: 1, available_copies: 0, description: "Epic science fiction saga" },
    { id: 8, title: "Atomic Habits", author: "James Clear", isbn: "978-0-73-521129-2", genre: "Self-Help", year: 2018, total_copies: 5, available_copies: 5, description: "Tiny changes, remarkable results" },
  ],
  members: [
    { id: 1, name: "Alice Johnson", email: "alice@email.com", phone: "555-0101", membership_type: "premium", join_date: "2024-01-15", active: 1 },
    { id: 2, name: "Bob Smith", email: "bob@email.com", phone: "555-0102", membership_type: "standard", join_date: "2024-02-20", active: 1 },
    { id: 3, name: "Carol White", email: "carol@email.com", phone: "555-0103", membership_type: "standard", join_date: "2024-03-05", active: 1 },
    { id: 4, name: "David Brown", email: "david@email.com", phone: "555-0104", membership_type: "premium", join_date: "2024-04-10", active: 1 },
  ],
  borrowings: [
    { id: 1, book_id: 7, member_id: 1, book_title: "Dune", book_author: "Frank Herbert", member_name: "Alice Johnson", member_email: "alice@email.com", borrow_date: "2026-02-01", due_date: "2026-02-15", return_date: null, status: "borrowed" },
  ]
};

// ─── STYLES ────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0f0e17;
    color: #fffffe;
    min-height: 100vh;
  }

  :root {
    --bg: #0f0e17;
    --surface: #1a1828;
    --surface2: #252336;
    --accent: #e8c468;
    --accent2: #a78bfa;
    --red: #ff6b6b;
    --green: #6bffb8;
    --text: #fffffe;
    --muted: #a7a5b8;
    --border: #2e2c42;
  }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
  }

  .sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1.2;
  }

  .sidebar-logo span {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--muted);
    transition: all 0.2s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent); color: #0f0e17; font-weight: 600; }

  .nav-icon { font-size: 1.1rem; }

  /* MAIN */
  .main {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
    min-width: 0;
  }

  .page-header {
    margin-bottom: 28px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.1;
  }

  .page-subtitle {
    font-size: 0.875rem;
    color: var(--muted);
    margin-top: 4px;
  }

  /* CARDS */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .stat-card:hover { transform: translateY(-2px); }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--card-color, var(--accent));
  }

  .stat-icon { font-size: 1.6rem; margin-bottom: 12px; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--text); font-family: 'Playfair Display', serif; }
  .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }

  /* TABLE */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .card-title { font-size: 1rem; font-weight: 600; color: var(--text); }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 12px 16px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
  }

  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface2); }
  tbody td { padding: 14px 16px; font-size: 0.875rem; color: var(--text); }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .badge-green { background: rgba(107,255,184,0.15); color: var(--green); }
  .badge-red { background: rgba(255,107,107,0.15); color: var(--red); }
  .badge-yellow { background: rgba(232,196,104,0.15); color: var(--accent); }
  .badge-purple { background: rgba(167,139,250,0.15); color: var(--accent2); }
  .badge-gray { background: rgba(167,165,184,0.15); color: var(--muted); }

  /* BUTTONS */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 10px;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-primary { background: var(--accent); color: #0f0e17; }
  .btn-primary:hover { background: #f0ce78; transform: translateY(-1px); }
  .btn-danger { background: rgba(255,107,107,0.15); color: var(--red); border: 1px solid rgba(255,107,107,0.3); }
  .btn-danger:hover { background: rgba(255,107,107,0.25); }
  .btn-success { background: rgba(107,255,184,0.15); color: var(--green); border: 1px solid rgba(107,255,184,0.3); }
  .btn-success:hover { background: rgba(107,255,184,0.25); }
  .btn-ghost { background: var(--surface2); color: var(--muted); }
  .btn-ghost:hover { color: var(--text); }
  .btn-sm { padding: 5px 12px; font-size: 0.78rem; }

  /* SEARCH + FILTER */
  .search-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 9px 14px;
    color: var(--text);
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--muted); }
  .input-sm { padding: 6px 12px; font-size: 0.8rem; }

  select.input { cursor: pointer; }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text);
  }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .input-full { width: 100%; }

  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* GENRE CHART */
  .genre-bars { display: flex; flex-direction: column; gap: 10px; padding: 20px 24px; }
  .genre-row { display: flex; align-items: center; gap: 12px; }
  .genre-label { font-size: 0.8rem; color: var(--muted); width: 90px; flex-shrink: 0; }
  .genre-bar-track { flex: 1; background: var(--surface2); border-radius: 4px; height: 8px; overflow: hidden; }
  .genre-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.8s cubic-bezier(.23,1,.32,1); }
  .genre-count { font-size: 0.78rem; color: var(--text); font-weight: 600; width: 20px; text-align: right; }

  /* AVAILABILITY DOT */
  .avail-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
  .avail-dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .avail-dot.red { background: var(--red); box-shadow: 0 0 6px var(--red); }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 0.875rem;
    color: var(--text);
    z-index: 999;
    animation: slideUp 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 320px;
  }

  .toast.success { border-color: var(--green); }
  .toast.error { border-color: var(--red); }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.5; }

  /* DASHBOARD GRID */
  .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
  @media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }

  .section-title { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 14px; }
`;

// ─── TOAST ─────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? "✓" : "✗"} {msg}
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ─────────────────────────────────────────
function Dashboard({ data, books, members, borrowings }) {
  const stats = data;
  const statCards = [
    { icon: "📚", label: "Total Books", value: stats.total_books, color: "#e8c468" },
    { icon: "✅", label: "Available", value: stats.available_books, color: "#6bffb8" },
    { icon: "👥", label: "Members", value: stats.total_members, color: "#a78bfa" },
    { icon: "📖", label: "Borrowed", value: stats.active_borrowings, color: "#fb923c" },
    { icon: "⚠️", label: "Overdue", value: stats.overdue, color: "#ff6b6b" },
  ];

  const maxGenre = Math.max(...stats.genres.map(g => g.cnt), 1);

  const recent = borrowings.slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Library overview at a glance</p>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label} style={{ "--card-color": s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Genre Distribution</span></div>
          <div className="genre-bars">
            {stats.genres.map(g => (
              <div className="genre-row" key={g.genre}>
                <span className="genre-label">{g.genre}</span>
                <div className="genre-bar-track">
                  <div className="genre-bar-fill" style={{ width: `${(g.cnt / maxGenre) * 100}%` }} />
                </div>
                <span className="genre-count">{g.cnt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Recent Borrowings</span></div>
          {recent.length === 0 ? (
            <div className="empty"><div className="empty-icon">📭</div><p>No borrowings yet</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Book</th><th>Member</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recent.map(b => (
                  <tr key={b.id}>
                    <td style={{ maxWidth: 150 }}>
                      <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.book_title}</div>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{b.member_name}</td>
                    <td>
                      <span className={`badge ${b.status === "borrowed" ? "badge-yellow" : "badge-green"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BOOKS PAGE ─────────────────────────────────────────────
function BooksPage({ books, setBooks, toast }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editBook, setEditBook] = useState(null);

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn || "").includes(q);
    const matchG = !genre || b.genre === genre;
    return matchQ && matchG;
  });

  function handleDelete(id) {
    if (!confirm("Delete this book?")) return;
    setBooks(prev => prev.filter(b => b.id !== id));
    toast("Book deleted", "success");
  }

  function handleSave(book) {
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === editBook.id ? { ...b, ...book } : b));
      toast("Book updated", "success");
    } else {
      const newBook = { ...book, id: Date.now(), available_copies: book.total_copies };
      setBooks(prev => [...prev, newBook]);
      toast("Book added", "success");
    }
    setShowAdd(false);
    setEditBook(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Books</h1>
          <p className="page-subtitle">{books.length} books in collection</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Book</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <input className="input" placeholder="Search title, author, ISBN…" value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 220 }} />
            <select className="input" value={genre} onChange={e => setGenre(e.target.value)}>
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📚</div><p>No books found</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Title</th><th>Author</th><th>Genre</th><th>Year</th><th>Copies</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.title}</div>
                      {b.isbn && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>ISBN: {b.isbn}</div>}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{b.author}</td>
                    <td><span className="badge badge-purple">{b.genre}</span></td>
                    <td style={{ color: "var(--muted)" }}>{b.year}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{b.available_copies}</span>
                      <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>/{b.total_copies}</span>
                    </td>
                    <td>
                      <span className={`badge ${b.available_copies > 0 ? "badge-green" : "badge-red"}`}>
                        <span className={`avail-dot ${b.available_copies > 0 ? "green" : "red"}`} />
                        {b.available_copies > 0 ? "Available" : "Out"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditBook(b); setShowAdd(true); }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showAdd || editBook) && (
        <BookModal
          book={editBook}
          onClose={() => { setShowAdd(false); setEditBook(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function BookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({
    title: book?.title || "", author: book?.author || "", isbn: book?.isbn || "",
    genre: book?.genre || "", year: book?.year || "", total_copies: book?.total_copies || 1,
    description: book?.description || ""
  });

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  return (
    <Modal title={book ? "Edit Book" : "Add New Book"} onClose={onClose}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="input input-full" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Author *</label>
          <input className="input input-full" value={form.author} onChange={e => set("author", e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input className="input input-full" value={form.isbn} onChange={e => set("isbn", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Genre</label>
          <input className="input input-full" value={form.genre} onChange={e => set("genre", e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input className="input input-full" type="number" value={form.year} onChange={e => set("year", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Total Copies</label>
          <input className="input input-full" type="number" min="1" value={form.total_copies} onChange={e => set("total_copies", parseInt(e.target.value))} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="input input-full" rows={3} style={{ resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => form.title && form.author && onSave(form)}>
          {book ? "Update Book" : "Add Book"}
        </button>
      </div>
    </Modal>
  );
}

// ─── MEMBERS PAGE ───────────────────────────────────────────
function MembersPage({ members, setMembers, toast }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  function handleDelete(id) {
    if (!confirm("Remove this member?")) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    toast("Member removed", "success");
  }

  function handleSave(data) {
    const nm = { ...data, id: Date.now(), join_date: new Date().toISOString().split("T")[0], active: 1 };
    setMembers(prev => [...prev, nm]);
    toast("Member added", "success");
    setShowAdd(false);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">{members.length} registered members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Member</button>
      </div>

      <div className="card">
        <div className="card-header">
          <input className="input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 240 }} />
        </div>
        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">👥</div><p>No members found</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Membership</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: `hsl(${m.name.charCodeAt(0) * 17 % 360}, 60%, 45%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.85rem", flexShrink: 0
                      }}>
                        {m.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)" }}>{m.email}</td>
                  <td style={{ color: "var(--muted)" }}>{m.phone}</td>
                  <td>
                    <span className={`badge ${m.membership_type === "premium" ? "badge-yellow" : "badge-gray"}`}>
                      {m.membership_type}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{m.join_date?.split("T")[0]}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <MemberModal onClose={() => setShowAdd(false)} onSave={handleSave} />
      )}
    </div>
  );
}

function MemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", membership_type: "standard" });
  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <Modal title="Add Member" onClose={onClose}>
      <div className="form-group"><label className="form-label">Full Name *</label><input className="input input-full" value={form.name} onChange={e => set("name", e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Email *</label><input className="input input-full" type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Phone</label><input className="input input-full" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">Membership</label>
          <select className="input input-full" value={form.membership_type} onChange={e => set("membership_type", e.target.value)}>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => form.name && form.email && onSave(form)}>Add Member</button>
      </div>
    </Modal>
  );
}

// ─── BORROWINGS PAGE ────────────────────────────────────────
function BorrowingsPage({ borrowings, setBorrowings, books, setBooks, members, toast }) {
  const [showIssue, setShowIssue] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = borrowings.filter(b => filter === "all" || b.status === filter);

  function handleReturn(b) {
    setBorrowings(prev => prev.map(x => x.id === b.id
      ? { ...x, status: "returned", return_date: new Date().toISOString().split("T")[0] }
      : x
    ));
    setBooks(prev => prev.map(bk => bk.id === b.book_id
      ? { ...bk, available_copies: bk.available_copies + 1 }
      : bk
    ));
    toast("Book returned successfully", "success");
  }

  function handleIssue(data) {
    const book = books.find(b => b.id === data.book_id);
    const member = members.find(m => m.id === data.member_id);
    if (!book || book.available_copies < 1) { toast("Book not available", "error"); return; }
    const due = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    const nb = {
      id: Date.now(), book_id: book.id, member_id: member.id,
      book_title: book.title, book_author: book.author,
      member_name: member.name, member_email: member.email,
      borrow_date: new Date().toISOString().split("T")[0],
      due_date: due, return_date: null, status: "borrowed"
    };
    setBorrowings(prev => [nb, ...prev]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, available_copies: b.available_copies - 1 } : b));
    toast(`Issued "${book.title}" to ${member.name}. Due: ${due}`, "success");
    setShowIssue(false);
  }

  const isOverdue = (b) => b.status === "borrowed" && new Date(b.due_date) < new Date();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrowings</h1>
          <p className="page-subtitle">Issue and track book loans</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowIssue(true)}>+ Issue Book</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            {["all", "borrowed", "returned"].map(s => (
              <button key={s} className={`btn ${filter === s ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div><p>No borrowing records</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Book</th><th>Member</th><th>Borrowed</th><th>Due</th><th>Returned</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const overdue = isOverdue(b);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.book_title}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{b.book_author}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.member_name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{b.member_email}</div>
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{b.borrow_date}</td>
                      <td style={{ fontSize: "0.8rem", color: overdue ? "var(--red)" : "var(--muted)", fontWeight: overdue ? 600 : 400 }}>
                        {b.due_date} {overdue && "⚠️"}
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{b.return_date || "—"}</td>
                      <td>
                        <span className={`badge ${overdue ? "badge-red" : b.status === "borrowed" ? "badge-yellow" : "badge-green"}`}>
                          {overdue ? "Overdue" : b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === "borrowed" && (
                          <button className="btn btn-success btn-sm" onClick={() => handleReturn(b)}>Return</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showIssue && (
        <IssueModal
          books={books.filter(b => b.available_copies > 0)}
          members={members}
          onClose={() => setShowIssue(false)}
          onSave={handleIssue}
        />
      )}
    </div>
  );
}

function IssueModal({ books, members, onClose, onSave }) {
  const [form, setForm] = useState({ book_id: "", member_id: "" });
  return (
    <Modal title="Issue Book" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Select Book *</label>
        <select className="input input-full" value={form.book_id} onChange={e => setForm(p => ({ ...p, book_id: parseInt(e.target.value) }))}>
          <option value="">-- Choose available book --</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Select Member *</label>
        <select className="input input-full" value={form.member_id} onChange={e => setForm(p => ({ ...p, member_id: parseInt(e.target.value) }))}>
          <option value="">-- Choose member --</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
        </select>
      </div>
      <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", color: "var(--muted)", marginBottom: 8 }}>
        📅 Due date will be automatically set to <strong style={{ color: "var(--accent)" }}>14 days</strong> from today.
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!form.book_id || !form.member_id} onClick={() => onSave(form)}>Issue Book</button>
      </div>
    </Modal>
  );
}

// ─── APP ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [books, setBooks] = useState(MOCK.books);
  const [members, setMembers] = useState(MOCK.members);
  const [borrowings, setBorrowings] = useState(MOCK.borrowings);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback((msg, type = "success") => {
    setToastMsg({ msg, type, key: Date.now() });
  }, []);

  const stats = {
    total_books: books.length,
    available_books: books.reduce((s, b) => s + b.available_copies, 0),
    total_members: members.filter(m => m.active).length,
    active_borrowings: borrowings.filter(b => b.status === "borrowed").length,
    overdue: borrowings.filter(b => b.status === "borrowed" && new Date(b.due_date) < new Date()).length,
    genres: Object.entries(
      books.reduce((acc, b) => { if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {})
    ).map(([genre, cnt]) => ({ genre, cnt })).sort((a, b) => b.cnt - a.cnt)
  };

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "books", icon: "📚", label: "Books" },
    { id: "members", icon: "👥", label: "Members" },
    { id: "borrowings", icon: "📋", label: "Borrowings" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-logo">
            <h1>Libris</h1>
            <span>Digital Library System</span>
          </div>
          <div className="sidebar-nav">
            {navItems.map(n => (
              <button
                key={n.id}
                className={`nav-item ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.id === "borrowings" && stats.overdue > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--red)", color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: "0.7rem", fontWeight: 700 }}>
                    {stats.overdue}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--muted)" }}>
            <div style={{ marginBottom: 4 }}>📡 Demo Mode</div>
            <div>Connect Flask backend at port 5000</div>
          </div>
        </nav>

        <main className="main">
          {page === "dashboard" && <Dashboard data={stats} books={books} members={members} borrowings={borrowings} />}
          {page === "books" && <BooksPage books={books} setBooks={setBooks} toast={toast} />}
          {page === "members" && <MembersPage members={members} setMembers={setMembers} toast={toast} />}
          {page === "borrowings" && (
            <BorrowingsPage
              borrowings={borrowings} setBorrowings={setBorrowings}
              books={books} setBooks={setBooks}
              members={members} toast={toast}
            />
          )}
        </main>
      </div>

      {toastMsg && (
        <Toast key={toastMsg.key} msg={toastMsg.msg} type={toastMsg.type} onDone={() => setToastMsg(null)} />
      )}
    </>
  );
}
