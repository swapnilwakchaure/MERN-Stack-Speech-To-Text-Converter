import { Routes, Route } from "react-router-dom";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/Signup";
import TaskList from "./components/TaskList";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/" element={<PrivateRoute><TaskList /></PrivateRoute>} />
    </Routes>
  )
}