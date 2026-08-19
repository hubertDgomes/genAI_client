import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const data = await getMe();
        setUser(data.user || data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;