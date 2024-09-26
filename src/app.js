const express = require('express');
const path = require('path');
const router = require('../routes/router'); 
const app = express();
const PORT = 3001;

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '..', 'views'));



app.use(express.static(path.join(__dirname, '..', 'public'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      }
    }
  }));
  
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Error playing audio file');
  });

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





