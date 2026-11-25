// Frontend Script for UTS Pemrograman Web (v2.0)
const API_BASE = '/api';

// State
let allTasks = [];
let currentCategoryFilter = 'Semua';
let currentSearchQuery = '';
let isOriginalPromptFormat = false;
let taskIdToDelete = null;

// DOM Elements
const taskTableBody = document.getElementById('taskTableBody');
const loadingTasks = document.getElementById('loadingTasks');
const emptyTasks = document.getElementById('emptyTasks');
const taskForm = document.getElementById('taskForm');
const btnSubmitTask = document.getElementById('btnSubmitTask');
const btnSwitchFormat = document.getElementById('btnSwitchFormat');
const navTextNama = document.getElementById('navTextNama');
const navTextNim = document.getElementById('navTextNim');
const taskSearchInput = document.getElementById('taskSearchInput');
const categoryPillContainer = document.getElementById('categoryPillContainer');
const taskCounterText = document.getElementById('taskCounterText');

// Theme Switcher Elements
const btnThemeToggle = document.getElementById('btnThemeToggle');
const themeIcon = document.getElementById('themeIcon');

// Stats Elements
const statTotal = document.getElementById('statTotal');
const statCompleted = document.getElementById('statCompleted');
const statInProgress = document.getElementById('statInProgress');

// Delete Modal Elements
const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

// Detail Modal Elements
const detailModalBody = document.getElementById('detailModalBody');

// Scroll to top
const btnScrollTop = document.getElementById('btnScrollTop');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchTasks();
  fetchStats();
  setupEventListeners();
});

// ----------------- THEME MANAGEMENT -----------------
function initTheme() {
  const savedTheme = localStorage.getItem('uts_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  applyTheme(activeTheme);

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('uts_theme', next);
      showToast(`Tema beralih ke Mode ${next === 'dark' ? 'Gelap' : 'Terang'}`);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun-fill text-warning';
    } else {
      themeIcon.className = 'bi bi-moon-stars-fill text-warning';
    }
  }
}

// ----------------- EVENT LISTENERS -----------------
function setupEventListeners() {
  // Form submission
  if (taskForm) {
    taskForm.addEventListener('submit', handleTaskSubmit);
  }

  // Toggle Navbar format
  if (btnSwitchFormat) {
    btnSwitchFormat.addEventListener('click', toggleNavbarFormat);
  }

  // Real-time debounced search
  let debounceTimeout = null;
  if (taskSearchInput) {
    taskSearchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentSearchQuery = taskSearchInput.value.trim().toLowerCase();
        applyFilterAndRender();
      }, 250);
    });
  }

  // Category filter pills
  if (categoryPillContainer) {
    categoryPillContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-pill');
      if (!btn) return;

      document.querySelectorAll('.category-pill').forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-secondary');
      });

      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-primary', 'active');

      currentCategoryFilter = btn.dataset.cat || 'Semua';
      applyFilterAndRender();
    });
  }

  // Delete modal confirm button
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', executeDeleteTask);
  }

  // Scroll to top listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnScrollTop.classList.remove('d-none');
    } else {
      btnScrollTop.classList.add('d-none');
    }
  });

  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ----------------- NAVBAR FORMAT TOGGLE -----------------
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

