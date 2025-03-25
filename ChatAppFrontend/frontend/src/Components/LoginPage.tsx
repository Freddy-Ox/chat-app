import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5132/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("invalid username or password");
      }

      const responseData = await response.json();

      if (!responseData.token) {
        console.log("you've entered incorrect user credentials. try again");
        setLoginError(true)
      }

      if (responseData.token) {
        sessionStorage.setItem("token", responseData.token.token);
        login(username, responseData.token);
        console.log("login succesful");
        navigate("/chatroom");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        
      }
    }
  }
  console.log(loginError)
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="flex flex-col space-y-4 w-80">
        <input
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          onClick={handleLogin}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
        <p className="text-red-500">{loginError ? "You've entered incorrect credentials. Try again." : ""}</p>
      </form>
    </div>
  );
}
