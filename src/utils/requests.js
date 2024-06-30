import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

const preAuthClient = axios.create({
  baseURL: import.meta.env.VITE_PREAUTH_API_BASE_URL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

export const get = async (uri) => {
  try {
    const { data } = await authClient.get(uri);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const requestAccessToken = async (authorizationCode) => {
  try {
    const payload = {
      client_id: import.meta.env.VITE_CLIENT_ID,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: "http://localhost:5173/playlists",
      code_verifier: secureLocalStorage.getItem("codeVerifier"),
    };
    const response = await preAuthClient.post("/api/token ", payload);
    if (response.status === 200) {
      const tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
      secureLocalStorage.setItem("tokens", tokens);
    }
  } catch (e) {
    console.log(e);
  }
};

export const refreshToken = async () => {
  try {
    const response = await preAuthClient.post("/api/token", {
      grant_type: "refresh_token",
      refresh_token: getTokens()?.refreshToken,
      client_id: import.meta.env.VITE_CLIENT_ID,
    });
    if (response.status === 200) {
      const tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
      secureLocalStorage.setItem("tokens", tokens);
    }
    return response.data.access_token;
  } catch (e) {
    console.log(e);
  }
};

export const getTokens = () => {
  return secureLocalStorage.getItem("tokens");
};

export const getUserPlaylists = async () => {
  try {
    const response = await authClient.get("/me/playlists");
    if (response.status === 200) {
      return response.data.items;
    }
  } catch (e) {
    console.log(e);
  }
};

authClient.interceptors.request.use(
  function (config) {
    const token = getTokens()?.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

authClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      const token = await refreshToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  },
);
