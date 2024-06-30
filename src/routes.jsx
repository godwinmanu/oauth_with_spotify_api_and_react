import { useRoutes } from "react-router-dom";
import App from "./App.jsx";
import PlayLists from "./Pages/Playlists/index.jsx";
import Tracks from "./Pages/Tracks/index.jsx";
import NotFound from "./Pages/404/index.jsx";

export const Routes = () => {
  const routes = useRoutes([
    { path: "/", element: <App /> },
    {
      path: "/playlists",
      children: [
        {
          index: true,
          element: <PlayLists />,
        },
        {
          path: ":playlistId/tracks",
          element: <Tracks />,
        },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
};
