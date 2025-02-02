import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/signin" element={<SignInForm />} />
    </Routes>
  )
}