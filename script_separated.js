// ======= Elements (preserve existing behavior)
const loginTrigger = document.querySelectorAll('.login-trigger');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.getElementById('auth-modal');
const modalClose = document.getElementById('modalClose');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const popup = document.getElementById('success-popup');
const heroVisual = document.getElementById('visual');
const siteNav = document.getElementById('siteNav');
const themeToggle = document.getElementById('themeToggle');
const headerHero = document.querySelector('header.hero');
const discoverBtn = document.getElementById('discoverBtn');

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

function showPopup(message){
  popup.textContent = message;
  popup.style.opacity = '1';
  popup.style.transform = 'translateX(-50%) scale(1)';
  popup.style.pointerEvents = 'auto';
  setTimeout(()=>{ popup.style.opacity='0'; popup.style.pointerEvents='none'; }, 2200);
}

// Modal + focus trap
let lastFocused = null;
function openModal(){
  lastFocused = document.activeElement;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  setTimeout(()=> loginForm.querySelector('input')?.focus(), 120);
  trapFocus(modal);
}
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  releaseFocusTrap();
  lastFocused?.focus?.();
}

let focusable, firstFocusable, lastFocusable, handleTrap;
function trapFocus(container){
  focusable = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(focusable.length === 0) return;
  firstFocusable = focusable[0]; lastFocusable = focusable[focusable.length - 1];
  handleTrap = function(e){
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === firstFocusable){
        e.preventDefault(); lastFocusable.focus();
      } else if(!e.shiftKey && document.activeElement === lastFocusable){
        e.preventDefault(); firstFocusable.focus();
      }
    } else if(e.key === 'Escape'){
      closeModal();
    }
  };
  document.addEventListener('keydown', handleTrap);
}
function releaseFocusTrap(){
  if(handleTrap) document.removeEventListener('keydown', handleTrap);
  focusable = null;
}

// Tabs
function showLogin(){
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginTab.setAttribute('aria-selected','true');
  signupTab.setAttribute('aria-selected','false');
}
function showSignup(){
  signupForm.style.display = 'flex';
  loginForm.style.display = 'none';
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupTab.setAttribute('aria-selected','true');
  loginTab.setAttribute('aria-selected','false');
}

// Connect UI
document.querySelectorAll('.login-trigger').forEach(btn => btn.addEventListener('click', () => { openModal(); showLogin(); }));
document.getElementById('loginOpen')?.addEventListener('click', () => { openModal(); showLogin(); });
loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);
switchToSignup.addEventListener('click', () => { showSignup(); });
switchToLogin.addEventListener('click', () => { showLogin(); });
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

