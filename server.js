const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Section keys that map to element IDs in index.ejs
const sections = ['', 'about', 'construction', 'gallery', 'plans', 'benefits', 'contact'];

// Create routes for each section (/, /about, /gallery, /contact, ...)
sections.forEach(key => {
  const route = key === '' ? '/' : `/${key}`;
  app.get(route, (req, res) => {
    res.render('index', { page: key || 'home' });
  });
});

// Contact form handler remains the same
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Received contact form submission: Name=${name}, Email=${email}, Message=${message}`);
  // TODO: save/send message
  res.send('Thank you for your message!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT}`);
});
