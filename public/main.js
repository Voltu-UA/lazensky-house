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
