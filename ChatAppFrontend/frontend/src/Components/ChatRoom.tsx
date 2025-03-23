import * as signalR from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";

type Message = {
  Username: string;
  MessageText: string;
};

export default function ChatRoom() {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { isAuthenticated, username, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5132/chathub", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          withCredentials: true,
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
  }}, [isAuthenticated]);

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
    <div className="max-h-screen h-full flex flex-col p-4">
      <div className="flex-1 max-h-96 overflow-y-auto p-4 bg-gray-800 text-white rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b border-gray-600">
            <strong className="text-blue-400">{msg.Username}:</strong>{" "}
            {msg.MessageText}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden min-h-[40px] max-h-32"
          rows={1}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
