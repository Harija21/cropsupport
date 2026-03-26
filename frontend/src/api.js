// Centralized API helper — all calls go through here
const BASE = '/api';

function getToken() {
    return localStorage.getItem('farmai_token');
}

async function request(method, path, body = null, isFormData = false) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const config = { method, headers };
    if (body) config.body = isFormData ? body : JSON.stringify(body);

    const res = await fetch(BASE + path, config);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
}

export const api = {
    // Auth
    register: (body) => request('POST', '/auth/register', body),
    login: (body) => request('POST', '/auth/login', body),
    getMe: () => request('GET', '/auth/me'),

    // AI Chat
    chat: (question) => request('POST', '/ai/chat', { question }),
    chatHistory: () => request('GET', '/ai/history'),

    // Disease Detection
    detectDisease: (formData) => request('POST', '/disease/detect', formData, true),
    diseaseHistory: () => request('GET', '/disease/history'),

    // Weather
    getWeather: () => request('GET', '/weather'),

    // Community
    getPosts: () => request('GET', '/community'),
    createPost: (body) => request('POST', '/community', body),
};
