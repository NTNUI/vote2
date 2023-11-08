import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "./auth";

export const axiosNotIntercepted = axios.create();
axiosNotIntercepted.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axiosNotIntercepted.defaults.withCredentials = true;

export const setupInterceptors = () => {
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState(false);

  // Using a useEffect for using the navigate hook, since it can't be used outside of a component (in the interceptor)
  useEffect(() => {
    if (tokenExpired) {
      navigate("/");
      localStorage.setItem("isLoggedIn", "false");
      setTokenExpired(false);
    }
  }, [tokenExpired]);

  // This is an interceptor that will run every time a request fails.
  // It will try to refresh the access token and retry the original request.
  axios.interceptors.response.use(
    function (response) {
      // If the request is successful, no need to retry
      return response;
    },
    function (error) {
      return (
        // Update the Access Token, this request is not intercepted (avoiding recursion, and return an error if it fails)
        refreshAccessToken()
          .then(() => {
            // Retry the original request with the updated token
            return axios(error.config);
          })
          .catch((refreshError) => {
            // Handle token refresh error, and return the original error
            if (refreshError.response.status === 401) {
              setTokenExpired(true);
            }

            return Promise.reject(refreshError);
          })
      );
    }
  );
};
