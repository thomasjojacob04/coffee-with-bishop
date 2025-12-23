<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const registrations = ref([]);
const loading = ref(true);
const error = ref('');
const selectedRegistration = ref(null);
const showModal = ref(false);
const showQuestionsModal = ref(false);

const fetchRegistrations = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.getRegistrations();
    registrations.value = response.data.data;
  } catch (err) {
    console.error('Failed to load registrations:', err);
    error.value = 'Failed to load registrations';
    if (err.response?.status === 401) {
      logout();
    }
  } finally {
    loading.value = false;
  }
};

const viewDetails = (registration) => {
  selectedRegistration.value = registration;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedRegistration.value = null;
};

const viewAllQuestions = () => {
  showQuestionsModal.value = true;
};

const closeQuestionsModal = () => {
  showQuestionsModal.value = false;
};

const deleteRegistration = async (id) => {
  if (!confirm('Are you sure you want to delete this registration?')) {
    return;
  }

  try {
    await api.deleteRegistration(id);
    await fetchRegistrations();
  } catch (err) {
    console.error('Failed to delete registration:', err);
    alert('Failed to delete registration');
  }
};

const logout = () => {
  localStorage.removeItem('adminToken');
  router.push('/admin/login');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get registrations with questions
const registrationsWithQuestions = computed(() => {
  return registrations.value.filter(r => r.questions && r.questions.trim() !== '');
});

const exportToCSV = () => {
  const headers = ['Full Name', 'Phone', 'Email', 'State', 'Questions', 'Registered At'];
  const rows = registrations.value.map(reg => [
    reg.fullName,
    reg.phone,
    reg.email,
    reg.state,
    reg.questions || 'N/A',
    formatDate(reg.registeredAt)
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'registrations.csv';
  a.click();
};

onMounted(() => {
  fetchRegistrations();
});
</script>

<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-inner">
          <div class="header-brand">
            <div class="brand-text">
              <h1 class="brand-title">Admin Panel</h1>
              <p class="brand-subtitle">Coffee with Bishop</p>
            </div>
          </div>
          <button
            @click="logout"
            class="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Total Registrations</p>
              <p class="stat-value">{{ registrations.length }}</p>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">With Questions</p>
              <p class="stat-value">
                {{ registrationsWithQuestions.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-card">
        <div class="actions-content">
          <h2 class="actions-title">Registered Participants</h2>
          <div class="actions-buttons">
            <button
              @click="viewAllQuestions"
              class="action-button action-button-purple"
            >
              View Questions
            </button>
            <button
              @click="fetchRegistrations"
              class="action-button action-button-blue"
            >
              Refresh
            </button>
            <button
              @click="exportToCSV"
              :disabled="registrations.length === 0"
              class="action-button action-button-green"
              :class="{ 'action-button-disabled': registrations.length === 0 }"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading registrations...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p class="error-text">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="registrations.length === 0" class="empty-state">
        <h3 class="empty-title">No Registrations Yet</h3>
        <p class="empty-description">Registrations will appear here once participants sign up.</p>
      </div>

      <!-- Registrations Table -->
      <div v-else class="table-card">
        <div class="table-wrapper">
          <table class="registrations-table">
            <thead class="table-head">
              <tr>
                <th class="table-header">Name</th>
                <th class="table-header">Phone</th>
                <th class="table-header">Email</th>
                <th class="table-header">State</th>
                <th class="table-header">Registered</th>
                <th class="table-header">Actions</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr 
                v-for="registration in registrations" 
                :key="registration._id"
                class="table-row"
              >
                <td class="table-cell table-cell-name">
                  {{ registration.fullName }}
                </td>
                <td class="table-cell">
                  {{ registration.phone }}
                </td>
                <td class="table-cell">
                  {{ registration.email }}
                </td>
                <td class="table-cell">
                  {{ registration.state }}
                </td>
                <td class="table-cell">
                  {{ formatDate(registration.registeredAt) }}
                </td>
                <td class="table-cell">
                  <div class="table-actions">
                    <button
                      @click="viewDetails(registration)"
                      class="table-action-button table-action-view"
                    >
                      View
                    </button>
                    <button
                      @click="deleteRegistration(registration._id)"
                      class="table-action-button table-action-delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Details Modal -->
    <div 
      v-if="showModal && selectedRegistration"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <div class="modal-inner">
          <div class="modal-header">
            <h3 class="modal-title">Registration Details</h3>
            <button
              @click="closeModal"
              class="modal-close"
            >
              ×
            </button>
          </div>

          <div class="modal-details">
            <div class="detail-item">
              <label class="detail-label">Full Name</label>
              <p class="detail-value">{{ selectedRegistration.fullName }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Phone Number</label>
              <p class="detail-value">{{ selectedRegistration.phone }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Email Address</label>
              <p class="detail-value">{{ selectedRegistration.email }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">State</label>
              <p class="detail-value">{{ selectedRegistration.state }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Questions/Topics</label>
              <p class="detail-value">
                {{ selectedRegistration.questions }}
              </p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Registered At</label>
              <p class="detail-value">{{ formatDate(selectedRegistration.registeredAt) }}</p>
            </div>
          </div>

          <button
            @click="closeModal"
            class="modal-close-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Questions Modal -->
    <div 
      v-if="showQuestionsModal"
      class="modal-overlay"
      @click.self="closeQuestionsModal"
    >
      <div class="modal-content modal-content-large">
        <div class="modal-inner">
          <div class="modal-header">
            <h3 class="modal-title">All Questions from Participants</h3>
            <button
              @click="closeQuestionsModal"
              class="modal-close"
            >
              ×
            </button>
          </div>

          <!-- Empty Questions State -->
          <div v-if="registrationsWithQuestions.length === 0" class="questions-empty">
            <p class="questions-empty-text">No questions have been submitted yet.</p>
          </div>

          <!-- Questions List -->
          <div v-else class="questions-list">
            <div 
              v-for="(registration, index) in registrationsWithQuestions" 
              :key="registration._id"
              class="question-item"
            >
              <div class="question-header">
                <div class="question-number">{{ index + 1 }}</div>
                <div class="question-info">
                  <p class="question-name">{{ registration.fullName }}</p>
                  <p class="question-meta">{{ registration.state }}</p>
                </div>
              </div>
              <div class="question-content">
                <p class="question-text">{{ registration.questions }}</p>
              </div>
            </div>
          </div>

          <button
            @click="closeQuestionsModal"
            class="modal-close-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #d97706;
  --color-primary-dark: #b45309;
}

/* Page Container */
.dashboard-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Header */
.dashboard-header {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #b91c1c;
}

/* Main Content */
.dashboard-main {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
}

/* Actions Card */
.actions-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.actions-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.875rem;
}

.action-button-purple {
  background-color: #9333ea;
}

.action-button-purple:hover {
  background-color: #7e22ce;
}

.action-button-blue {
  background-color: #2563eb;
}

.action-button-blue:hover {
  background-color: #1d4ed8;
}

.action-button-green {
  background-color: #16a34a;
}

.action-button-green:hover {
  background-color: #15803d;
}

.action-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button-disabled:hover {
  background-color: #16a34a;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 0;
}

.loading-spinner {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1rem;
  color: #4b5563;
}

/* Error State */
.error-state {
  background-color: #fef2f2;
  border: 2px solid #ef4444;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.error-text {
  color: #b91c1c;
  font-size: 1.125rem;
}

/* Empty State */
.empty-state {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #4b5563;
}

/* Table Card */
.table-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.registrations-table {
  width: 100%;
  border-collapse: collapse;
}

.table-head {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.table-header {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.table-body {
  background-color: white;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.3s;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-cell {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.table-cell-name {
  color: #111827;
  font-weight: 500;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.table-action-button {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.table-action-view {
  background-color: #dbeafe;
  color: #1e40af;
}

.table-action-view:hover {
  background-color: #bfdbfe;
}

.table-action-delete {
  background-color: #fee2e2;
  color: #b91c1c;
}

.table-action-delete:hover {
  background-color: #fecaca;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content-large {
  max-width: 56rem;
}

.modal-inner {
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  color: #9ca3af;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 1;
}

.modal-close:hover {
  color: #4b5563;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-of-type {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.125rem;
  color: #111827;
  word-break: break-word;
}

/* Questions Modal */
.questions-empty {
  text-align: center;
  padding: 3rem 1rem;
}

.questions-empty-text {
  color: #6b7280;
  font-size: 1.125rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.question-item {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.question-number {
  width: 2rem;
  height: 2rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.question-info {
  flex: 1;
}

.question-name {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.question-meta {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.question-content {
  padding-left: 3rem;
}

.question-text {
  color: #374151;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.modal-close-button {
  margin-top: 2rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 600;
}

.modal-close-button:hover {
  background-color: var(--color-primary-dark);
}
</style>