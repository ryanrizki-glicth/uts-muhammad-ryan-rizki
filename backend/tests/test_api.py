import unittest
import tempfile
import os
import json
from app import app
from database import init_db

class TestMemberAPIs(unittest.TestCase):
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

    def test_member_crud(self):
        # 1. List members (initial 2 members)
        res = self.client.get('/api/members')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['count'], 2)
        self.assertEqual(data['data'][0]['name'], 'lalu revian firdaus')
        self.assertEqual(data['data'][1]['name'], 'muhammad ryan rizki')

        # 2. Add member
        payload = {
            "name": "Budi Santoso",
            "nim": "24010110999",
            "description": "dengan NIM 24010110999 merupakan dokumentasi dan testing pada UTS ini",
            "photo": "img/default-avatar.svg"
        }
        res = self.client.post('/api/members', json=payload)
        self.assertEqual(res.status_code, 201)
        created = json.loads(res.data)['data']
        member_id = created['id']

        # 3. Update member
        update_payload = {
            "name": "Budi Santoso Edit",
            "nim": "24010110999",
            "description": "Update deskripsi tugas"
        }
        res = self.client.put(f'/api/members/{member_id}', json=update_payload)
        self.assertEqual(res.status_code, 200)
        updated = json.loads(res.data)['data']
        self.assertEqual(updated['name'], "Budi Santoso Edit")

        # 4. Delete member
        res = self.client.delete(f'/api/members/{member_id}')
        self.assertEqual(res.status_code, 200)

        # 5. Verify count back to 2
        res = self.client.get('/api/members')
        data = json.loads(res.data)
        self.assertEqual(data['count'], 2)

if __name__ == '__main__':
    unittest.main()
