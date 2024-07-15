import React, { useState, useEffect } from "react";
import { GoPaperAirplane } from "react-icons/go";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState(null);
  const { user } = useSelector((state) => state.auth.user || {});

  useEffect(() => {
    const socket = new WebSocket(`wss://noedove-backend.onrender.com`);

    // const socket = new WebSocket(`ws://localhost:8080`);

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const fetchPreviousMessages = async () => {
      try {
        const response = await axios.get(`${server}/user/prev-messages`);

        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws && inputMessage.trim() !== "") {
      const messageData = {
        content: inputMessage,
        userId: user._id,
        username: user.username,
      };
      console.log("frontend messsage data", messageData);
      ws.send(JSON.stringify(messageData));
      setInputMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="relative flex flex-col gap-5 px-3 lg:px-5 py-3">
        {messages.map((message, index) =>
          message.userId === user._id ? (
            <div key={index} className="flex justify-start">
              <div
                key={index}
                className="bg-[#4399ff] text-[#ffff] max-w-[80%] lg:max-w-[40%] p-2 yours-message-box"
              >
                <span>{message.content}</span>
                <p className="flex justify-end text-[0.8rem] mt-1">
                  ~{message.username} - {message.time}
                </p>
              </div>
            </div>
          ) : (
            <div key={index} className="flex justify-end ">
              <div className="max-w-[80%] lg:max-w-[40%] bg-[#dce8ff] text-[#000] p-2 other-message-box">
                <span>{message.content}</span>
                <p className="flex justify-end text-[0.8rem] mt-1">
                  ~{message.username} - {message.time}
                </p>
              </div>
            </div>
          )
        )}
      </div>
      <div className="relative mt-[6rem] ">
        <div className="fixed bottom-0 left-0 w-[100%] message-box-border bg-[#ffffff]">
          <div className="flex justify-center py-4 rounded-md">
            <div className=" w-[90%] lg:w-[60%] py-2 px-2 box-shadow flex items-center">
              <input
                type="text"
                placeholder="Write a message..."
                className="input-css"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <GoPaperAirplane
                size={30}
                className="cursor-pointer"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