// Fake auth
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const loginEmail = document.getElementById('loginEmail').value.trim();
  
  // Validate email format
  if (!validateEmail(loginEmail)) {
    showPopup('Please enter a valid email address');
    document.getElementById('loginEmail').focus();
    return;
  }
  
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', loginEmail);
  closeModal();
  showPopup('Login Successful!');
  updateAuthUI(true);
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const signupEmail = document.getElementById('signupEmail').value.trim();
  const signupName = document.getElementById('signupName').value.trim();
  
  // Validate email format
  if (!validateEmail(signupEmail)) {
    showPopup('Please enter a valid email address');
    document.getElementById('signupEmail').focus();
    return;
  }
  
  // Validate name
  if (signupName.length < 2) {
    showPopup('Please enter a valid name');
    document.getElementById('signupName').focus();
    return;
  }
  
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', signupEmail);
  localStorage.setItem('userName', signupName);
  closeModal();
  showPopup('Account created!');
  updateAuthUI(true);
});
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  showPopup('Logged out');
  updateAuthUI(false);
  window.scrollTo({top:0, behavior:'smooth'});
});
function updateAuthUI(loggedIn){
  if(loggedIn){
    logoutBtn.style.display = 'inline-flex';
    document.querySelectorAll('.login-trigger').forEach(n => n.style.display = 'none');
    document.getElementById('loginOpen') && (document.getElementById('loginOpen').style.display = 'none');
  } else {
    logoutBtn.style.display = 'none';
    document.querySelectorAll('.login-trigger').forEach(n => n.style.display = 'inline-flex');
    document.getElementById('loginOpen') && (document.getElementById('loginOpen').style.display = 'inline-block');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateAuthUI(localStorage.getItem('loggedIn') === 'true');

  // Email validation for login form
  const loginEmail = document.getElementById('loginEmail');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginEmailSuccess = document.getElementById('loginEmailSuccess');
  
  if (loginEmail) {
    loginEmail.addEventListener('input', (e) => {
      const email = e.target.value.trim();
      
      if (email === '') {
        loginEmailError.classList.remove('show');
        loginEmailSuccess.classList.remove('show');
      } else if (validateEmail(email)) {
        loginEmailError.classList.remove('show');
        loginEmailSuccess.classList.add('show');
        loginEmail.style.borderColor = '#28b463';
      } else {
        loginEmailSuccess.classList.remove('show');
        loginEmailError.classList.add('show');
        loginEmail.style.borderColor = '#ef4444';
      }
    });
    
    loginEmail.addEventListener('blur', (e) => {
      const email = e.target.value.trim();
      if (email !== '' && !validateEmail(email)) {
        loginEmailError.classList.add('show');
        loginEmail.style.borderColor = '#ef4444';
      }
    });
  }
  
  // Email validation for signup form
  const signupEmail = document.getElementById('signupEmail');
  const signupEmailError = document.getElementById('signupEmailError');
  const signupEmailSuccess = document.getElementById('signupEmailSuccess');
  
  if (signupEmail) {
    signupEmail.addEventListener('input', (e) => {
      const email = e.target.value.trim();
      
      if (email === '') {
        signupEmailError.classList.remove('show');
        signupEmailSuccess.classList.remove('show');
      } else if (validateEmail(email)) {
        signupEmailError.classList.remove('show');
        signupEmailSuccess.classList.add('show');
        signupEmail.style.borderColor = '#28b463';
      } else {
        signupEmailSuccess.classList.remove('show');
        signupEmailError.classList.add('show');
        signupEmail.style.borderColor = '#ef4444';
      }
    });
    
    signupEmail.addEventListener('blur', (e) => {
      const email = e.target.value.trim();
      if (email !== '' && !validateEmail(email)) {
        signupEmailError.classList.add('show');
        signupEmail.style.borderColor = '#ef4444';
      }
    });
  }

  // reveal animations
  setTimeout(()=> {
    document.querySelectorAll('.reveal').forEach((el,i) => {
      setTimeout(()=> el.classList.add('visible'), 80*i);
    });
  }, 160);

  // parallax hero subtle effect
  if(window.innerWidth > 900 && heroVisual){
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth/2) / (window.innerWidth/2);
      const y = (e.clientY - window.innerHeight/2) / (window.innerHeight/2);
      heroVisual.style.transform = `translate(${x*6}px, ${y*4}px) scale(1.01)`;
    });
  }

  // theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.setAttribute('aria-pressed', (savedTheme === 'dark') ? 'true' : 'false');

  // Adjust header top spacing based on the nav's actual height
  function adjustHeaderMargin() {
    if (!headerHero) return;
    const navRect = siteNav.getBoundingClientRect();
    headerHero.style.marginTop = (Math.ceil(navRect.height) + 12) + 'px';
  }
  adjustHeaderMargin();
  window.addEventListener('resize', adjustHeaderMargin);
  window.addEventListener('orientationchange', adjustHeaderMargin);

  // Restrict primary nav features to logged-in users (Home always allowed)
  const primaryLinks = document.querySelectorAll('#primaryNav a');
  primaryLinks.forEach(link => {
    link.addEventListener('click', (ev) => {
      const href = link.getAttribute('href') || '';
      // allow home link (hello.html or '#') without login
      const isHome = href === '' || href === '#' || href.endsWith('hello.html');
      if(isHome) return; // allow navigation

      // if not logged in, block and show modal/login prompt
      if(localStorage.getItem('loggedIn') !== 'true'){
        ev.preventDefault();
        showPopup('Please login to access this feature');
        // open login modal to encourage sign-in
        openModal();
        showLogin();
        return false;
      }
      // otherwise allow the click to proceed
    });
  });

  // Restrict "View All" link for festivals (same restriction as primary nav)
  const viewAllLink = document.querySelector('.view-all-link');
  if(viewAllLink){
    viewAllLink.addEventListener('click', (ev) => {
      if(localStorage.getItem('loggedIn') !== 'true'){
        ev.preventDefault();
        showPopup('Please login to access this feature');
        openModal();
        showLogin();
        return false;
      }
      // otherwise allow the click to proceed
    });
  }
});

