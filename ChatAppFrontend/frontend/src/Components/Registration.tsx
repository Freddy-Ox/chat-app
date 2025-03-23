import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await fetch("http://localhost:5132/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("error submitting credentials: ", error.message);
      }
    }
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="flex flex-col space-y-4 w-80" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter a username.."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="enter a password.."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}
