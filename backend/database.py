import sqlite3
import os

DEFAULT_DB_PATH = os.path.join(os.path.dirname(__file__), 'uts_biodata.db')

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
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            nim TEXT NOT NULL,
            description TEXT NOT NULL,
            photo TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Pre-populate initial members if empty
    cursor.execute("SELECT COUNT(*) as count FROM members")
    if cursor.fetchone()['count'] == 0:
        cursor.execute("""
            INSERT INTO members (name, nim, description, photo)
            VALUES (?, ?, ?, ?)
        """, (
            'lalu revian firdaus',
            '24010110177',
            '24010110177 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup',
            'img/lalu.jpg'
        ))
        cursor.execute("""
            INSERT INTO members (name, nim, description, photo)
            VALUES (?, ?, ?, ?)
        """, (
            'muhammad ryan rizki',
            '24010110165',
            'dengan NIM 24010110165 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini',
            'img/ryan.jpg'
        ))
        conn.commit()

    conn.close()

def get_all_members(db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM members ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_member_by_id(member_id, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM members WHERE id = ?", (member_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def add_member(data, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO members (name, nim, description, photo, created_at)
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    """, (
        data.get('name', '').strip(),
        data.get('nim', '').strip(),
        data.get('description', '').strip(),
        data.get('photo', 'img/default-avatar.svg').strip() or 'img/default-avatar.svg',
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return get_member_by_id(new_id, db_path=db_path)

def update_member(member_id, data, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    current = get_member_by_id(member_id, db_path=db_path)
    if not current:
        conn.close()
        return None

    photo = data.get('photo', '').strip() or current['photo']

    cursor.execute("""
        UPDATE members 
        SET name = ?, nim = ?, description = ?, photo = ?
        WHERE id = ?
    """, (
        data.get('name', current['name']).strip(),
        data.get('nim', current['nim']).strip(),
        data.get('description', current['description']).strip(),
        photo,
        member_id
    ))
    conn.commit()
    conn.close()
    return get_member_by_id(member_id, db_path=db_path)

def delete_member(member_id, db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM members WHERE id = ?", (member_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def reset_to_default(db_path=None):
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM members")
    cursor.execute("""
        INSERT INTO members (name, nim, description, photo)
        VALUES (?, ?, ?, ?)
    """, (
        'lalu revian firdaus',
        '24010110177',
        '24010110177 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup',
        'img/lalu.jpg'
    ))
    cursor.execute("""
        INSERT INTO members (name, nim, description, photo)
        VALUES (?, ?, ?, ?)
    """, (
        'muhammad ryan rizki',
        '24010110165',
        'dengan NIM 24010110165 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini',
        'img/ryan.jpg'
    ))
    conn.commit()
    conn.close()
    return get_all_members(db_path=db_path)
