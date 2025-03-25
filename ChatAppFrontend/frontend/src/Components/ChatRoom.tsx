import * as signalR from "@microsoft/signalr";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "./AuthProvider";
import ActiveUsers from "./ActiveUsers";

type Message = {
  Username: string;
  MessageText: string;
};

export default function ChatRoom() {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const typingTimeout = useRef<number | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { isAuthenticated, username, logout } = useAuth();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("token from chatroom: ", JSON.parse(token).token);
    if (!connectionRef.current) {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5132/chathub", {
          accessTokenFactory: () =>
            JSON.parse(sessionStorage.getItem("token")).token || "",
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

      conn
        .start()
        .then(() => {
          console.log("connected to signalR");

          conn.on(
            "ReceiveMessage",
            (username: string, receivedMessage: string) => {
              setMessages((prevMessages) => [
                ...prevMessages,
                { Username: username, MessageText: receivedMessage },
              ]);
            }
          );

          conn.on(
            "UserConnected",
            (username: string, connectedUsers: string[]) => {
              console.log("user joined: ", username);
              console.log(connectedUsers);
              if (connectedUsers) {
                setActiveUsers(connectedUsers);
              }
            }
          );

          conn.on("UserDisconnected", (connectedUsers: string[]) => {
            /* setActiveUsers((prev) => prev.filter((user) => user !== username)); */
            if (connectedUsers) {
              setActiveUsers(connectedUsers);
            }
          });

          conn.on("QueryActiveUsers", (activeUsers: string[]) => {
            setActiveUsers(activeUsers);
          });

          conn.on("Typing", (usernames: string[]) => {
            setTypingUsers(usernames);
          });

          conn.on("StoppedTyping", (usernames: string[]) => {
            setTypingUsers(usernames);
          });
        })
        .catch((err) => console.log("connection failed", err));

      connectionRef.current = conn;
    }
  }, []);

  useEffect(() => {
    connectionRef.current?.invoke("GetActiveUsers");
  }, []);

  async function sendMessage() {
    const sentMessage = {
      userId: 0,
      Username: username,
      MessageText: message,
      ChatRoomId: 1,
    };

    if (connectionRef.current && message.trim()) {
      await connectionRef.current.invoke("SendMessage", username, message);
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
  }

  function handleMsgChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);

    if (!typingUsers.includes(username)) {
        connectionRef.current?.invoke("UserTyping", username);
    }
    
    if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
    }
    
    typingTimeout.current = window.setTimeout(() => {
        connectionRef.current?.invoke("UserStoppedTyping")
    }, 1000)
  }
  
  function handleLogout() {
    if (connectionRef.current) {
      connectionRef.current.stop();
    }
    logout();
  }

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
          onChange={handleMsgChange}
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
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <ActiveUsers
        activeUsers={activeUsers}
        typingUsers={typingUsers}
      ></ActiveUsers>
    </div>
  );
}