// ----------------- API CALLS -----------------
async function fetchTasks() {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    const json = await res.json();

    if (json.status === 'success') {
      allTasks = json.data || [];
      applyFilterAndRender();
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

async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const json = await res.json();
    if (json.status === 'success') {
      const stats = json.data;
      if (statTotal) statTotal.textContent = stats.total || 0;
      if (statCompleted) statCompleted.textContent = stats.completed || 0;
      if (statInProgress) statInProgress.textContent = stats.in_progress || 0;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// ----------------- FILTER & RENDER -----------------
function applyFilterAndRender() {
  let filtered = allTasks;

  // Category filter
  if (currentCategoryFilter !== 'Semua') {
    filtered = filtered.filter(t => t.category === currentCategoryFilter);
  }

  // Search filter
  if (currentSearchQuery) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(currentSearchQuery) ||
      t.description.toLowerCase().includes(currentSearchQuery) ||
      t.category.toLowerCase().includes(currentSearchQuery)
    );
  }

  renderTasks(filtered);
  if (taskCounterText) {
    taskCounterText.textContent = `Menampilkan ${filtered.length} dari ${allTasks.length} tugas`;
  }
}

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
    const isDone = task.status === 'Selesai';
    const statusBadgeClass = isDone 
      ? 'bg-success-subtle text-success border border-success-subtle' 
      : 'bg-warning-subtle text-warning border border-warning-subtle';
    const statusIcon = isDone ? 'bi-check2-circle' : 'bi-clock-history';

    tr.innerHTML = `
      <td class="py-3 px-4 font-monospace text-secondary small">${index + 1}</td>
      <td class="py-3 px-4">
        <a href="javascript:void(0)" onclick="viewTaskDetail(${task.id})" class="fw-bold text-decoration-none text-body d-block hover-underline">
          ${escapeHtml(task.title)}
        </a>
        <small class="text-secondary font-monospace">${escapeHtml(task.name)} &bull; ${escapeHtml(task.nim)}</small>
      </td>
      <td class="py-3 px-4">
        <span class="badge ${badgeClass} px-2.5 py-1 rounded-pill small">
          ${escapeHtml(task.category)}
        </span>
      </td>
      <td class="py-3 px-4 text-secondary small text-truncate" style="max-width: 280px;" title="${escapeHtml(task.description)}">
        ${escapeHtml(task.description)}
      </td>
      <td class="py-3 px-4">
        <span 
          onclick="toggleTaskStatus(${task.id})" 
          class="badge ${statusBadgeClass} px-2.5 py-1.5 rounded-pill small status-badge-btn d-inline-flex align-items-center gap-1"
          title="Klik untuk ubah status tugas"
        >
          <i class="bi ${statusIcon}"></i>
          <span>${escapeHtml(task.status)}</span>
        </span>
      </td>
      <td class="py-3 px-4 text-center whitespace-nowrap">
        <div class="btn-group btn-group-sm">
          <button 
            onclick="viewTaskDetail(${task.id})" 
            class="btn btn-outline-primary border-0 rounded-circle p-1.5"
            title="Lihat Rincian Tugas"
          >
            <i class="bi bi-eye"></i>
          </button>
          <button 
            onclick="promptDeleteTask(${task.id})" 
            class="btn btn-outline-danger border-0 rounded-circle p-1.5 ms-1"
            title="Hapus Tugas"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
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

// ----------------- CRUD ACTIONS -----------------
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
      const modalEl = document.getElementById('addTaskModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      taskForm.reset();
      fetchTasks();
      fetchStats();
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

// Toggle Task Status
async function toggleTaskStatus(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle-status`, { method: 'PUT' });
    const json = await res.json();
    if (res.ok && json.status === 'success') {
      showToast(`Status tugas diubah menjadi "${json.data.status}"`);
      // Update local state and re-render
      const idx = allTasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        allTasks[idx] = json.data;
        applyFilterAndRender();
        fetchStats();
      }
    } else {
      showToast('Gagal mengubah status', 'danger');
    }
  } catch (err) {
    console.error('Toggle error:', err);
    showToast('Terjadi kesalahan koneksi', 'danger');
  }
}

// Detail View Modal
function viewTaskDetail(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  const isDone = task.status === 'Selesai';
  const badgeClass = getCategoryBadgeClass(task.category);

  detailModalBody.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
      <div>
        <span class="badge ${badgeClass} mb-1">${escapeHtml(task.category)}</span>
        <h5 class="fw-bold mb-0">${escapeHtml(task.title)}</h5>
      </div>
      <span class="badge ${isDone ? 'bg-success' : 'bg-warning text-dark'} px-2.5 py-1 rounded-pill">
        ${escapeHtml(task.status)}
      </span>
    </div>

    <div class="row g-2 mb-3 text-sm">
      <div class="col-6">
        <small class="text-secondary d-block">Mahasiswa</small>
        <strong>${escapeHtml(task.name)}</strong>
      </div>
      <div class="col-6">
        <small class="text-secondary d-block">NIM</small>
        <span class="font-monospace text-primary fw-bold">${escapeHtml(task.nim)}</span>
      </div>
    </div>

    <div class="mb-3">
      <small class="text-secondary d-block mb-1 fw-semibold text-uppercase" style="font-size: 11px;">Deskripsi Tugas</small>
      <div class="p-3 rounded-3 bg-body-tertiary border text-secondary small leading-relaxed">
        ${escapeHtml(task.description)}
      </div>
    </div>

    <div class="text-secondary small font-monospace">
      <i class="bi bi-clock me-1"></i> Dibuat pada: ${escapeHtml(task.created_at)}
    </div>
  `;

  const detailModal = new bootstrap.Modal(document.getElementById('detailTaskModal'));
  detailModal.show();
}

// Delete Confirmation
function promptDeleteTask(id) {
  taskIdToDelete = id;
  const deleteModal = new bootstrap.Modal(deleteConfirmModalEl);
  deleteModal.show();
}

async function executeDeleteTask() {
  if (!taskIdToDelete) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskIdToDelete}`, { method: 'DELETE' });
    const json = await res.json();

    if (res.ok && json.status === 'success') {
      showToast('Tugas berhasil dihapus');
      const modal = bootstrap.Modal.getInstance(deleteConfirmModalEl);
      if (modal) modal.hide();
      fetchTasks();
      fetchStats();
    } else {
      showToast(json.message || 'Gagal menghapus tugas', 'danger');
    }
  } catch (err) {
    console.error('Delete error:', err);
    showToast('Gagal menghapus tugas', 'danger');
  } finally {
    taskIdToDelete = null;
  }
}

// ----------------- HELPERS -----------------
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
