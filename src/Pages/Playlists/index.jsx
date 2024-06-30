import "./index.scss";
import Card from "../../Components/Card/index.jsx";
import { useEffect, useState } from "react";
import { getUserPlaylists, requestAccessToken } from "../../utils/requests.js";
import { useSearchParams } from "react-router-dom";

const PlayLists = () => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [searchParams] = useSearchParams();

  const setUp = async (code) => {
    await requestAccessToken(code);
    const playlists = await getUserPlaylists();
    console.log(playlists);
    setUserPlaylists(playlists);
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setUp(code);
    }
  }, []);

  return (
    <>
      {userPlaylists && userPlaylists.length ? (
        <div className="playlists">
          {userPlaylists.map((playlist) => {
            return (
              <Card
                key={playlist.id}
                imgLink={playlist.images[0].url}
                title={playlist.name}
              />
            );
          })}
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};
export default PlayLists;
