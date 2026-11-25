#!/usr/bin/env python3
"""
Runner script untuk Project UTS Pemrograman Web.
Menjalankan server backend Flask yang melayani REST API & frontend Bootstrap 5.
"""
import sys
import os

backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print("=" * 65)
    print("🚀 SERVER UTS PEMROGRAMAN WEB TELAH BERJALAN")
    print(f"👉 Akses Website di: http://localhost:{port}")
    print(f"   - Frontend Web : http://localhost:{port}")
    print(f"   - REST API Task: http://localhost:{port}/api/tasks")
    print(f"   - REST API Data: http://localhost:{port}/api/profile")
    print("=" * 65)
    app.run(host='0.0.0.0', port=port, debug=True)
