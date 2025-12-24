import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.REACT_APP_API_BASE ||
    (typeof window !== "undefined" && window.API_BASE) ||
    "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_BASE]);

  const login = async (taikhoan, matkhau) => {
    const res = await axios.post(
      `${API_BASE}/api/auth/login`,
      { taikhoan, matkhau },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post(
      `${API_BASE}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
