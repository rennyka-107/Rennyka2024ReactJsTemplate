import { io } from "socket.io-client";
import "./style.scss";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import LineChat from "./line-chat";

const socket = io("http://192.168.1.222:8111", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 300000,
  
})

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected to server!");
    });

    socket.on('receive_message', (data) => {
      console.log(data.message, "data")
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.message, image: data.image, sql: data.sql, id: uuidv4() }]);
    })

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const id = messages[messages.length - 1].id;
      let ele = document.getElementById(id);
      ele.scrollIntoView();
    }
  }, [messages])

  const sendMessage = () => {
    if (userMessage.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage, id: uuidv4() }]);

    socket.emit('send_message', {
      message: userMessage,
    });

    setUserMessage('');
  }

  return (
    <div className="main-chat desktop:h-[100vh] px-[20px] py-[30px] overflow-auto">
      <div className="w-full">
        <h2 style={{ width: "100%", fontSize: "32px", marginTop: "1rem", lineHeight: "43.88px", fontWeight: 600, color: "#0C7A2D" }}>VPBANK ChatBot Supporter</h2>
      </div>
      <div className="final-block min-h-[500px] desktop:min-h-[auto] gap-5 w-full flex-col-reverse desktop:flex-row overflow-auto">
        <div className="chat-container min-h-[100px] max-h-[500px] desktop:min-h-[unset] desktop:max-h-[unset]">
          <div className="chat-box" id="chat-box">
            {messages.map((msg) => (
              <LineChat key={msg.id} msg={msg} />
            ))}
            <div className="h-[50px]"></div>
          </div>
          <div className="input-container">
            <input
              type="text"
              style={{ padding: "16px 0 16px 24px", flex: "1 1 0", borderRadius: "8px", outline: "none", color: "#525252" }}
              placeholder="Nhập tin nhắn..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button type="button" className="absolute right-[16px] top-[50%] transform -translate-y-1/2" onClick={sendMessage} style={{ background: "white", borderRadius: "8px", marginLeft: "1rem", padding: "8px 16px" }} >Gửi</button>
          </div>
        </div>

      </div>
    </div>
  )
};

export default ChatPage;
