import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { shuffle } from 'lodash';

const musicBank = window.location.origin + '/audio/';

const App = () => {
  const [playlists, setPlaylists] = useState([]);
  const audioRef = useRef(null);
  const [playindex, setPlayindex] = useState(0);
  const [isPlaying, setIsPlaying] = useState('Play');
  const [title, setTitle] = useState('');
  function getDataMusic() {
    fetch(musicBank + 'data.json', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        // shuffle playlist
        setPlaylists(
          shuffle(result.music).map((playlist) => {
            return { name: playlist.name, source: playlist.source };
          })
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getDataMusic();
  }, [playindex]);

  const playPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setTitle(playlists[playindex].name);
    setIsPlaying(audioRef.current?.paused ? 'Play' : 'Pause');
  };

  const nextPlay = () => {
    audioRef.current.pause();
    if (playindex >= playlists.length - 1) {
      setPlayindex(0);
    } else {
      setPlayindex(playindex + 1);
    }
    audioRef.current.play();
  };

  const prevPlay = () => {
    audioRef.current.pause();
    if (playindex == 0) {
      setPlayindex(0);
    } else {
      setPlayindex(playindex - 1);
    }
    audioRef.current.play();
  };

  return (
    <div className="App">
      <div className="max-w-sm rounded overflow-hidden border-2 shadow-lg p-6">
        <div>
          <div className="text-center font-semibold"> {title} </div>
          <div className="mt-2">
            <select>
              {playlists.map((playlist) => (
                <option value={playlist.source}>{playlist.name}</option>
              ))}
            </select>
          </div>
          <br />
          <audio
            style={{ display: 'none' }}
            ref={audioRef}
            controls="controls"
            src={musicBank + playlists[playindex]?.source}
            autoPlay="autoplay"
          />
          <div className="flex justify-between">
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              id="prevPlay"
              onClick={prevPlay}
            >
              Prev
            </div>
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              id="playPause"
              onClick={playPause}
            >
              {isPlaying}
            </div>
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              id="nextPlay"
              onClick={nextPlay}
            >
              Next
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default App;
