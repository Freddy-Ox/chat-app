import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./Components/AuthProvider";
import Registration from "./Components/Registration";
import LoginPage from "./Components/LoginPage";
import ChatRoom from "./Components/ChatRoom";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <h1 className="text-xl font-bold mb-2">Chat App</h1>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/chatroom"
            element={
              <ProtectedRoute>
                <ChatRoom />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
