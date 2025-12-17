import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AppContext = createContext(null);

/* =====================================================
   APP PROVIDER
===================================================== */
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  /* ---------------------- TOKEN (lazy init) ---------------------- */
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [input, setInput] = useState("");

  /* ---------------------- LOGOUT ---------------------- */
  const logoutNow = (message = "Logged out") => {
    localStorage.removeItem("token");
    setToken(null);
    delete axios.defaults.headers.common.Authorization;

    toast.error(message);
    navigate("/admin", { replace: true });
  };

  /* ---------------------- AXIOS INTERCEPTOR ---------------------- */
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutNow("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  /* ---------------------- TOKEN → AXIOS HEADER ---------------------- */
  useEffect(() => {
    if (!token) return;

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);

    return () => {
      delete axios.defaults.headers.common.Authorization;
    };
  }, [token]);

  /* ---------------------- AUTO LOGOUT ON TOKEN EXPIRY ---------------------- */
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = decoded.exp * 1000;
      const timeLeft = expiryTime - Date.now();

      if (timeLeft <= 0) {
        logoutNow("Session expired. Please login again.");
        return;
      }

      const timer = setTimeout(() => {
        logoutNow("Session expired. Please login again.");
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch {
      logoutNow("Invalid session. Please login again.");
    }
  }, [token]);

  /* ---------------------- BACKEND WARM-UP (Cold start fix) ---------------------- */
  useEffect(() => {
    axios.get("/health").catch(() => {});
  }, []);

  /* ---------------------- MEMOIZED CONTEXT VALUE ---------------------- */
  const value = useMemo(
    () => ({
      token,
      setToken,
      input,
      setInput,
      navigate,
      axios,
      logoutNow,
    }),
    [token, input]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* =====================================================
   CUSTOM HOOK
===================================================== */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};
