import { AuthProvider } from "./Components/AuthProvider";
import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import "./App.css";
import Registration from "./Components/Registration";
import LoginPage from "./Components/LoginPage"; 

type Message = {
  Username: string;
  MessageText: string;
};

function App() {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState(
    "User" + Math.floor(Math.random() * 1000)
  );

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5132/chathub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    conn
      .start()
      .then(() => {
        console.log("connected to signalR");
        conn.on("ReceiveMessage", (user, receivedMessage) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { Username: user, MessageText: receivedMessage },
          ]);
        });
      })
      .catch((err) => console.log("connection failed", err));

    setConnection(conn);
  }, []);

  const sendMessage = async () => {
    const sentMessage = {
      userId: 0,
      Username: username,
      MessageText: message,
      ChatRoomId: 1,
    };

    if (connection && message.trim()) {
      await connection.invoke("SendMessage", username, message);
    }

    try {
      const response = await fetch("http://localhost:5132/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sentMessage),
      });
      if (!response.ok) {
        console.log("error saving message to database");
      }
    } catch (error) {
      console.log("error saving message: ", error);
    }

    setMessage("");
  };

  return (
    <AuthProvider>
      <div className="flex flex-col items-center p-4">
        <LoginPage></LoginPage>
        <Registration></Registration>
        <h1 className="text-xl font-bold mb-2">Chat App</h1>
        <div className="border p-4 w-96 h-64 overflow-auto bg-gray-100">
          {messages.map((msg, index) => (
            <div key={index} className="p-1">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <input
          className="border p-2 mt-2 w-96"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Send
        </button>
      </div>
    </AuthProvider>
  );
}

export default App;
