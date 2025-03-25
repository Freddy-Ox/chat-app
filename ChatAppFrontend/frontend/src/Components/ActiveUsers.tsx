import { useState, useEffect, useMemo } from "react";

type ActiveUsersProps = {
  activeUsers: string[];
  typingUsers: string[];
};

export default function ActiveUsers({
  activeUsers,
  typingUsers,
}: ActiveUsersProps) {
  const [typingDots, setTypingDots] = useState("");

  useMemo(() => {
    setInterval(() => {
      setTypingDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);

    setTypingDots("");
  }, []);

  /* useEffect(() => {
    setInterval(() => {
      setTypingDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);

    setTypingDots("");
    
  }, [typingUsers]); */

  return (
    <ul>
      {activeUsers.map((user, index) => {
        return (
          <li key={index}>
            {typingUsers.includes(user)
              ? user + " is typing" + typingDots
              : user}
          </li>
        );
      })}
    </ul>
  );
}
