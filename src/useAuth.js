import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  let baseUrl = "https://spotify-player-api.herokuapp.com/"
  
  useEffect(() => {
    axios
      .post(baseUrl, {
        code,
      })
      .then(res => {
        // console.log(res.data)
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, "/player")
      })
      .catch((error) => {
        console.log(error)
        // window.location = "/"
      })
  }, [code])

  return accessToken
}