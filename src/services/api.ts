import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api"});

export const createTaskFromAudio = (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    return api.post("/tasks/audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const fetchTasks = () => api.get("/tasks");