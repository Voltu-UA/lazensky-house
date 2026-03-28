const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  immutable: false,
  setHeaders: (res, filePath) => {
    // Avoid stale UI during active development.
    if (/\.(css|js|html)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store, max-age=0');
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Section keys that map to element IDs in index.ejs
const sections = ['', 'about', 'construction', 'gallery', 'plans', 'benefits', 'contact'];

function loadConstructionUpdates() {
  const dataPath = path.join(__dirname, 'data', 'construction-updates.json');
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load construction updates:', error.message);
    return [];
  }
}

// Create routes for each section (/, /about, /gallery, /contact, ...)
sections.forEach(key => {
  const route = key === '' ? '/' : `/${key}`;
  app.get(route, (req, res) => {
    res.render('index', {
      page: key || 'home',
      assetVersion: Date.now(),
      constructionUpdates: loadConstructionUpdates()
    });
  });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'name, email, and message are required'
    });
  }

  console.log('Received contact form submission:', {
    name: String(name).trim(),
    email: String(email).trim(),
    messageLength: String(message).trim().length
  });

  // TODO: Persist and/or forward submissions to CRM/email service.
  return res.status(200).json({ ok: true, message: 'Thank you for your message!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT}`);
});
