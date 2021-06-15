import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlayCircle, faStepForward, faStepBackward } from "@fortawesome/free-solid-svg-icons";
import UseAuth from "./useAuth"
import SpotifyWebApi from "spotify-web-api-node"
import "./style.css"

const spotifyApi = new SpotifyWebApi({
  clientId: "a0bf3438b3ad4c858409f29e0bd154d8",
})

export default function Player({ code }) {

  const accessToken = UseAuth(code);

  const [playing, setPlaying] = useState()
  const [name, setName] = useState()
  const [album, setAlbum] = useState()
  const [artist, setArtist] = useState()
  const [image, setImage] = useState()
  const [progress, setProgress] = useState()
  const [trackLen, setTrackLen] = useState()

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
    getPlaybackInfo()
  }, [accessToken])

  useEffect(() => {
    const intervalId = setInterval(() => {
      getPlaybackInfo()
      updateProgress()
    }, 1000)

    return () => clearInterval(intervalId);
  })

  const getPlaybackInfo = async () => {
    if (accessToken) {
      spotifyApi.getMyCurrentPlaybackState()
        .then(function (data) {
          if(data && data.body){
            setPlaying(data.body.is_playing)
            setName(data.body.item.name);
            setAlbum(data.body.item.album.name);
            setArtist(data.body.item.artists[0].name);
            setImage(data.body.item.album.images[0].url);
            if(data.body && data.body.progress_ms) setProgress(data.body.progress_ms)
            setTrackLen(data.body.item.duration_ms)
          }else{
            alert('Make sure you are playing something in Spotify')
          }
        }, function (err) {
          console.log('Something went wrong getting playback info', err);
        });
    }
  }

  const togglePlay = () => {
    if (playing) {
      spotifyApi.pause()
        .then(function () {
          console.log('Playback paused');
        }, function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        });
    } else {
      spotifyApi.play()
        .then(function () {
          console.log('Playback started');
        }, function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        });
    }
    // setPlaying(!playing)
  }

  const next = () => {
    // Skip User’s Playback To Next Track
    spotifyApi.skipToNext()
      .then(function () {
        console.log('Skip to next');
      }, function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        alert('You need a premium account for that', err);
      });
  }

  const prev = () => {
    // Skip User’s Playback To Previous Track 
    spotifyApi.skipToPrevious()
      .then(function () {
        console.log('Skip to previous');
      }, function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        alert('You need a premium account for that', err);
      });
  }


  const card = useRef();
  const mouseMove = (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 20;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 20;
    card.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  }
  const mouseEnter = () => {
    card.current.style.transition = "none";
  }
  const mouseLeave = () => {
    card.current.style.transition = "all 0.5s ease"
    card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  const progressBar = useRef();
  const updateProgress = async () => {
    if (progress && trackLen) {
      progressBar.current.style.width = `${progress * 100 / trackLen}%`;
    }
  }

  return (
    <body>

      <div class="container"
        onMouseEnter={() => mouseEnter()}
        onMouseLeave={() => mouseLeave()}
        onMouseMove={(e) => mouseMove(e)}
      >
        <div class="card" ref={card}>

          <div class="now-playing__img">
            <img class="playing_img" src={image} />
          </div>

          <div class="now-playing__info">
            <div class="now-playing__name">{name}</div>
            <div class="now-playing__album">{album}</div>
            <div class="now-playing__artist">{artist}</div>

            <div class="progress">
              <div class="progress__bar" ref={progressBar}></div>
            </div>

            <div class="playback">
              <FontAwesomeIcon style={{ cursor: "pointer", fontSize: "2rem", marginRight: 10 }} icon={faStepBackward} onClick={prev} />
              <FontAwesomeIcon style={{ cursor: "pointer", fontSize: "3rem", marginRight: 10 }} icon={playing ? faPauseCircle : faPlayCircle} onClick={togglePlay} />
              <FontAwesomeIcon style={{ cursor: "pointer", fontSize: "2rem", marginRight: 10 }} icon={faStepForward} onClick={next} />
            </div>

          </div>

        </div>

      </div>

      <div class="background" style={{ backgroundImage: `url(${image})` }}></div>

    </body>
  )
}
