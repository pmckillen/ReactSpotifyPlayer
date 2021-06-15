import React from "react"

const AUTH_URL = 
'https://accounts.spotify.com/authorize?\
client_id=a0bf3438b3ad4c858409f29e0bd154d8\
&response_type=code\
&redirect_uri=https://ankityande.github.io/ReactSpotifyPlayer/\
&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state'

export default function Login() {
  return (
      <a className="btn" href={AUTH_URL}>
        Login With Spotify
      </a>
  )
}