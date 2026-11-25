import unittest
import tempfile
import os
import json
from app import app
from database import init_db

class TestUTSAPIs(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        app.config['TESTING'] = True
        self.client = app.test_client()

        import database
        self.original_db = database.DEFAULT_DB_PATH
        database.DEFAULT_DB_PATH = self.db_path
        init_db(self.db_path)

    def tearDown(self):
        import database
        database.DEFAULT_DB_PATH = self.original_db
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_profile_endpoint(self):
        res = self.client.get('/api/profile')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['data']['nim'], '24010110165')
        self.assertIn('Muhammad Ryan Rizki Iswadi', data['data']['nama'])

    def test_task_crud_and_status(self):
        # 1. List tasks
        res = self.client.get('/api/tasks')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertGreaterEqual(data['count'], 2)

        # 2. Add new task
        payload = {
            "name": "Muhammad Ryan Rizki Iswadi",
            "nim": "24010110165",
            "title": "Tugas Testing",
            "category": "Testing",
            "description": "Menjalankan unit test untuk backend Flask",
            "status": "Sedang Dikerjakan"
        }
        res = self.client.post('/api/tasks', json=payload)
        self.assertEqual(res.status_code, 201)
        created = json.loads(res.data)['data']
        task_id = created['id']
        self.assertEqual(created['status'], 'Sedang Dikerjakan')

        # 3. Toggle status
        res = self.client.put(f'/api/tasks/{task_id}/toggle-status')
        self.assertEqual(res.status_code, 200)
        updated = json.loads(res.data)['data']
        self.assertEqual(updated['status'], 'Selesai')

        # 4. Check stats
        res = self.client.get('/api/stats')
        self.assertEqual(res.status_code, 200)
        stats = json.loads(res.data)['data']
        self.assertGreaterEqual(stats['total'], 3)

        # 5. Export CSV
        res = self.client.get('/api/tasks/export/csv')
        self.assertEqual(res.status_code, 200)
        self.assertIn('text/csv', res.headers.get('Content-Type', ''))

        # 6. Delete task
        res = self.client.delete(f'/api/tasks/{task_id}')
        self.assertEqual(res.status_code, 200)

if __name__ == '__main__':
    unittest.main()
