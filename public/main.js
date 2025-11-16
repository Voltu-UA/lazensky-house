// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('contact-form');

//   form.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const formData = {
//       name: form.elements['name'].value,
//       email: form.elements['email'].value,
//       message: form.elements['message'].value
//     };

//     fetch('/contacts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     })
//     .then(response => {
//       if (response.ok) {
//         alert('Дякуємо! Ваше повідомлення надіслано.');
//         form.reset();
//       } else {
//         alert('Помилка при надсиланні. Спробуйте ще раз.');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       alert('Не вдалося надіслати повідомлення.');
//     });
//   });
// });


// document.addEventListener('DOMContentLoaded', function () {
//   const btn = document.getElementById('showMoreBtn');
//   const hiddenImages = document.querySelectorAll('.hidden-image');

//   btn.addEventListener('click', () => {
//     const isHidden = getComputedStyle(hiddenImages[0]).display === 'none';

//     hiddenImages.forEach(img => {
//       img.style.display = isHidden ? 'inline-block' : 'none';
//     });

//     btn.textContent = isHidden ? 'Приховати' : 'Показати більше';
//   });
// });

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('showMoreBtn');
  const hiddenImages = document.querySelectorAll('.hidden-image');

  let isHidden = true;

  btn.addEventListener('click', () => {
    hiddenImages.forEach(img => {
      img.classList.toggle('show');
    });

    isHidden = !isHidden;
    btn.textContent = isHidden ? 'Показати більше' : 'Приховати';
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('showMorePlansBtn');
  const hiddenPlans = document.querySelectorAll('#plans .hidden-image');

  let isHidden = true;

  btn.addEventListener('click', () => {
    hiddenPlans.forEach(img => {
      img.classList.toggle('show');
    });

    isHidden = !isHidden;
    btn.textContent = isHidden ? 'Показати більше' : 'Приховати';
  });
});

window.addEventListener('DOMContentLoaded', () => {
  window.history.scrollRestoration = 'manual';
  if (window.location.hash) {
    history.replaceState(null, null, ' ');
  }
  window.scrollTo(0, 0);
});

// document.getElementById('showMoreConstructionBtn').addEventListener('click', function () {
//   document.querySelectorAll('#construction .hidden-image').forEach(el => el.classList.add('show'));
//   this.style.display = 'none';
// });

// document.addEventListener('DOMContentLoaded', function () {
//   // Map route path to section id (same names used in server)
//   const path = window.location.pathname.replace(/^\/|\/$/g, '');
//   const sectionId = path || 'about'; // default scroll target
//   const el = document.getElementById(sectionId);
//   if (el) {
//     // Slight timeout to let images/CSS settle before smooth scrolling
//     setTimeout(() => {
//       el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       // Optional: focus for accessibility
//       el.setAttribute('tabindex', '-1');
//       el.focus({ preventScroll: true });
//     }, 80);
//   }

//   // Optional: preserve previous scroll behavior on navigation
//   // Intercept clicks on internal links to keep SPA smooth scroll without reload
//   document.querySelectorAll('a[href^="/"]').forEach(a => {
//     a.addEventListener('click', function (e) {
//       const href = a.getAttribute('href');
//       // If it's an internal section route, allow default navigation (server renders same page)
//       // If you want to avoid full reloads, you could preventDefault and scroll manually,
//       // but current approach keeps server-rendered correct meta for crawlers.
//     });
//   });
// });




document.addEventListener('DOMContentLoaded', function () {
  // Resolve the path key (empty string for root)
  const rawPath = window.location.pathname.replace(/^\/|\/$/g, '');

  // Only act when there's a meaningful section path (like 'gallery', 'contact', etc.)
  if (!rawPath) return;

  const el = document.getElementById(rawPath);
  if (!el) return;

  // Scroll then replace URL so refresh returns to root
  // Delay gives the browser time to layout images/CSS before scrolling
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Accessibility: focus element without changing scroll position
    // Keep focus for keyboard users; style with :focus-visible in CSS
    el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) {}

    // After a short delay, replace history entry so refresh goes to '/'
    setTimeout(() => {
      history.replaceState(null, '', '/');
    }, 220); // tweak 150-300ms as needed for your content
  }, 80);
});



