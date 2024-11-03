import { io } from "socket.io-client";
import "./style.scss";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import LineChat from "./line-chat";
import { useUserStore } from "../authenticate/state";

// const socket = io("http://192.168.1.222:8111", {
const socket = io("http://210.245.49.84:8111", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 300000,

})

const ChatPage = () => {
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user', text: string, id: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');

  const user = useUserStore(state => state.user);

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected to server!");
    });

    socket.on('receive_message', (data) => {
      console.log(data.message, "data")
      setMessages((prevMessages) => [...prevMessages].map((ms, idx) => {
        if (idx === prevMessages.length - 1) {
          return { ...ms, text: data.message }
        }
        return ms
      }));
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

  const sendMessage = (userMessage: string) => {
    if (userMessage.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage, id: uuidv4() }, { sender: 'bot', text: 'Vpbank Copilot đang trả lời bạn...', id: uuidv4() }]);

    socket.emit('send_message', {
      message: userMessage,
    });

    setUserMessage('');
  }

  return (
    <div className="main-chat h-[100vh] px-[20px] py-[30px] overflow-auto">
      {/* <div className="w-full">
        <h2 style={{ width: "100%", fontSize: "32px", marginTop: "1rem", lineHeight: "43.88px", fontWeight: 600, color: "#0C7A2D" }}>VPBANK ChatBot Supporter</h2>
      </div> */}
      <div className="desktop:w-1/2 final-block min-h-[500px] desktop:min-h-[auto] w-full flex-col overflow-auto">
        <div className="flex justify-between w-full bg-[#F6F6F6] py-[1rem] px-[2rem] head-chat">
          <div className="hidden desktop:flex gap-2 items-center text-[#094138] text-[20px] font-[500]">
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 1.25C18.1904 1.25 18.75 1.80964 18.75 2.5V12.5C18.75 13.1904 18.1904 13.75 17.5 13.75H14.375C13.5881 13.75 12.8471 14.1205 12.375 14.75L10 17.9167L7.625 14.75C7.15286 14.1205 6.41189 13.75 5.625 13.75H2.5C1.80964 13.75 1.25 13.1904 1.25 12.5V2.5C1.25 1.80964 1.80964 1.25 2.5 1.25H17.5ZM2.5 0C1.11929 0 0 1.11929 0 2.5V12.5C0 13.8807 1.11929 15 2.5 15H5.625C6.01845 15 6.38893 15.1852 6.625 15.5L9 18.6667C9.5 19.3333 10.5 19.3333 11 18.6667L13.375 15.5C13.6111 15.1852 13.9816 15 14.375 15H17.5C18.8807 15 20 13.8807 20 12.5V2.5C20 1.11929 18.8807 0 17.5 0H2.5Z" fill="#0F6D5E" />
              <path d="M3.75 4.375C3.75 4.02982 4.02982 3.75 4.375 3.75H15.625C15.9702 3.75 16.25 4.02982 16.25 4.375C16.25 4.72018 15.9702 5 15.625 5H4.375C4.02982 5 3.75 4.72018 3.75 4.375ZM3.75 7.5C3.75 7.15482 4.02982 6.875 4.375 6.875H15.625C15.9702 6.875 16.25 7.15482 16.25 7.5C16.25 7.84518 15.9702 8.125 15.625 8.125H4.375C4.02982 8.125 3.75 7.84518 3.75 7.5ZM3.75 10.625C3.75 10.2798 4.02982 10 4.375 10H10.625C10.9702 10 11.25 10.2798 11.25 10.625C11.25 10.9702 10.9702 11.25 10.625 11.25H4.375C4.02982 11.25 3.75 10.9702 3.75 10.625Z" fill="#0F6D5E" />
            </svg>
            Artificial Intelligence
            <span className="font-[800]">Assistant</span>
          </div>
          <div className="flex desktop:hidden text-[#094138] text-[20px] font-[500]">
            AI
            <span className="font-[800]">&nbsp;Assistant</span>
          </div>
          <div className="hidden items-center desktop:flex italic font-[600] text-[#094138]">
            {/* Phòng hành chính nhân sự */}
          </div>
        </div>
        {/* <div className="w-full">
          Xin chào {user?.name}
        </div> */}
        <div className="chat-container desktop:p-[2rem] px-[7px] py-[5px] min-h-[100px] desktop:min-h-[unset] desktop:max-h-[unset]">
          {messages.length > 0 &&
            <div className="chat-box" id="chat-box">
              {messages.map((msg) => (
                <LineChat key={msg.id} msg={msg} />
              ))}
              <div className="h-[50px]"></div>
            </div>}
          {messages.length <= 0 && <div className="chat-box justify-center flex flex-col items-center">
            <div className="text-[24px] text-[#525252] font-[600] lead-[23px] w-[90%] desktop:w-2/3">Xin chào {user?.name}, tôi có thể giúp gì cho bạn?</div>
            <div className="text-[13px] text-[#A0A0A0] font-[500] lead-[17px] w-[90%] desktop:w-2/3 mt-[15px]">Xin chào, tôi là chuyên gia phân tích dữ liệu Vpbank Copilot. Hãy hỏi tôi những thông tin về cơ sở dữ liệu của bạn</div>
            {user && user?.faqs?.length > 0 &&
              <div className="flex justify-between w-[90%] desktop:w-2/3 flex-wrap gap-3 mt-3">
                {user.faqs.map(faq => <div key={uuidv4()} onClick={() => sendMessage(faq)} className="bg-[#F9F9F9] text-[#525252] font-[500] text-[14px] lead-[19px] px-[20px] py-[8px] w-full desktop:w-[48%] rounded-[4px] cursor-pointer hover:bg-[#cfe7da] hover:text-[#094138]">
                  {faq}
                </div>)}
              </div>
            }
          </div>}
          <div className="input-container">
            <input
              type="text"
              className="bg-[#F8F9FB] text-[13px] font-[500] text-[#525252]"
              style={{ padding: "10px 16px 10px 24px", flex: "1 1 0", borderRadius: "8px", outline: "none", color: "#525252" }}
              placeholder="Nhập tin nhắn..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && sendMessage(userMessage)}
            />
            <button type="button" className="bg-[#0F6D5E] rounded-[4px] px-[12px]" onClick={() =>sendMessage(userMessage)} >
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6357 13.6701L18.3521 8.5208C19.8516 4.02242 20.6013 1.77322 19.414 0.585953C18.2268 -0.601315 15.9776 0.148415 11.4792 1.64788L6.32987 3.36432C2.69923 4.57453 0.883919 5.17964 0.368059 6.06698C-0.122686 6.91112 -0.122686 7.95369 0.368058 8.79783C0.883919 9.68518 2.69923 10.2903 6.32987 11.5005C6.77981 11.6505 7.28601 11.5434 7.62294 11.2096L13.1286 5.75495C13.4383 5.44808 13.9382 5.45041 14.245 5.76015C14.5519 6.06989 14.5496 6.56975 14.2398 6.87662L8.82312 12.2432C8.45175 12.6111 8.3342 13.1742 8.49951 13.6701C9.70971 17.3007 10.3148 19.1161 11.2022 19.6319C12.0463 20.1227 13.0889 20.1227 13.933 19.6319C14.8204 19.1161 15.4255 17.3008 16.6357 13.6701Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
};

export default ChatPage;
