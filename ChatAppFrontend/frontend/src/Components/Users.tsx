import { useState, useEffect } from "react"

type User = {
    UserId: number,
    Username: string,
    LastOnline: Date,
    IsOnline: boolean,
}

type OnlineUser = Omit<User, 'LastOnline'>;


export default function OnlineUsers() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() =>  {
        
    }, [])

    return (
        <>
            <ul>
                {onlineUsers.map((user) => {
                    <li key={user.UserId}></li>
                })}
            </ul>
        </>
    )
}