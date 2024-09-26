const db = require('../config/db');

exports.showUploadForm = (req, res) => {
    res.render('upload');
};

exports.upload = async (req, res) => {
    const { title, artist, album } = req.body;
    const songUrl = `/upload/${req.file.filename}`;  // Use the correct file path

    try {
        await db.query('INSERT INTO tablesongs (title, artist, album, song_url) VALUES (?, ?, ?, ?)', [title, artist, album, songUrl]); // Use songUrl here
        res.redirect('/songs'); // Redirect to the list of songs after upload
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading song');
    }
};
