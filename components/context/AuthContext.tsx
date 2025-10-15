'use client'
import { createContext, useState, useEffect, useContext } from 'react';
import {setAuthToken} from "@/lib/apiServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser: string | null = localStorage.getItem("customerLogin");
    const token: string | null = localStorage.getItem("authToken");
    if (storedUser) {
      setAuthToken(token)
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  return useContext(AuthContext);
};
