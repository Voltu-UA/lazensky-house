document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: form.elements['name'].value,
      email: form.elements['email'].value,
      message: form.elements['message'].value
    };

    fetch('/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        alert('Дякуємо! Ваше повідомлення надіслано.');
        form.reset();
      } else {
        alert('Помилка при надсиланні. Спробуйте ще раз.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Не вдалося надіслати повідомлення.');
    });
  });
});