// allow ESC to close
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

// navbar scrolled
window.addEventListener('scroll', () => {
  if(window.scrollY > 40) siteNav.classList.add('scrolled'); else siteNav.classList.remove('scrolled');
});

// theme toggle
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? '' : 'dark';
  if(next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', next);
  themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
  showPopup(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
});

// Discover now scrolls to Introduction
discoverBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const introEl = document.getElementById('introduction');
  if(introEl) introEl.scrollIntoView({behavior:'smooth', block:'start'});
});

(function enableFocusOutline(){
  document.body.addEventListener('keydown', (ev) => {
    if(ev.key === 'Tab') document.documentElement.classList.add('show-focus');
  }, { once: true });
})();

/* ===== NEW: Interactive accordion + site-wide reviews (only scripts for these blocks) ===== */
(function initQAandSiteReviews(){
  // Accordion behavior
  function toggleFaq(qEl){
    const parent = qEl.parentElement;
    const answer = parent.querySelector('.faq-a');
    const arrow = qEl.querySelector('.faq-arrow');
    const expanded = qEl.getAttribute('aria-expanded') === 'true';

    // close other open items
    document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
      if(other !== qEl){
        other.setAttribute('aria-expanded','false');
        other.parentElement.querySelector('.faq-a')?.classList.remove('show');
        other.querySelector('.faq-arrow')?.classList.remove('open');
      }
    });

    if(expanded){
      qEl.setAttribute('aria-expanded','false');
      answer.classList.remove('show');
      arrow.classList.remove('open');
    } else {
      qEl.setAttribute('aria-expanded','true');
      answer.classList.add('show');
      arrow.classList.add('open');
    }
  }
  document.querySelectorAll('.faq-q').forEach(q => {
    q.setAttribute('role','button');
    q.setAttribute('tabindex','0');
    q.setAttribute('aria-expanded','false');
    q.addEventListener('click', () => toggleFaq(q));
    q.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaq(q); }
      if(e.key === 'ArrowDown'){ e.preventDefault(); const next = q.parentElement.nextElementSibling; next?.querySelector('.faq-q')?.focus(); }
      if(e.key === 'ArrowUp'){ e.preventDefault(); const prev = q.parentElement.previousElementSibling; prev?.querySelector('.faq-q')?.focus(); }
    });
  });

  // SITE RATING: wire elements present in the new Give Rating UI
  const starEls = document.querySelectorAll('#siteStars .rating-star');
  const submitBtn = document.getElementById('siteSubmit') || document.querySelector('.btn-send') || document.getElementById('siteSubmit');
  const avgEl = document.getElementById('siteAvg');
  const countEl = document.getElementById('siteCount');
  const confetti = document.getElementById('confettiContainer');

  // prepare confetti pieces (not visible in this design but left for compatibility)
  if(confetti && confetti.children.length === 0){
    const colors = ['#ff8a00','#ffb35b','#ffd28a','#ffe8c8','#ff9b3a'];
    for(let i=0;i<18;i++){
      const s = document.createElement('span');
      s.style.left = (20 + Math.random()*260) + 'px';
      s.style.background = colors[i % colors.length];
      s.style.transform = `rotate(${Math.random()*360}deg)`;
      confetti.appendChild(s);
    }
  }

  // load stored aggregated ratings
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem('gonepal_site_rating') || 'null'); } catch(e){ stored = null; }
  let ratingData = stored && typeof stored.sum === 'number' && typeof stored.count === 'number' && stored.breakdown ? stored : { sum:0, count:0, breakdown: {1:0,2:0,3:0,4:0,5:0} };
  let selected = null;

  function updateDisplay(){
    if(!countEl) return;
    if(ratingData.count === 0){
      if(avgEl) avgEl.textContent = '—';
      countEl.textContent = 'No ratings yet';
    } else {
      const avg = ratingData.sum / ratingData.count;
      if(avgEl) avgEl.textContent = avg.toFixed(1);
      countEl.textContent = ratingData.count + ' rating' + (ratingData.count > 1 ? 's' : '');
    }
  }

  // star interactions (visual, selection)
  starEls.forEach(st => {
    st.setAttribute('tabindex','0');
    st.addEventListener('mouseenter', () => {
      const v = Number(st.dataset.value);
      starEls.forEach(s => s.classList.toggle('hover', Number(s.dataset.value) <= v));
    });
    st.addEventListener('mouseleave', () => starEls.forEach(s => s.classList.remove('hover')));
    st.addEventListener('click', () => {
      selected = Number(st.dataset.value);
      starEls.forEach(s => {
        const val = Number(s.dataset.value);
        if(val <= selected){
          s.classList.add('selected');
          s.classList.remove('unfilled');
        } else {
          s.classList.remove('selected');
          s.classList.add('unfilled');
        }
        s.setAttribute('aria-checked', (Number(s.dataset.value) === selected).toString());
      });
    });
    st.addEventListener('keydown', (e) => {
      const curr = Number(document.activeElement.dataset.value);
      if(e.key === 'ArrowRight' || e.key === 'ArrowUp'){ e.preventDefault(); const next = Math.min(5, curr+1); document.querySelector('#siteStars .rating-star[data-value="'+next+'"]')?.focus(); }
      if(e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ e.preventDefault(); const prev = Math.max(1, curr-1); document.querySelector('#siteStars .rating-star[data-value="'+prev+'"]')?.focus(); }
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); selected = curr; starEls.forEach(s => { const val = Number(s.dataset.value); if(val <= selected){ s.classList.add('selected'); s.classList.remove('unfilled'); } else { s.classList.remove('selected'); s.classList.add('unfilled'); } }); }
    });
  });

  // submit action: reuse existing localStorage model (sum,count,breakdown)
  (submitBtn||{}).addEventListener && submitBtn.addEventListener('click', (ev) => {
    // require login before accepting rating
    if(localStorage.getItem('loggedIn') !== 'true'){
      showPopup('First Login/Signup for rating');
      // reset visual selection so user doesn't think rating was accepted
      selected = null;
      starEls.forEach(s => {
        s.classList.remove('selected','hover');
        s.classList.add('unfilled');
        s.removeAttribute('aria-checked');
      });
      // open login modal
      openModal();
      showLogin();
      return;
    }
    if(!selected){ showPopup('Please select a star rating first'); return; }
    if(localStorage.getItem('gonepal_site_voted') === 'true'){ showPopup('You have already rated the site'); return; }

    ratingData.sum = (ratingData.sum || 0) + selected;
    ratingData.count = (ratingData.count || 0) + 1;
    ratingData.breakdown[selected] = (ratingData.breakdown[selected] || 0) + 1;
    localStorage.setItem('gonepal_site_rating', JSON.stringify(ratingData));
    localStorage.setItem('gonepal_site_voted', 'true');

    updateDisplay();
    showPopup('Thanks — your site rating is recorded!');

    // disable submit visually
    try{o.
      submitBtn.disabled = true;
      if(submitBtn.classList.contains('btn-send')) submitBtn.textContent = 'Thanks for rating!';
      else submitBtn.textContent = 'Thankyou for rating.';
      submitBtn.style.opacity = '0.75';
    } catch(e){}

    // small confetti burst (if present)
    if(confetti){
      confetti.classList.remove('explode');
      void confetti.offsetWidth;
      confetti.classList.add('explode');
      setTimeout(()=> confetti.classList.remove('explode'), 1200);
    }
  });

  // initialize display
  updateDisplay();

  // if previously voted, reflect state
  if(localStorage.getItem('gonepal_site_voted') === 'true'){
    try{
      submitBtn.disabled = true;
      submitBtn.textContent = 'Thankyou for rating.';
      submitBtn.style.opacity = '0.85';
    }catch(e){}
    
  }
})();
