// Frontend Script for UTS Pemrograman Web
const API_BASE = '/api';

// DOM Elements
const taskTableBody = document.getElementById('taskTableBody');
const loadingTasks = document.getElementById('loadingTasks');
const emptyTasks = document.getElementById('emptyTasks');
const taskForm = document.getElementById('taskForm');
const btnSubmitTask = document.getElementById('btnSubmitTask');
const btnSwitchFormat = document.getElementById('btnSwitchFormat');
const navTextNama = document.getElementById('navTextNama');
const navTextNim = document.getElementById('navTextNim');

// State
let isOriginalPromptFormat = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  setupEventListeners();
});

function setupEventListeners() {
  // Submit new task
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskSubmit);
  }

  // Toggle Navbar text format
  if (btnSwitchFormat) {
    btnSwitchFormat.addEventListener('click', toggleNavbarFormat);
  }
}

// Toggle format antara teks soal ("Masukkan Nama" & "Masukkan NIM") dan identitas asli
function toggleNavbarFormat() {
  isOriginalPromptFormat = !isOriginalPromptFormat;
  
  if (isOriginalPromptFormat) {
    navTextNama.innerHTML = `<span class="fw-semibold">Masukkan Nama</span>`;
    navTextNim.innerHTML = `<span class="fw-semibold">Masukkan NIM</span>`;
    showToast('Format navbar diubah ke teks standar soal');
  } else {
    navTextNama.innerHTML = `Masukkan Nama: <strong class="text-info fw-bold">Muhammad Ryan Rizki Iswadi</strong>`;
    navTextNim.innerHTML = `Masukkan NIM: <strong class="text-warning fw-bold font-monospace">24010110165</strong>`;
    showToast('Format navbar menampilkan identitas mahasiswa');
  }
}

// Fetch tasks from REST API
async function fetchTasks() {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    const json = await res.json();

    if (json.status === 'success') {
      renderTasks(json.data || []);
    } else {
      showToast('Gagal mengambil data tugas', 'danger');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showToast('Terjadi kesalahan koneksi ke backend', 'danger');
  } finally {
    setLoading(false);
  }
}

// Render table rows
function renderTasks(tasks) {
  taskTableBody.innerHTML = '';

  if (!tasks || tasks.length === 0) {
    emptyTasks.classList.remove('d-none');
    return;
  }

  emptyTasks.classList.add('d-none');

  tasks.forEach((task, index) => {
    const tr = document.createElement('tr');
    const badgeClass = getCategoryBadgeClass(task.category);

    tr.innerHTML = `
      <td class="py-3 px-4 font-monospace text-muted small">${index + 1}</td>
      <td class="py-3 px-4">
        <strong class="text-dark d-block">${escapeHtml(task.title)}</strong>
        <small class="text-muted font-monospace">${escapeHtml(task.name)} &bull; ${escapeHtml(task.nim)}</small>
      </td>
      <td class="py-3 px-4">
        <span class="badge ${badgeClass} px-2.5 py-1 rounded-pill small">
          ${escapeHtml(task.category)}
        </span>
      </td>
      <td class="py-3 px-4 text-secondary small" style="max-width: 320px;">
        ${escapeHtml(task.description)}
      </td>
      <td class="py-3 px-4">
        <span class="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill small">
          <i class="bi bi-check2-circle me-1"></i>${escapeHtml(task.status || 'Selesai')}
        </span>
      </td>
      <td class="py-3 px-4 text-center">
        <button 
          onclick="deleteTaskItem(${task.id}, '${escapeHtml(task.title)}')" 
          class="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
          title="Hapus Tugas"
        >
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    taskTableBody.appendChild(tr);
  });
}

function getCategoryBadgeClass(category) {
  switch (category) {
    case 'Bootstrap': return 'badge-cat-bootstrap';
    case 'HTML & CSS': return 'badge-cat-html';
    case 'JavaScript': return 'badge-cat-javascript';
    case 'Backend': return 'badge-cat-backend';
    default: return 'badge-cat-database';
  }
}

// Handle Form Submission
async function handleTaskSubmit(e) {
  e.preventDefault();
  btnSubmitTask.disabled = true;
  btnSubmitTask.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Menyimpan...`;

  const formData = new FormData(taskForm);
  const payload = {
    name: formData.get('name'),
    nim: formData.get('nim'),
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    status: 'Selesai'
  };

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      showToast('Tugas baru berhasil disimpan ke database!');
      // Close modal
      const modalEl = document.getElementById('addTaskModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      taskForm.reset();
      fetchTasks();
    } else {
      showToast(json.message || 'Gagal menyimpan tugas', 'danger');
    }
  } catch (err) {
    console.error('Submit error:', err);
    showToast('Terjadi kesalahan koneksi', 'danger');
  } finally {
    btnSubmitTask.disabled = false;
    btnSubmitTask.innerHTML = `<i class="bi bi-save me-1"></i> Simpan Tugas`;
  }
}

// Delete task
async function deleteTaskItem(id, title) {
  if (!confirm(`Hapus tugas "${title}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      showToast('Tugas berhasil dihapus');
      fetchTasks();
    } else {
      showToast(json.message || 'Gagal menghapus tugas', 'danger');
    }
  } catch (err) {
    console.error('Delete error:', err);
    showToast('Gagal menghapus tugas', 'danger');
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingTasks.classList.remove('d-none');
    emptyTasks.classList.add('d-none');
  } else {
    loadingTasks.classList.add('d-none');
  }
}

function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (type === 'danger') {
    toastEl.className = 'toast align-items-center text-white bg-danger border-0 rounded-3 shadow';
  } else {
    toastEl.className = 'toast align-items-center text-white bg-dark border-0 rounded-3 shadow';
  }

  toastMessage.textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
