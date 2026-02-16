#!/usr/bin/env python3
"""
Digital Library Management System - Setup Verification Script
Checks all components are running correctly
"""

import os
import sys
import sqlite3
from pathlib import Path

def check_environment():
    """Verify Python environment"""
    print("=" * 60)
    print("📚 Digital Library Management System - Setup Check")
    print("=" * 60)
    print()
    
    # Python version
    print(f"✓ Python Version: {sys.version.split()[0]}")
    
    # Current directory
    project_dir = Path(__file__).parent
    print(f"✓ Project Directory: {project_dir}")
    print()

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking Dependencies...")
    print("-" * 60)
    
    dependencies = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'sqlite3': 'SQLite3'
    }
    
    all_ok = True
    for module, name in dependencies.items():
        try:
            __import__(module)
            print(f"  ✓ {name}")
        except ImportError:
            print(f"  ✗ {name} - NOT INSTALLED")
            all_ok = False
    
    print()
    return all_ok

def check_database():
    """Check SQLite database"""
    print("🗄️  Checking Database...")
    print("-" * 60)
    
    db_path = Path(__file__).parent / "library.db"
    
    if db_path.exists():
        print(f"  ✓ Database exists: {db_path}")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            table_names = [t[0] for t in tables]
            
            expected_tables = ['books', 'members', 'borrowings']
            for table in expected_tables:
                if table in table_names:
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    print(f"  ✓ Table '{table}': {count} records")
                else:
                    print(f"  ✗ Table '{table}' missing")
            
            conn.close()
        except Exception as e:
            print(f"  ✗ Database error: {e}")
            return False
    else:
        print(f"  ⚠ Database not found: {db_path}")
        print(f"    (Will be created on first Flask run)")
    
    print()
    return True

def check_files():
    """Check project files"""
    print("📄 Checking Project Files...")
    print("-" * 60)
    
    required_files = {
        'app.py': 'Flask Application',
        'index.html': 'React Frontend',
        'requirements.txt': 'Dependencies List',
        'DOCUMENTATION.md': 'Full Documentation',
        'QUICKSTART.md': 'Quick Start Guide'
    }
    
    project_dir = Path(__file__).parent
    all_ok = True
    
    for filename, description in required_files.items():
        file_path = project_dir / filename
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"  ✓ {description}: {filename} ({size:,} bytes)")
        else:
            print(f"  ✗ {description}: {filename} NOT FOUND")
            all_ok = False
    
    print()
    return all_ok

def check_ports():
    """Advise on port usage"""
    print("🔌 Port Information...")
    print("-" * 60)
    print("  Frontend & Backend: http://localhost:5000")
    print("  API Base URL: http://localhost:5000/api")
    print()
    print("  To check if port 5000 is in use:")
    print("    netstat -ano | findstr :5000")
    print()

def print_startup_instructions():
    """Print startup instructions"""
    print("=" * 60)
    print("🚀 STARTUP INSTRUCTIONS")
    print("=" * 60)
    print()
    print("1. Install dependencies (if not done):")
    print("   pip install -r requirements.txt")
    print()
    print("2. Start the Flask server:")
    print("   python app.py")
    print()
    print("3. Open in browser:")
    print("   http://localhost:5000")
    print()
    print("=" * 60)
    print()

def print_features():
    """Print available features"""
    print("✨ FEATURES AVAILABLE")
    print("-" * 60)
    print()
    print("📊 Dashboard")
    print("  • Library statistics (books, members, borrowings)")
    print("  • Genre distribution chart")
    print("  • Recent activity")
    print()
    print("📕 Books Management")
    print("  • View all books with details")
    print("  • Search by title, author, ISBN")
    print("  • Filter by genre")
    print("  • Add new books")
    print("  • Delete books")
    print("  • Track availability")
    print()
    print("👥 Members Management")
    print("  • Register new members")
    print("  • Search members by name/email")
    print("  • Delete members")
    print("  • Standard & Premium memberships")
    print()
    print("📋 Borrowings System")
    print("  • Issue books to members")
    print("  • Return books")
    print("  • Track due dates")
    print("  • Identify overdue items")
    print("  • Filter by status (All, Borrowed, Returned)")
    print()
    print("=" * 60)
    print()

def print_endpoints():
    """Print API endpoints"""
    print("📡 API ENDPOINTS")
    print("-" * 60)
    print()
    print("Books:")
    print("  GET    /api/books              - List all books")
    print("  GET    /api/books/<id>         - Get single book")
    print("  POST   /api/books              - Add new book")
    print("  PUT    /api/books/<id>         - Update book")
    print("  DELETE /api/books/<id>         - Delete book")
    print()
    print("Members:")
    print("  GET    /api/members            - List all members")
    print("  POST   /api/members            - Add new member")
    print("  DELETE /api/members/<id>       - Delete member")
    print()
    print("Borrowings:")
    print("  GET    /api/borrowings         - List all borrowings")
    print("  POST   /api/borrowings         - Issue book")
    print("  POST   /api/borrowings/<id>/return - Return book")
    print()
    print("Stats:")
    print("  GET    /api/stats              - Dashboard statistics")
    print()
    print("=" * 60)
    print()

def main():
    """Run all checks"""
    print()
    
    check_environment()
    deps_ok = check_dependencies()
    db_ok = check_database()
    files_ok = check_files()
    check_ports()
    
    print_startup_instructions()
    print_features()
    print_endpoints()
    
    print("📝 SUMMARY")
    print("-" * 60)
    if deps_ok and db_ok and files_ok:
        print("✅ All checks passed! System is ready to run.")
        print()
        print("Next steps:")
        print("  1. Make sure dependencies are installed:")
        print("     pip install -r requirements.txt")
        print("  2. Run Flask:")
        print("     python app.py")
        print("  3. Open browser:")
        print("     http://localhost:5000")
    else:
        print("⚠️  Some checks failed. Please review above.")
        if not deps_ok:
            print("   • Install missing dependencies")
        if not db_ok:
            print("   • Database will be created on first run")
        if not files_ok:
            print("   • Ensure all files are in project directory")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    main()
