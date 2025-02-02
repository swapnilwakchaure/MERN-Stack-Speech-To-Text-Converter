import { useEffect, useRef, useState } from "react";
import { createTaskFromAudio, fetchTasks } from "../services/api";
import { Button, Container, List, ListItem, Typography } from "@mui/material";
import { FaStopCircle, FaMicrophone } from "react-icons/fa";

interface Task {
  _id: string;
  text: string;
  createAt: string;
}

export default function TaskList() {
  const [isRecording, setIsRecording] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await fetchTasks();
    setTasks(data);
    console.log(data);
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => (
      audioChunks.current.push(e.data)
    );

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      await createTaskFromAudio(audioBlob);
      audioChunks.current = [];
      await loadTasks();
    }

    mediaRecorder.current.start();
    setIsRecording(true);
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Speech to text
      </Typography>

      <Button
        variant="contained"
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <FaStopCircle /> : <FaMicrophone />}
        onClick={isRecording ? stopRecording : startRecording}
      >
        { isRecording ? "Stop Recording" : "Start Recording" }
      </Button>

      <List>
        {tasks?.length > 0 && tasks.map((task) => (
          <ListItem key={task._id}>
            <Typography variant="body1">
              {task.text} - {new Date(task.createAt).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}