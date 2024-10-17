import { io } from "socket.io-client";
import "./style.scss";
import { useEffect, useState } from "react";


type Props = {};

const socket = io("http://localhost:8111")

const ChatPage = (props: Props) => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected to server!");
    });

    socket.on('receive_message', (data) => {
      console.log(data,"data")
      setMessages((prevMessages) => [...prevMessages, {sender: 'bot', text: data.message, image: data.image}]) 
    })

    return () => {
      socket.disconnect();
    }
  }, []);

  const sendMessage = () => {
    if(userMessage.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, {sender: 'user', text: userMessage}]);

    socket.emit('send_message', {message: userMessage});

    setUserMessage('');
  }

  return (
    <div className="main-chat">
      <h2 style={{ width: "100%", textAlign: "center", fontSize: "32px", marginTop: "1rem"}}>VPBANK ChatBot Supporter</h2>
      <h2 style={{ width: "100%", textAlign: "center", fontSize: "16px", marginTop: "1rem"}}>Để truy xuất dữ liệu trong cơ sở dữ liệu hãy sử dụng những câu hỏi có chứa từ 'hệ thống' hoặc 'vpbank'</h2>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg,index)=> (
            <div className="detail-chat" style={{ justifyContent: msg.sender === 'user' ? 'end' : 'start' }}>
              <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'} >
                {msg.text}
                {msg?.image && <img src={'data:image/png;base64,' + msg.image} />}
              </div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <textarea
          style={{padding: ".5rem 1rem", marginTop: "2rem", border: "1px solid purple", flex: "1 1 0", borderRadius: "8px"}}
          placeholder="Nhập tin nhắn..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} style={{ marginTop: "2rem", minWidth: "100px", maxHeight: "50px", background: "white", borderRadius: "8px", marginLeft: "1rem", padding: "8px 16px", border: "1px solid purple" }} >Gửi</button>
        </div>
      </div>
    </div>
  )
};

export default ChatPage;
