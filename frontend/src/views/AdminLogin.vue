<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const credentials = ref({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const login = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    const response = await api.login(credentials.value);
    
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
      router.push('/admin/panel');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Header -->
      <div class="login-header">
        <h1 class="title">Admin Login</h1>
        <p class="subtitle">Access the registration management panel</p>
      </div>

      <!-- Login Form -->
      <div class="login-card">
        <form @submit.prevent="login" class="login-form">
          <!-- Username -->
          <div class="form-group">
            <label for="username" class="form-label">
              Username
            </label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              required
              class="form-input"
              placeholder="Enter admin username"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">
              Password
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="form-input"
              placeholder="Enter password"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="submit-button"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>

        <!-- Back to Home -->
        <div class="back-link-wrapper">
          <button 
            @click="goBack"
            class="back-link"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #1f2937, #111827);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-wrapper {
  max-width: 28rem;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #9ca3af;
}

.login-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.15s ease-in-out;
}

.form-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.form-input::placeholder {
  color: #9ca3af;
}

.error-message {
  background-color: #fef2f2;
  border: 2px solid #ef4444;
  border-radius: 0.75rem;
  padding: 1rem;
  color: #b91c1c;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link-wrapper {
  margin-top: 1.5rem;
  text-align: center;
}

.back-link {
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: color 0.15s ease-in-out;
}

.back-link:hover {
  color: var(--color-primary-dark);
}
</style>