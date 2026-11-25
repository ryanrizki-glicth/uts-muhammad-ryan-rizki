import sqlite3
import os

DEFAULT_DB_PATH = os.path.join(os.path.dirname(__file__), 'uts.db')

def get_connection(db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            nim TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'Bootstrap',
            description TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Selesai',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Pre-populate initial submission if table is empty
    cursor.execute("SELECT COUNT(*) as count FROM tasks")
    if cursor.fetchone()['count'] == 0:
        cursor.execute("""
            INSERT INTO tasks (name, nim, title, category, description, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            'Muhammad Ryan Rizki Iswadi',
            '24010110165',
            'Desain Navbar Responsif Bootstrap 5',
            'Bootstrap',
            'Implementasi navbar responsif lengkap dengan brand UTS Pem Web, menu Home, Features, serta identitas Nama dan NIM.',
            'Selesai'
        ))
        cursor.execute("""
            INSERT INTO tasks (name, nim, title, category, description, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            'Muhammad Ryan Rizki Iswadi',
            '24010110165',
            'Integrasi REST API Flask & SQLite',
            'Backend',
            'Menghubungkan antarmuka frontend ke backend Python Flask untuk mencatat tugas dan riwayat UTS.',
            'Selesai'
        ))
        conn.commit()

    conn.close()

def get_all_tasks(search=None, category=None, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    query = "SELECT * FROM tasks WHERE 1=1"
    params = []

    if search:
        query += " AND (title LIKE ? OR description LIKE ? OR category LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard])

    if category and category != 'Semua':
        query += " AND category = ?"
        params.append(category)

    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_task(data, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tasks (name, nim, title, category, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
    """, (
        data.get('name', 'Muhammad Ryan Rizki Iswadi').strip(),
        data.get('nim', '24010110165').strip(),
        data.get('title', '').strip(),
        data.get('category', 'Bootstrap').strip(),
        data.get('description', '').strip(),
        data.get('status', 'Selesai').strip(),
    ))
    task_id = cursor.lastrowid
    conn.commit()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def toggle_task_status(task_id, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    
    current_status = row['status']
    new_status = 'Sedang Dikerjakan' if current_status == 'Selesai' else 'Selesai'
    cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
    conn.commit()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    updated = cursor.fetchone()
    conn.close()
    return dict(updated) if updated else None

def delete_task(task_id, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def get_stats(db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM tasks")
    total = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as completed FROM tasks WHERE status = 'Selesai'")
    completed = cursor.fetchone()['completed']

    cursor.execute("SELECT COUNT(*) as in_progress FROM tasks WHERE status = 'Sedang Dikerjakan'")
    in_progress = cursor.fetchone()['in_progress']

    cursor.execute("SELECT category, COUNT(*) as count FROM tasks GROUP BY category")
    by_category = {row['category']: row['count'] for row in cursor.fetchall()}
    conn.close()
    return {
        'total': total,
        'completed': completed,
        'in_progress': in_progress,
        'by_category': by_category,
        'mahasiswa': {
            'nama': 'Muhammad Ryan Rizki Iswadi',
            'nim': '24010110165',
            'mata_kuliah': 'Pemrograman Web (UTS)'
        }
    }
