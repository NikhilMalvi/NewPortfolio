import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [input, setInput] = useState("");

  /* ---------------------- 1️⃣ Axios Expiry Handler ---------------------- */
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message?.includes("expired")
        ) {
          logoutNow("Session expired. Please log in again.");
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  /* ---------------------- 2️⃣ Load Token From Storage ---------------------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  /* ---------------------- 3️⃣ Auto Logout Timer (5 min) ---------------------- */
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = decoded.exp * 1000;
      const timeLeft = expirationTime - Date.now();

      if (timeLeft <= 0) {
        logoutNow("Your session has expired. Please log in again.");
        return;
      }

      const timer = setTimeout(() => {
        logoutNow("Your session expired due to inactivity.");
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch (error) {
      logoutNow("Invalid token. Please login again.");
    }
  }, [token]);

  /* ---------------------- 4️⃣ Update axios on token change ---------------------- */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* ---------------------- Logout Function ---------------------- */
  const logoutNow = (message) => {
    localStorage.removeItem("token");
    setToken(null);
    toast.error(message);
    navigate("/admin");
  };

  const value = {
    token,
    setToken,
    input,
    setInput,
    navigate,
    axios,
    logoutNow,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
