/* eslint-disable react-refresh/only-export-components */

import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "shortlistd.auth.user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cachedUser = localStorage.getItem(AUTH_STORAGE_KEY);

      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setUser(nextUser);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
        {
          withCredentials: true,
        },
      );

      persistUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        persistUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch {
      // Clear the local session even if the network request fails so the UI
      // cannot get stuck in an authenticated state.
    } finally {
      persistUser(null);
    }
  }, [persistUser]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCurrentUser();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCurrentUser]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== AUTH_STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(event.newValue));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: persistUser,
        loading,
        isAuthenticated: !!user,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
