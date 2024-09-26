const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const songsController = require('../controllers/songsController');
const uploadController = require('../controllers/uploadController');
const playlistController = require('../controllers/playlistController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const uploads = multer({ storage: storage });

// Route for root path
router.get('/', (req, res) => {
    res.redirect('/songs');  // Redirect to songs list or use res.render('index') if you have a homepage
});

// Songs and other routes
router.get('/songs', songsController.getAllSongs);
router.get('/search', songsController.searchSong);
router.get('/play/:id', songsController.playSong);
router.post('/delete/:id', songsController.deleteSong)

// Upload routes
router.get('/upload', uploadController.showUploadForm);
router.post('/upload', uploads.single('song'), uploadController.upload);



module.exports = router;


