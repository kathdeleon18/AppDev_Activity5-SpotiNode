const db = require('../config/db');

exports.showUploadForm = (req, res) => {
    res.render('upload');
};

exports.upload = async (req, res) => {
    const { title, artist, album } = req.body;
    const songUrl = `/upload/${req.file.filename}`; 

    try {
        await db.query('INSERT INTO tablesongs (title, artist, album, song_url) VALUES (?, ?, ?, ?)', [title, artist, album, songUrl]); 
        res.redirect('/songs'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading song');
    }
};
