import "./App.scss";
import { Rocket } from "lucide-react";
import { codeChallenge, generateCodeVerifer } from "./utils/index.js";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

const App = () => {
  const getAuthorizations = () => {
    const targetURL = new URL("https://accounts.spotify.com/authorize");
    const params = {
      response_type: "code",
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: "user-read-private playlist-read-private",
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: "http://localhost:5173/playlists",
    };
    targetURL.search = new URLSearchParams(params).toString();
    window.location.href = targetURL.toString();
  };

  useEffect(() => {
    if (!secureLocalStorage.getItem("codeVerifier")) {
      generateCodeVerifer();
    }
  }, []);

  return (
    <div className="app">
      <h1>
        Understanding OAuth with Spotify API (Authorization Code with PKCE Flow)
      </h1>
      <h2>
        For practical purposes, this application just displays the playlists of
        a Spotify user. <br /> By clicking a the button bellow, you will be
        redirected to Spotify to give your consent to access your playlists.
      </h2>
      <button onClick={getAuthorizations}>
        Go <Rocket size={16} />
      </button>
    </div>
  );
};

export default App;
