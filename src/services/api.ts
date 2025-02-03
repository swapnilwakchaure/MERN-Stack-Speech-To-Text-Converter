import axios from "axios";

// export const BASE_URL = "http://localhost:8080/api";
export const BASE_URL = "https://speech-to-text-converter-node-url.onrender.com/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const createTaskFromAudio = (audioBlob: Blob) => {
    const formData = new FormData();
    const userId = localStorage.getItem("userId");
    formData.append("audio", audioBlob, "recording.webm");

    return api.post(`/tasks/audio?userId=${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const fetchTasks = (sortBy: string, userId: string) => api.get(`/tasks?sortBy=${sortBy}&userId=${userId}`);

export const signUp = (name: string, email: string, password: string) => {
    return api.post("/signup", { name, email, password });
}

export const signIn = (email: string, password: string) => {
    return api.post("/signin", { email, password });
}


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
