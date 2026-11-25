import os
import io
import csv
from flask import Flask, jsonify, request, send_from_directory, Response
from database import init_db, get_all_tasks, add_task, delete_task, toggle_task_status, get_stats

frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
app = Flask(__name__, static_folder=frontend_folder, static_url_path='')

# Initialize SQLite database
init_db()

# Enable CORS
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# Serve Frontend
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

# REST API Endpoints
@app.route('/api/profile', methods=['GET'])
def profile():
    return jsonify({
        'status': 'success',
        'data': {
            'nama': 'Muhammad Ryan Rizki Iswadi',
            'nim': '24010110165',
            'mata_kuliah': 'Pemrograman Web',
            'judul_uts': 'UTS Pem Web - Navbar Bootstrap 5 & Backend API'
        }
    })

@app.route('/api/tasks', methods=['GET', 'POST', 'OPTIONS'])
def handle_tasks():
    if request.method == 'OPTIONS':
        return ('', 204)

    if request.method == 'GET':
        search = request.args.get('search', '').strip()
        category = request.args.get('category', '').strip()
        tasks = get_all_tasks(search=search if search else None, category=category if category else None)
        return jsonify({'status': 'success', 'data': tasks, 'count': len(tasks)})

    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form.to_dict()
        if not data:
            return jsonify({'status': 'error', 'message': 'Data tugas tidak boleh kosong'}), 400

        title = data.get('title', '').strip()
        description = data.get('description', '').strip()

        if not title:
            return jsonify({'status': 'error', 'message': 'Judul tugas wajib diisi'}), 400
        if not description:
            return jsonify({'status': 'error', 'message': 'Deskripsi tugas wajib diisi'}), 400

        new_task = add_task(data)
        return jsonify({'status': 'success', 'message': 'Tugas UTS berhasil disimpan', 'data': new_task}), 201

@app.route('/api/tasks/<int:task_id>/toggle-status', methods=['PUT', 'OPTIONS'])
def handle_toggle_status(task_id):
    if request.method == 'OPTIONS':
        return ('', 204)
    updated = toggle_task_status(task_id)
    if not updated:
        return jsonify({'status': 'error', 'message': 'Tugas tidak ditemukan'}), 404
    return jsonify({'status': 'success', 'message': 'Status berhasil diperbarui', 'data': updated})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE', 'OPTIONS'])
def handle_task_delete(task_id):
    if request.method == 'OPTIONS':
        return ('', 204)
    success = delete_task(task_id)
    if not success:
        return jsonify({'status': 'error', 'message': 'Data tugas tidak ditemukan'}), 404
    return jsonify({'status': 'success', 'message': 'Tugas berhasil dihapus'})

@app.route('/api/stats', methods=['GET'])
def handle_stats():
    stats = get_stats()
    return jsonify({'status': 'success', 'data': stats})

@app.route('/api/tasks/export/csv', methods=['GET'])
def export_tasks_csv():
    tasks = get_all_tasks()
    si = io.StringIO()
    writer = csv.writer(si)
    writer.writerow(['ID', 'Nama Mahasiswa', 'NIM', 'Judul Tugas', 'Kategori', 'Deskripsi', 'Status', 'Waktu Dibuat'])
    for t in tasks:
        writer.writerow([
            t['id'],
            t['name'],
            t['nim'],
            t['title'],
            t['category'],
            t['description'],
            t['status'],
            t['created_at']
        ])
    output = si.getvalue()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=rekap_tugas_uts.csv"}
    )

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Server UTS Pem Web berjalan di http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
