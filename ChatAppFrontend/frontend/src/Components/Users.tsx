import { useState, useEffect } from "react";

type User = {
  UserId: number;
  Username: string;
  LastOnline: Date;
  IsOnline: boolean;
};

//type OnlineUser = Omit<User, 'LastOnline'>;

export default function OnlineUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5132/api/users/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.log("error retrieving users from database");
          return;
        }
        setUsers(await response.json());
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <ul>
        {/* {users.map((user) => {
                    <li key={user.UserId}></li>
                })} */}
      </ul>
    </>
  );
}
