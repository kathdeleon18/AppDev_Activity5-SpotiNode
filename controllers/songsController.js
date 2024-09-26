const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const getAlbumArt = async (songTitle, artistName) => {
    const fetch = await import('node-fetch'); 
    const response = await fetch.default(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName + ' ' + songTitle)}&entity=song&limit=1`);
    const data = await response.json();
    return data.results[0]?.artworkUrl100 || '/path/to/default_album_art.jpg';
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.getAllSongs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tablesongs');
        res.render('songs', { songs: rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.searchSong = async (req, res) => {
    const { query } = req.query;
    try {
        const [rows] = await db.query('SELECT * FROM tablesongs WHERE songTitle LIKE ? OR songArtist LIKE ?', [`%${query}%`, `%${query}%`]);
        res.render('songs', { songs: rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.playSong = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM tablesongs WHERE id = ?', [id]);
        if (rows.length > 0) {
            const song = rows[0];
            const albumArtUrl = await getAlbumArt(song.songTitle, song.songArtist);

             const [previousSong] = await db.query('SELECT id FROM tablesongs WHERE id < ? ORDER BY id DESC LIMIT 1', [id]);
             const [nextSong] = await db.query('SELECT id FROM tablesongs WHERE id > ? ORDER BY id ASC LIMIT 1', [id]);
 
             const previousSongId = previousSong[0] ? previousSong[0].id : song.id; 
             const nextSongId = nextSong[0] ? nextSong[0].id : song.id;
 
             res.render('player', { 
                 song, 
                 previousSongId, 
                 nextSongId,
                 albumArtUrl: albumArtUrl
             });

        } else {
            res.status(404).send('Song Not Found');
        }
        console.log(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.renderUploadPage = (req, res) => {
    res.render('upload');
};

exports.uploadSongs = [
    upload.single('song'),
    async (req, res) => {
        const { songTitle, songArtist, songAlbum } = req.body;
        const songUrl = `/uploads/${req.file.filename}`;

        try {
            const [result] = await db.query('INSERT INTO tablesongs (songTitle, songArtist, songAlbum, songUrl) VALUES (?, ?, ?, ?)', [songTitle, songArtist, songAlbum, songUrl]);
            res.redirect('/songs'); 
        } catch (error) {
            console.error(error);
            res.status(500).send('Error uploading song');
        }
    }
];

exports.deleteSong = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM tbl_spotifyyy WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.redirect('/songs'); // Redirect to songs list after deletion
        } else {
            res.status(404).send('Song Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};