import os
from flask import Flask, jsonify, request, send_from_directory
from database import (
    init_db, 
    get_all_members, 
    get_member_by_id, 
    add_member, 
    update_member, 
    delete_member,
    reset_to_default
)

frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
app = Flask(__name__, static_folder=frontend_folder, static_url_path='')

# Initialize SQLite database
init_db()

# Enable CORS for frontend requests
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# Serve Frontend SPA
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

# REST API Endpoints for Members / Biodata
@app.route('/api/members', methods=['GET', 'POST', 'OPTIONS'])
def handle_members():
    if request.method == 'OPTIONS':
        return ('', 204)

    if request.method == 'GET':
        members = get_all_members()
        return jsonify({'status': 'success', 'data': members, 'count': len(members)})

    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form.to_dict()
        if not data:
            return jsonify({'status': 'error', 'message': 'Data tidak boleh kosong'}), 400

        name = data.get('name', '').strip()
        description = data.get('description', '').strip()

        if not name:
            return jsonify({'status': 'error', 'message': 'Nama anggota wajib diisi'}), 400
        if not description:
            return jsonify({'status': 'error', 'message': 'Deskripsi/tugas anggota wajib diisi'}), 400

        new_member = add_member(data)
        return jsonify({
            'status': 'success', 
            'message': 'Biodata berhasil ditambahkan.', 
            'data': new_member
        }), 201

@app.route('/api/members/<int:member_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def handle_member_detail(member_id):
    if request.method == 'OPTIONS':
        return ('', 204)

    if request.method == 'GET':
        member = get_member_by_id(member_id)
        if not member:
            return jsonify({'status': 'error', 'message': 'Biodata tidak ditemukan'}), 404
        return jsonify({'status': 'success', 'data': member})

    if request.method == 'PUT':
        data = request.get_json(silent=True) or request.form.to_dict()
        if not data:
            return jsonify({'status': 'error', 'message': 'Data perbaruan tidak boleh kosong'}), 400

        updated = update_member(member_id, data)
        if not updated:
            return jsonify({'status': 'error', 'message': 'Biodata tidak ditemukan'}), 404
        return jsonify({
            'status': 'success', 
            'message': 'Biodata berhasil diperbarui.', 
            'data': updated
        })

    if request.method == 'DELETE':
        success = delete_member(member_id)
        if not success:
            return jsonify({'status': 'error', 'message': 'Biodata tidak ditemukan'}), 404
        return jsonify({'status': 'success', 'message': 'Biodata berhasil dihapus.'})

@app.route('/api/members/reset', methods=['POST', 'OPTIONS'])
def handle_reset():
    if request.method == 'OPTIONS':
        return ('', 204)
    data = reset_to_default()
    return jsonify({
        'status': 'success', 
        'message': 'Biodata berhasil direset ke data awal.', 
        'data': data
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Server UTS Pem Web berjalan di http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
