<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isScrolled = ref(false);
const collageImages = ref([]);

const loadImages = async () => {
  try {
    // Try to load images from the public/images folder
    const imageFiles = [
      '/images/coffee1.jpeg',
      '/images/coffee2.jpeg',
      '/images/coffee3.jpeg',
      '/images/coffee4.jpeg'
    ];
    
    // You can add more images if available
    collageImages.value = imageFiles.map((path, index) => ({
      id: index + 1,
      url: path,
      alt: `Coffee gathering ${index + 1}`
    }));
  } catch (error) {
    console.error('Error loading images:', error);
    // Fallback to placeholder images if local images fail
    collageImages.value = [
      { id: 1, url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', alt: 'Coffee gathering 1' },
      { id: 2, url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', alt: 'Coffee gathering 2' },
      { id: 3, url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', alt: 'Coffee gathering 3' },
      { id: 4, url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', alt: 'Coffee gathering 4' }
    ];
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  loadImages();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const goToRegister = () => {
  router.push('/register');
};

const goToAdmin = () => {
  router.push('/admin/login');
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="page-container">
    <!-- Navigation -->
    <nav class="nav-bar" :class="{ 'nav-scrolled': isScrolled }">
      <div class="nav-content">
        <div class="nav-inner">
          <div class="logo-container">
            <span class="logo-text">Coffee with Bishop</span>
          </div>
          <div class="nav-links">
            <button @click="scrollToSection('about')" class="nav-link">About</button>
            <button @click="goToRegister" class="nav-register-btn">Register Now</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-text">Join Us for an Inspiring Conversation</span>
          </div>
          <h1 class="hero-title">
            Coffee with<br/>
            <span class="hero-title-highlight">Bishop</span>
          </h1>
          <p class="hero-description">
            An intimate gathering where faith meets fellowship. Share your thoughts, ask questions, and connect with our spiritual leader over a warm cup of coffee.
          </p>
          <button @click="goToRegister" class="hero-cta-btn">
            Register Now
          </button>
        </div>
        
        <div class="hero-image-container">
          <div class="collage-grid">
            <div 
              v-for="(image, index) in collageImages" 
              :key="image.id"
              :class="`collage-item collage-item-${index + 1}`"
            >
              <img :src="image.url" :alt="image.alt" class="collage-img">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="about-container">
        <div class="about-content-wrapper">
          <div class="section-header">
            <h2 class="section-title">Get Ready for a "Coffee with Bishop"</h2>
            <div class="section-divider"></div>
          </div>
          
          <div class="about-text">
            <p class="about-paragraph">
              Join us for a special time with a bishop over coffee! Share your thoughts, ask questions, and grow in faith with friends and fellow believers. It's a chance to dive into spirituality, church life, and real-life stuff in a warm and friendly vibe.
            </p>
            
            <h3 class="highlights-title">Highlights:</h3>
            <ul class="highlights-list">
              <li class="highlight-item">Chat with a bishop for over 30 minutes</li>
              <li class="highlight-item">Clarify doubts and deepen your love for God and the Church</li>
              <li class="highlight-item">Connect with fellow believers and boost your faith community</li>
            </ul>
            
            <p class="about-closing">
              Come with an open heart and leave inspired! Don't miss this blessed opportunity!
            </p>
          </div>
          
          <button @click="goToRegister" class="about-cta-btn">
            Reserve Your Spot
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-copyright">&copy; 2025 Coffee with Bishop. All rights reserved.</p>
        <button @click="goToAdmin" class="admin-link">Admin Login</button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

:root {
  --color-primary: #d97706;
  --color-primary-dark: #b45309;
  --color-secondary: #f59e0b;
}

* {
  box-sizing: border-box;
}

/* Page Container */
.page-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fef3c7, #ffffff);
}

/* Navigation */
.nav-bar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  z-index: 50;
  transition: box-shadow 0.3s ease;
}

.nav-bar.nav-scrolled {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-primary);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-emoji {
  color: white;
  font-size: 1.25rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.nav-links {
  display: none;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 1rem;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-register-btn {
  padding: 0.5rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.nav-register-btn:hover {
  background-color: var(--color-primary-dark);
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 1.5rem 60px;
  background: linear-gradient(to bottom, #ffffff, #fef3c7);
}

.hero-container {
  max-width: 80rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.hero-content {
  text-align: center;
}

@media (min-width: 1024px) {
  .hero-content {
    text-align: left;
  }
}

.hero-badge {
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #fef3c7;
  border-radius: 9999px;
}

.hero-badge-text {
  color: var(--color-secondary);
  font-weight: 600;
  font-size: 0.875rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem;
  }
}

.hero-title-highlight {
  color: var(--color-primary);
}

.hero-description {
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.75;
}

.hero-cta-btn {
  padding: 1rem 2rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1.125rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  font-weight: 600;
}

.hero-cta-btn:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-0.25rem);
}

/* Collage */
.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.collage-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  height: 500px;
}

.collage-item {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.collage-item:hover {
  transform: scale(1.05);
  z-index: 10;
}

.collage-item-1 {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}

.collage-item-2 {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}

.collage-item-3 {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
}

.collage-item-4 {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
}

.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* About Section */
.about-section {
  padding: 5rem 1.5rem;
  background-color: white;
}

.about-container {
  max-width: 56rem;
  margin: 0 auto;
}

.about-content-wrapper {
  background: linear-gradient(to bottom right, #fef3c7, #fed7aa);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
}

.section-divider {
  width: 5rem;
  height: 0.25rem;
  background-color: var(--color-primary);
  margin: 0 auto;
}

.about-text {
  margin-bottom: 2rem;
}

.about-paragraph {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.highlights-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.highlight-item {
  font-size: 1.125rem;
  color: #374151;
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  line-height: 1.6;
}

.highlight-item::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1.25rem;
}

.about-closing {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.8;
  font-weight: 600;
}

.about-cta-btn {
  display: block;
  margin: 0 auto;
  padding: 1rem 2.5rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.about-cta-btn:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-0.25rem);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
  background-color: #111827;
  color: white;
  padding: 2rem 1.5rem;
}

.footer-content {
  max-width: 72rem;
  margin: 0 auto;
  text-align: center;
}

.footer-copyright {
  color: #9ca3af;
  font-size: 0.875rem;
}

.admin-link {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
  padding: 0.25rem 0.5rem;
}

.admin-link:hover {
  opacity: 1;
  color: #ffffff;
}
</style>