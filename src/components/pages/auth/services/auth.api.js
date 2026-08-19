import axios from "axios";

const api = axios.create({
    baseURL: "https://genai-1cxp.onrender.com",
    withCredentials: true,
});

export const register = async ({ username, email, password }) => {
    try {
        const res = await api.post('/api/auth/register', { username, email, password });
        return res.data;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

export const login = async ({ email, password }) => {
    try {
        const res = await api.post('/api/auth/login', { email, password });
        return res.data;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

export const logout = async () => {
    try {
        const res = await api.get('/api/auth/logout');
        return res.data;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

export const getMe = async () => {
    try {
        const res = await api.get('/api/auth/get-me');
        return res.data;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

export default { register, login, logout, getMe };