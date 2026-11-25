// Script Frontend UTS Pemrograman Web - Biodata Anggota
const API_BASE = '/api';

// State
let membersList = [];

// DOM Elements
const memberCardGrid = document.getElementById('memberCardGrid');
const colAddCard = document.getElementById('colAddCard');
const alertBanner = document.getElementById('alertBanner');
const alertMessage = document.getElementById('alertMessage');

// Form Tambah
const formAddMember = document.getElementById('formAddMember');
const modalAddMemberEl = document.getElementById('modalAddMember');
const btnSubmitAdd = document.getElementById('btnSubmitAdd');

// Form Edit
const formEditMember = document.getElementById('formEditMember');
const modalEditMemberEl = document.getElementById('modalEditMember');
const btnSubmitEdit = document.getElementById('btnSubmitEdit');
const editMemberId = document.getElementById('editMemberId');
const editName = document.getElementById('editName');
const editNim = document.getElementById('editNim');
const editDescription = document.getElementById('editDescription');
const editPhoto = document.getElementById('editPhoto');

// Navbar Name / NIM Toggler
const navNama = document.getElementById('navNama');
const navNim = document.getElementById('navNim');

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  fetchMembers();
  setupEventListeners();
});

function setupEventListeners() {
  if (formAddMember) {
    formAddMember.addEventListener('submit', handleAddMember);
  }

  if (formEditMember) {
    formEditMember.addEventListener('submit', handleEditMember);
  }

  // Nama dan NIM ditampilkan langsung pada navbar.

}

// Fetch Members from API
async function fetchMembers() {
  try {
    const res = await fetch(`${API_BASE}/members`);
    const json = await res.json();
    if (json.status === 'success') {
      // Identitas anggota tim sesuai data kelompok.
      const profiles = [
        {
          name: 'Lalu Revian Firdaus',
          nim: '24010110177',
          description: 'Bertanggung jawab pada bagian Frontend Developer, merancang tampilan dan pengalaman pengguna website.',
          photo: 'img/lalu.jpg'
        },
        {
          name: 'Muhammad Ryan Rizki',
          nim: '24010110165',
          description: 'Bertanggung jawab pada bagian Backend Developer, mengembangkan API, proses server, dan pengelolaan data.',
          photo: 'img/ryan.jpg'
        }
      ];
      membersList = (json.data || []).map((member, index) => ({
        ...member,
        ...(profiles[index] || {})
      }));
      renderMembers(membersList);
    }
  } catch (err) {
    console.error('Fetch members error:', err);
  }
}

// Render Cards to Grid
function renderMembers(members) {
  memberCardGrid.querySelectorAll('.col-member-item').forEach(col => col.remove());

  members.forEach(member => {
    const col = document.createElement('div');
    col.className = 'col col-member-item';
    const photoSrc = member.photo || 'img/default-avatar.svg';

    col.innerHTML = `
      <article class="card h-100 member-card">
        <img
          src="${escapeHtml(photoSrc)}"
          class="member-card-img"
          alt="Foto ${escapeHtml(member.name)}"
          onerror="this.onerror=null;this.src='img/default-avatar.svg'"
        />
        <div class="member-card-body">
          <h2 class="member-name">${escapeHtml(member.name)}</h2>
          <span class="member-nim">NIM: ${escapeHtml(member.nim || '-')}</span>
          <p class="member-desc">${escapeHtml(member.description)}</p>
          <div class="btn-action-group">
            <button type="button" class="btn btn-outline-primary btn-card-action" data-action="edit" data-id="${Number(member.id)}">
              <i class="bi bi-pencil-square me-1"></i>Edit
            </button>
            <button type="button" class="btn btn-outline-danger btn-card-action" data-action="delete" data-id="${Number(member.id)}">
              <i class="bi bi-trash3 me-1"></i>Hapus
            </button>
          </div>
        </div>
      </article>
    `;

    col.querySelector('[data-action="edit"]').addEventListener('click', () => openEditModal(member.id));
    col.querySelector('[data-action="delete"]').addEventListener('click', () => deleteMemberItem(member.id, member.name));
    memberCardGrid.appendChild(col);
  });
}

// Handle Add Member
async function handleAddMember(e) {
  e.preventDefault();
  btnSubmitAdd.disabled = true;
  btnSubmitAdd.textContent = 'Menyimpan...';

  const formData = new FormData(formAddMember);
  const payload = {
    name: formData.get('name'),
    nim: formData.get('nim'),
    description: formData.get('description'),
    photo: formData.get('photoSelect')
  };

  try {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      const modal = bootstrap.Modal.getInstance(modalAddMemberEl);
      if (modal) modal.hide();
      formAddMember.reset();
      showAlert('Biodata berhasil ditambahkan.');
      fetchMembers();
    } else {
      alert(json.message || 'Gagal menambahkan anggota.');
    }
  } catch (err) {
    console.error('Add error:', err);
    alert('Terjadi kesalahan koneksi.');
  } finally {
    btnSubmitAdd.disabled = false;
    btnSubmitAdd.textContent = 'Simpan Biodata';
  }
}

// Open Edit Modal
function openEditModal(id) {
  const member = membersList.find(m => m.id === id);
  if (!member) return;

  editMemberId.value = member.id;
  editName.value = member.name;
  editNim.value = member.nim;
  editDescription.value = member.description;
  if (editPhoto) editPhoto.value = member.photo || 'img/default-avatar.svg';

  const modal = new bootstrap.Modal(modalEditMemberEl);
  modal.show();
}

// Handle Edit Member
async function handleEditMember(e) {
  e.preventDefault();
  btnSubmitEdit.disabled = true;
  btnSubmitEdit.textContent = 'Menyimpan...';

  const id = editMemberId.value;
  const payload = {
    name: editName.value,
    nim: editNim.value,
    description: editDescription.value,
    photo: editPhoto.value
  };

  try {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      const modal = bootstrap.Modal.getInstance(modalEditMemberEl);
      if (modal) modal.hide();
      showAlert('Biodata berhasil diperbarui.');
      fetchMembers();
    } else {
      alert(json.message || 'Gagal memperbarui biodata.');
    }
  } catch (err) {
    console.error('Edit error:', err);
    alert('Terjadi kesalahan koneksi.');
  } finally {
    btnSubmitEdit.disabled = false;
    btnSubmitEdit.textContent = 'Perbarui Biodata';
  }
}

// Delete Member
async function deleteMemberItem(id, name) {
  if (!confirm(`Apakah Anda yakin ingin menghapus biodata "${name}"?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      showAlert('Biodata berhasil dihapus.');
      fetchMembers();
    } else {
      alert(json.message || 'Gagal menghapus biodata.');
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Terjadi kesalahan koneksi saat menghapus.');
  }
}

// Show Alert Banner
function showAlert(message) {
  if (!alertBanner || !alertMessage) return;
  alertMessage.textContent = message;
  alertBanner.classList.remove('d-none');
  alertBanner.classList.add('show');
}

// Utility: escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
