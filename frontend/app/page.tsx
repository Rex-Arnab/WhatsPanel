"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { SocketType } from "dgram";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
  body: string;
  notifyName: string;
  from: string;
  deviceType: string;
  isForwarded: boolean;
  isStatus: boolean;
  createdAt: string;
  type: string;
  to: string;
  fromMe: boolean;
  id: string;
}

function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<SocketType | any>();

  useEffect(() => {
    // Example: listen for messages from the server
    if (!socket) {
      const soc = io("http://localhost:3000");
      setSocket(soc);
    }

    socket?.on("connect", () => {
      console.log("Connected to server");
    });

    socket?.on("message", (message: any) => {
      console.log(`Received message: ${message.body}`);
      setMessages((prevMessages) => {
        const msg: Message = {
          body: message.body,
          notifyName: message?._data?.notifyName,
          from: message.from,
          deviceType: message.deviceType,
          isForwarded: message.isForwarded,
          isStatus: message.isStatus,
          createdAt: message.timestamp,
          type: message.type,
          to: message.to,
          fromMe: message.fromMe,
          id: message.id?.id
        };
        return [msg, ...prevMessages];
      });
    });
    return () => {
      socket?.disconnect();
    };
  }, [socket]);
  console.log(socket);

  const handlePing = () => {
    // Example: send a message to the server
    socket.emit("message", { body: "Ping", notifyName: "ping" });
    axios.get("http://localhost:3000").then((res) => {
      console.log(res.data);
    });
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Connected: {socket?.connected ? "Yes" : "No"}</p>
      <Button onClick={handlePing}>Ping</Button>
      <Button onClick={() => console.log(socket)}>Socket</Button>

      <section>
        <h2>Messages</h2>
        <div className="flex flex-col gap-5">
          {messages.map((message, index) => (
            <div
              key={message.createdAt}
              className="border my-2 flex items-center justify-around p-5 bg-white shadow">
              <div>{message.body}</div>
              <div>{message.notifyName}</div>
              <div>{message.from}</div>
              <div>{message.deviceType}</div>
              <div>{message.isForwarded}</div>
              <div>{message.isStatus}</div>
              <div>{message.createdAt}</div>
              <div>{message.type}</div>
              <div>{message.to}</div>
              {/* <div>{message.id}</div> */}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
