const loginBtn = document.querySelector('.login-btn');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.getElementById('auth-modal');
const closeBtn = document.querySelector('.close');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const popup = document.getElementById('success-popup');
const popupMessage = document.getElementById('popup-message');
const mainContent = document.getElementById('main-content');

// Open modal
loginBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  showLogin(); // show login form by default
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Switch tabs
loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);
switchToSignup.addEventListener('click', showSignup);
switchToLogin.addEventListener('click', showLogin);

function showLogin() {
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
}

function showSignup() {
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
}

// Show main content function
function showContent() {
  mainContent.style.display = 'block';
  loginBtn.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
}

// Handle form submissions
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  localStorage.setItem('loggedIn', 'true'); // save login status
  modal.style.display = 'none';
  showPopup('Login Successful!');
  showContent();
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  localStorage.setItem('loggedIn', 'true'); // save login status
  modal.style.display = 'none';
  showPopup('Sign Up Successful!');
  showContent();
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  window.location.reload();
});

// Show popup function
function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.opacity = '1';
  popup.style.transform = 'translate(-50%, -50%) scale(1)';
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
  }, 2000);
}
// Existing code above remains the same...

// Restrict "Discover More" if not logged in
const discoverBtn = document.querySelector('.btn-hero');

discoverBtn.addEventListener('click', (e) => {
  if (localStorage.getItem('loggedIn') !== 'true') {
    e.preventDefault();      // prevent scrolling
    modal.style.display = 'flex'; // show login modal
    showLogin();             // make sure login form is active
  }
});


// Check login status on page load
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('loggedIn') === 'true'){
    showContent(); // show content if already logged in
  } else {
    modal.style.display = 'flex';
  }
});
