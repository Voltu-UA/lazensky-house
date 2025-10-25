const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Received contact form submission: Name=${name}, Email=${email}, Message=${message}`);
  // handle the data (e.g., save to DB, send email)
  res.send('Thank you for your message!');
});



app.listen(3000, () => {
  console.log('Server is listening on: http://localhost:3000');
});
