// Smooth scroll for buttons with data-target
document.querySelectorAll('.js-scroll-to').forEach(btn => {
  btn.addEventListener('click', e => {
    const target = btn.getAttribute('data-target');
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// FAQ <details> – allow only one open per column (optional UX)
document.querySelectorAll('#faq .grid > div').forEach(column => {
  const items = column.querySelectorAll('details.faq');
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        items.forEach(o => o !== d && (o.open = false));
      }
    });
  });
});

// Captcha generation (4-digit) for main form
const captchaText = document.getElementById('captchaText');
function generateCaptcha(){
  const code = Math.floor(1000 + Math.random() * 9000);
  captchaText.textContent = String(code);
}
generateCaptcha();

// Enable submit buttons only when consent checked
function bindConsent(formSelector, checkboxSelector, buttonSelector, msgSelector){
  const form = document.querySelector(formSelector);
  if (!form) return;
  const consent = form.querySelector(checkboxSelector);
  const submitBtn = form.querySelector(buttonSelector);
  const msg = form.querySelector(msgSelector);

  if (consent && submitBtn){
    const toggle = () => { submitBtn.disabled = !consent.checked; };
    consent.addEventListener('change', toggle);
    toggle();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      msg.textContent = '';

      // basic validations
      form.querySelectorAll('input[required]').forEach(inp => {
        if (!inp.value.trim()) ok = false;
        if (ok && inp.name.match(/phone|mobile/i) && inp.pattern){
          const re = new RegExp(inp.pattern);
          if (!re.test(inp.value.trim())) ok = false;
        }
      });

      // captcha check for main form
      if (form.matches('.form')){
        const capInput = form.querySelector('input[name="captcha"]');
        if (!capInput || capInput.value.trim() !== captchaText.textContent.trim()){
          ok = false;
          msg.textContent = 'Invalid captcha. Please try again.';
          generateCaptcha();
          capInput && (capInput.value = '');
        }
      }

      if (!ok){
        if (!msg.textContent) msg.textContent = 'Please fill all fields correctly.';
        return;
      }

      submitBtn.disabled = true;
      msg.textContent = 'Thanks! We will contact you shortly.';
      setTimeout(() => {
        submitBtn.disabled = false;
        form.reset();
        if (form.matches('.form')) generateCaptcha();
        toggle();
      }, 1200);
    });
  }
}
bindConsent('.form', '#consent', 'button[type="submit"]', '#formMsg');
bindConsent('#miniForm', '#miniConsent', 'button[type="submit"]', '#miniMsg');

// Reviews horizontal scroller
(function setupReviewScroller(){
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  const prev = track.parentElement.querySelector('.prev');
  const next = track.parentElement.querySelector('.next');

  const cardWidth = 302 + 24; // width + gap
  const scrollBy = () => track.scrollBy({ left: cardWidth, behavior: 'smooth' });

  prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth, behavior: 'smooth' }));
  next.addEventListener('click', scrollBy);

  // Keyboard support
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scrollBy();
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
})();

// Learn more buttons
document.querySelectorAll('.js-learn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('This would open a detailed page or modal with more information.');
  });
});

// Buy Now (demo)
document.querySelectorAll('.js-buy').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Plan added to cart (demo). Proceed to checkout in your implementation.');
  });
});
