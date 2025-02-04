import { useEffect, useRef, useState } from "react";
import { createTaskFromAudio, deleteTask, fetchTasks, formatDate } from "../services/api";
import { Button, Container, List, ListItem, Typography, Box } from "@mui/material";
import { FaStopCircle, FaMicrophone } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  text: string;
  createdAt: string;
}

export default function TaskList() {
  const [isRecording, setIsRecording] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [deleted, setDeleted] = useState(false);
  const username = localStorage.getItem("user");
  const userId = localStorage.getItem("userId") || '';
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks(sortBy, userId);
    setDeleted(false);
  }, [sortBy, deleted]);

  const loadTasks = async (sortBy: string, userId: string) => {
    const { data } = await fetchTasks(sortBy || "default", userId);
    setTasks(data);
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => (
      audioChunks.current.push(e.data)
    );

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      console.log('1', audioBlob);
      const response = await createTaskFromAudio(audioBlob);
      console.log('2', response);
      audioChunks.current = [];
      await loadTasks(sortBy, userId);
    }

    mediaRecorder.current.start();
    setIsRecording(true);
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }

  const handleDeleteTask = async (id: string) => {
    const response = await deleteTask(id);
    if (response.data.status) {
      toast.success(response.data.message);
      setTimeout(() => {
        setDeleted(true);
      }, 1000);
    } else {
      toast.warn(response.data.message);
    }
  }

  const handleSignOut = () => {
    console.log('signout');
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Successfully sign out");
    setTimeout(() => {
      navigate("/signin");
    }, 1000);
  }
  
  return (
    <Container maxWidth="md">
      <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
        <select
          style={{
            border: "none", outline: "none", cursor: "pointer"
          }}
          onChange={(e) => {
            if (e.target.value === "signout") {
              handleSignOut();
            }
          }}
        >
          <option value="user">{username}</option>
          <option value="signout">Sign Out</option>
        </select>
      </div>
      <Box
        sx={{
          marginTop: "20px",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h3" gutterBottom>
          Speech to text
        </Typography>

        <select
          style={{
            padding: "5px 10px",
            outline: "none"
          }}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </Box>

      <Button
        variant="contained"
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <FaStopCircle /> : <FaMicrophone />}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>

      <List>
        {tasks?.length > 0 && tasks.map((task) => (
          <ListItem
            key={task._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="body1">
              {task.text}
            </Typography>
            <Box>
              {formatDate(task.createdAt)}
              <Button onClick={() => handleDeleteTask(task._id)}><AiFillDelete /></Button>
              <ToastContainer />
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}