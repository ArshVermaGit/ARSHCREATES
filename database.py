import sqlite3
import os

# ==================================================
# DATABASE INITIALIZATION SECTION
# ==================================================
def init_db():
    """Initialize the database with tables and sample data"""
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()

    cursor.execute('DROP TABLE IF EXISTS projects')
    cursor.execute('DROP TABLE IF EXISTS feedback')
    print("Creating tables...")

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

    cursor.execute('''
        CREATE TABLE feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            contact_type TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    print("Tables created successfully!")

    sample_projects = [
        (
            'Sky Surfers',
            'games',
            'A thrilling aerial adventure game with dynamic weather systems and challenging levels.',
            'Navigate through stunning aerial landscapes in this fast-paced action game',
            None,
            '/static/games/sky_surfers/cover.jpg',
            'sky_surfers',
            'sky_surfers'
        ),
    ]
    print("Inserting sample projects...")
    cursor.executemany('''
        INSERT INTO projects (name, category, description, overview, link, image, game_folder, build_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_projects)
    conn.commit()
    print(f"Inserted {len(sample_projects)} project(s) successfully!")
    conn.close()
    print("Database initialized successfully!")

# ==================================================
# PROJECT MANAGEMENT SECTION
# ==================================================
def add_project(name, category, description, overview, image, game_folder, build_name, link=None):
    """Add a new project to the database"""
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO projects (name, category, description, overview, link, image, game_folder, build_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, category, description, overview, link, image, game_folder, build_name))
    conn.commit()
    project_id = cursor.lastrowid
    conn.close()
    print(f"Project '{name}' added successfully with ID: {project_id}")
    return project_id

def delete_project(project_id):
    """Delete a project from the database"""
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted:
        print(f"Project with ID {project_id} deleted successfully!")
    else:
        print(f"No project found with ID {project_id}")
    return deleted > 0

def get_all_projects():
    """Retrieve all projects from the database"""
    conn = sqlite3.connect('portfolio.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM projects ORDER BY created_at DESC')
    projects = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return projects

def get_project_by_id(project_id):
    """Retrieve a specific project by ID"""
    conn = sqlite3.connect('portfolio.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
    project = cursor.fetchone()
    conn.close()
    return dict(project) if project else None

# ==================================================
# MAIN EXECUTION SECTION
# ==================================================
if __name__ == '__main__':
    init_db()