exports.showPlaylists = (req, res) => {
 
    const playlists = [
        { songTitle: 'Chill Vibes', songDescription: 'Relax and unwind' },
        { songTitle: 'Workout Hits', songDescription: 'Get pumped up!' }
    ];
  
    res.render('playlist', { playlists });
  };
  
  // Array to store playlists temporarily
  let playlists = [
    { songTitle: 'Chill Vibes', songDescription: 'Relax and unwind' },
    { songTitle: 'Workout Hits', songDescription: 'Get pumped up!' }
  ];
  
  // Show playlists
  exports.showPlaylists = (req, res) => {
    res.render('playlist', { playlists });
  };
  
  // Add a new playlist
  exports.addPlaylist = (req, res) => {
    const { songtTitle, songDescription } = req.body;
    playlists.push({ songtTitle, songDescription });  // Add new playlist to array
    res.redirect('/playlist');  // Redirect to playlist page to show updated list
  };