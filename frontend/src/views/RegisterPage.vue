<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const form = ref({
  fullName: '',
  phone: '',
  email: '',
  state: '',
  questions: ''
});

const loading = ref(false);
const success = ref(false);
const error = ref('');

const submitForm = async () => {
  error.value = '';
  
  // Basic validation
  if (!form.value.fullName || !form.value.phone || !form.value.email || !form.value.state || !form.value.questions) {
    error.value = 'Please fill in all required fields';
    return;
  }

  loading.value = true;

  try {
    await api.createRegistration(form.value);
    success.value = true;
    
    setTimeout(() => {
      router.push('/');
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Header -->
      <div class="register-header">
        <button 
          @click="goBack"
          class="back-button"
        >
          <span class="back-arrow">←</span>
          <span>Back to Home</span>
        </button>
        
        <div class="header-title-wrapper">
          <h1 class="header-title">Event Registration</h1>
        </div>
        <p class="header-subtitle">Please fill in your details to reserve your spot</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <div class="success-icon">✅</div>
        <h2 class="success-title">Registration Successful!</h2>
        <p class="success-description">Thank you for registering. We look forward to seeing you at the event!</p>
        <p class="success-redirect">Redirecting to home page...</p>
      </div>

      <!-- Registration Form -->
      <div v-else class="form-card">
        <form @submit.prevent="submitForm" class="registration-form">
          <!-- Full Name -->
          <div class="form-group">
            <label for="fullName" class="form-label">
              Full Name <span class="required-mark">*</span>
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label for="phone" class="form-label">
              Phone Number <span class="required-mark">*</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="form-input"
              placeholder="+91 12345 67890"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              Email Address <span class="required-mark">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="your.email@example.com"
            />
          </div>

          <!-- State -->
          <div class="form-group">
            <label for="state" class="form-label">
              State <span class="required-mark">*</span>
            </label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              required
              class="form-input"
              placeholder="Enter your state"
            />
          </div>

          <!-- Questions/Doubts -->
          <div class="form-group">
            <label for="questions" class="form-label">
              Questions or Topics You'd Like to Discuss <span class="required-mark">*</span>
            </label>
            <textarea
              id="questions"
              v-model="form.questions"
              rows="4"
              required
              class="form-textarea"
              placeholder="Share any questions, doubts, or topics you'd like to discuss with the Bishop"
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="submit-wrapper">
            <button
              type="submit"
              :disabled="loading"
              class="submit-button"
              :class="{ 'submit-button-disabled': loading }"
            >
              <span v-if="loading">Submitting...</span>
              <span v-else>Complete Registration</span>
            </button>
          </div>

          <p class="form-footer-text">
            By registering, you agree to receive event updates and reminders
          </p>
        </form>
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
.register-page {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fef3c7, #fed7aa, #fef3c7);
  padding: 3rem 1.5rem;
}

.register-container {
  max-width: 48rem;
  margin: 0 auto;
}

/* Header */
.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.back-button {
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.back-button:hover {
  color: var(--color-primary-dark);
}

.back-arrow {
  font-size: 1.25rem;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
}

.header-subtitle {
  color: #4b5563;
}

/* Success Message */
.success-message {
  background-color: #f0fdf4;
  border: 2px solid #22c55e;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 3.75rem;
  margin-bottom: 1rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.5rem;
}

.success-description {
  color: #15803d;
}

.success-redirect {
  font-size: 0.875rem;
  color: #16a34a;
  margin-top: 1rem;
}

/* Form Card */
.form-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
}

@media (min-width: 768px) {
  .form-card {
    padding: 3rem;
  }
}

/* Form */
.registration-form {
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
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required-mark {
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: none;
}

/* Error Message */
.error-message {
  background-color: #fef2f2;
  border: 2px solid #ef4444;
  border-radius: 0.75rem;
  padding: 1rem;
  color: #b91c1c;
}

/* Submit Button */
.submit-wrapper {
  padding-top: 1rem;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.submit-button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.submit-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-button-disabled:hover {
  background-color: var(--color-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Footer Text */
.form-footer-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1rem;
}
</style>