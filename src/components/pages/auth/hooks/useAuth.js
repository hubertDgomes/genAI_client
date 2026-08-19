import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from '../services/auth.api.js';

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, setLoading, loading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const res = await login({ email, password });
            const loggedInUser = res.user || res.data || res;
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const res = await register({ username, email, password });
            return res;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await getMe();
            const currentUser = res.user || res.data || res;
            setUser(currentUser);
            return currentUser;
        } catch (err) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { 
        user, 
        setUser, 
        setLoading, 
        loading, 
        handleLogin, 
        handleRegister, 
        handleLogout, 
        checkAuth 
    };
};

export default useAuth;