import Login from "./login"
import Player from "./player"

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return code ? <Player code={code} /> : <Login />
}

export default App