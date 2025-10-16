import sqlite3
import os
from datetime import datetime

DB_FILE = 'portfolio.db'


def get_connection():
    """Helper to get a database connection safely."""
    os.makedirs(os.path.dirname(DB_FILE) or ".", exist_ok=True)
    return sqlite3.connect(DB_FILE)


def init_db():
    """Initialize the database with tables and sample data."""
    print("Initializing database...")

    with get_connection() as conn:
        cursor = conn.cursor()

        # Drop old tables for a clean setup
        cursor.execute('DROP TABLE IF EXISTS projects')
        cursor.execute('DROP TABLE IF EXISTS feedback')

        print("Creating tables...")

        # Projects table
        cursor.execute('''
            CREATE TABLE projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL,
                overview TEXT NOT NULL,
                link TEXT,
                image TEXT NOT NULL,
                game_folder TEXT NOT NULL,
                build_name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Feedback table – aligns perfectly with your app.py POST fields
        cursor.execute('''
            CREATE TABLE feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                contact_type TEXT NOT NULL,
                comment TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        print("Tables created successfully!")

        # Insert one demo project
        sample_projects = [
            (
                'Sky Surfers',
                'games',
                'A thrilling aerial adventure game where players navigate through stunning sky landscapes, dodging obstacles and collecting power-ups. Built with Unity and C# for immersive 3D gameplay with dynamic weather systems and challenging levels.',
                'Navigate through stunning aerial landscapes in this fast-paced action game',
                None,
                '/static/games/sky_surfers/cover.jpg',
                'sky_surfers',
                'sky_surfers'
            ),
        ]

        cursor.executemany('''
            INSERT INTO projects (name, category, description, overview, link, image, game_folder, build_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_projects)

        conn.commit()
        print(f"Inserted {len(sample_projects)} sample project(s).")

    print("✅ Database initialized successfully!")


def add_project(name, category, description, overview, image, game_folder, build_name, link=None):
    """Add a new project to the database."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO projects (name, category, description, overview, link, image, game_folder, build_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, category, description, overview, link, image, game_folder, build_name))
        conn.commit()
        project_id = cursor.lastrowid
    print(f"✅ Project '{name}' added successfully (ID: {project_id})")
    return project_id


def add_feedback(full_name, email, phone, contact_type, comment):
    """Add a new feedback record to the database (for internal or future API use)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO feedback (full_name, email, phone, contact_type, comment)
            VALUES (?, ?, ?, ?, ?)
        ''', (full_name, email, phone, contact_type, comment))
        conn.commit()
        feedback_id = cursor.lastrowid
    print(f"💬 Feedback added successfully (ID: {feedback_id})")
    return feedback_id


def delete_project(project_id):
    """Delete a project by ID."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
        conn.commit()
        deleted = cursor.rowcount
    print("🗑️ Deleted project" if deleted else "⚠️ Project not found", project_id)
    return deleted > 0


def get_all_projects():
    """Retrieve all projects sorted by creation date."""
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects ORDER BY created_at DESC')
        projects = [dict(row) for row in cursor.fetchall()]
    return projects


def get_project_by_id(project_id):
    """Fetch a single project by ID."""
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        project = cursor.fetchone()
    return dict(project) if project else None


def get_all_feedback():
    """Retrieve all feedback entries sorted by timestamp."""
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM feedback ORDER BY timestamp DESC')
        feedbacks = [dict(row) for row in cursor.fetchall()]
    return feedbacks


if __name__ == '__main__':
    init_db()
