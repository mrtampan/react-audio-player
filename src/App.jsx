import { shuffle } from 'lodash';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';

const musicBank = window.location.origin + '/audio/';

const App = () => {
  const [playlists, setPlaylists] = useState([]);
  const audioRef = useRef(null);
  const [playindex, setPlayindex] = useState(0);
  const [isPlaying, setIsPlaying] = useState('Play');
  function getDataMusic() {
    fetch(musicBank + 'data.json', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        // shuffle playlist
        if (result.music) {
          setPlaylists(
            shuffle(result.music).map((playlist) => {
              return { name: playlist.name, source: playlist.source };
            })
          );
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getDataMusic();
  }, []);

  const playPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
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

  const onChangeMusic = (e) => {
    audioRef.current.pause();
    setPlayindex(e.target.value);
    audioRef.current.play();
  };

  const handleEnded = () => {
    nextPlay();
  };

  return (
    <div className="App">
      <div className="max-w-sm rounded overflow-hidden border-2 shadow-lg p-6">
        <div>
          <div className="mt-2">
            <select onChange={(e) => onChangeMusic(e)} value={playindex}>
              {playlists.map((playlist, index) => (
                <option key={index} value={index}>
                  {playlist.name}
                </option>
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
            onEnded={handleEnded}
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
