import { io } from "socket.io-client";
import "./style.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import LineChat from "./line-chat";
import { useUserStore } from "../authenticate/state";
import IconChat from "@/components/Icon/chat";
import IconLike from "@/components/Icon/like";
import IconSetting from "@/components/Icon/setting";
import IconLogout from "@/components/Icon/logout";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { flushSync } from 'react-dom'
import IconReportDaily from "@/components/Icon/report-daily";
import IconUsers from "@/components/Icon/users";
import IconDepartments from "@/components/Icon/departments";
import IconPermissions from "@/components/Icon/permissions";

// const socket = io("http://192.168.1.222:8111", {
// const socket = io("wss://apivpb.vtrusted.vn", {
const socket = io("wss://apivpb.vtrusted.vn", {
  // const socket = io("http://210.245.49.84:8111", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 300000,

})

const ChatPage = () => {
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user', text: string, id: string, isReply?: boolean, question?: string, question_id?: string, is_like: boolean }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [chooseTab, setChooseTab] = useState<'chat' | 'favorite' | 'setting' |"dashboard" | "report" | "users" | "departments" | "permission" | "faq">('chat')
  const { user, logout } = useUserStore();
  const [isListening, setIsListening] = useState(false);
  const silenceTimer = useRef<any>(null);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [callFarvoriteQuestion, setCallFarvoriteQuestion] = useState<number>(0)
  const [listFarvoriteQuestion, setListFarvoriteQuestion] = useState<any>([])

  if (!browserSupportsSpeechRecognition) {
    console.log("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói")
    return <span>Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.</span>;
  }

  const startListening = () => {
    console.log("start", transcript)
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ language: 'vi-VN', continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    // setIsListening(false);
    console.log("stop", transcript)
    clearTimeout(silenceTimer.current); // Xóa timer nếu đang nghe
    // saveTranscript();
    sendMessage(transcript);
  };

  function formatDatetime(time_str: string) {
    // Chuyển chuỗi thành đối tượng Date
    let date = new Date(time_str);

    // Lấy các thành phần của thời gian
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    let year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} Ngày ${day}/${month}/${year}`;
  }

  function fetchListFarvoriteQuestion() {
    fetch('https://apivpb.vtrusted.vn/like-answers/' + user.role, {
      // fetch('http://210.245.49.84:8111/like-answers/' + user.role, {
      method: "GET"
    }).then(res => res.json()).then(res => {
      setListFarvoriteQuestion(res.map(r => ({ title: r.data.question, date: formatDatetime(r.created_at) })))
      // console.log(res, "res like")
    })
  }

  // console.log(callFarvoriteQuestion)

  useEffect(() => {
    fetchListFarvoriteQuestion();
  }, [callFarvoriteQuestion])

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      console.log(transcript, "send sau 3s")
      stopListening()
    }, 1500);
  };

  useEffect(() => {
    if (transcript && isListening) {
      resetSilenceTimer();
    }
  }, [transcript, isListening]);

  useEffect(() => {
    const handleEnd = () => {
      if (isListening) {
        SpeechRecognition.startListening({ language: 'vi-VN', continuous: true });
      }
    };

    // Đăng ký sự kiện end khi component mount
    SpeechRecognition.getRecognition().onend = handleEnd;

    // Hủy đăng ký khi component unmount
    return () => {
      SpeechRecognition.getRecognition().onend = null;
    };
  }, [isListening]);

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'bot' && isListening && messages[messages.length - 1].isReply) {
      console.log("tiep tuc hoi thoai")
      startListening()
    }
  }, [messages, isListening])

  useEffect(() => {
    if (messages.length > 0) {
      const id = messages[messages.length - 1].id;
      let ele = document.getElementById(id);
      ele.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages])

  const sendMessage = async (userMessage: string) => {
    const question_id = uuidv4()
    fetch('https://apivpb.vtrusted.vn/add-to-history', {
      // fetch('http://210.245.49.84:8111/add-to-history', {
      method: "POST",
      body: JSON.stringify({
        data: { sender: 'user', text: userMessage, question: userMessage, id: question_id },
        role: user.role,
        id: question_id
      })
    }).then(res => res.json).then(res => { console.log("Them user question vao lich su chat") })
    setUserMessage('');
    if (userMessage.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage, id: question_id, is_like: false }, { sender: 'bot', text: 'VpBank Ai đang trả lời ...', question: userMessage, question_id: question_id, id: uuidv4(), isReply: false, is_like: false }]);
    socket.emit('send_code', {
      message: userMessage,
    });
    const response = await fetch(`https://apivpb.vtrusted.vn/chat-stream`, {
      // const response = await fetch(`http://210.245.49.84:8111/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/event-stream'
      },
      body: JSON.stringify({ question: userMessage })
    });

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        setMessages((prevMessages) => {
          const lastMessageIndex = prevMessages.length - 1;
          const updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            isReply: true,
          };
          return updatedMessages;
        });
        break
      };
      const cleanedValue = value.replace(/^data: /, '');
      if(cleanedValue.includes("<html")) {
        console.log("day la html")
      }
      if(cleanedValue.includes("/html>")) {
        console.log("day la ket thuc cua html")
      }
      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        const updatedMessages = [...prevMessages];
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          text: updatedMessages[lastMessageIndex].text !== "VpBank Ai đang trả lời ..." ? updatedMessages[lastMessageIndex].text + cleanedValue : cleanedValue,
        };
        return updatedMessages;
      }
      );

    }
  }

  return (
    <div className="main-chat h-[100vh] overflow-auto">
      {/* <div className="w-full">
        <h2 style={{ width: "100%", fontSize: "32px", marginTop: "1rem", lineHeight: "43.88px", fontWeight: 600, color: "#0C7A2D" }}>VPBANK ChatBot Supporter</h2>
      </div> */}
      <div className="hidden desktop:w-1/5 desktop:flex desktop:flex-col desktop:justify-between h-[100vh]">
        <div className="flex flex-col">
          <div className="flex px-[45px] py-[1rem]">
            <img src="/vpbank-logo.png" />
          </div>
          <div onClick={() => setChooseTab('chat')} className={`subnav-item ${chooseTab === "chat" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconChat rootColor={chooseTab === 'chat' ? "#0F6D5E" : "#525252"} />
            <div>New chat</div>
          </div>
          <div onClick={() => setChooseTab('dashboard')} className={`subnav-item ${chooseTab === "dashboard" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconReportDaily rootColor={chooseTab === 'dashboard' ? "#0F6D5E" : "#525252"} />
            <div>Quản lý dashboard</div>
          </div>
          <div onClick={() => setChooseTab('report')} className={`subnav-item ${chooseTab === "report" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconReportDaily rootColor={chooseTab === 'report' ? "#0F6D5E" : "#525252"} />
            <div>Quản lý báo cáo định kỳ</div>
          </div>
          <div onClick={() => setChooseTab('users')} className={`subnav-item ${chooseTab === "users" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconUsers rootColor={chooseTab === 'users' ? "#0F6D5E" : "#525252"} />
            <div>Quản lý người dùng</div>
          </div>
          <div onClick={() => setChooseTab('departments')} className={`subnav-item ${chooseTab === "departments" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconDepartments rootColor={chooseTab === 'departments' ? "#0F6D5E" : "#525252"} />
            <div>Quản lý phòng ban</div>
          </div>
          <div onClick={() => setChooseTab('permission')} className={`subnav-item ${chooseTab === "permission" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconPermissions rootColor={chooseTab === 'permission' ? "#0F6D5E" : "#525252"} />
            <div>Phân quyền truy cập</div>
          </div>
          <div onClick={() => setChooseTab('faq')} className={`subnav-item ${chooseTab === "faq" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"} hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconLike rootColor={chooseTab === 'faq' ? "#0F6D5E" : "#525252"} />
            <div>FAQ</div>
          </div>
          <div onClick={() => setChooseTab('setting')} className={`subnav-item ${chooseTab === "setting" && "bg-[#F9F9F9] rounded-lg text-[#0F6D5E] font-[800]"}  hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]`}>
            <IconSetting rootColor={chooseTab === 'setting' ? "#0F6D5E" : "#525252"} />
            <div>Setting</div>
          </div>
        </div>
        <div onClick={logout} className="subnav-item mb-5 hover:bg-[#F9F9F9] hover:rounded-lg hover:text-[#0F6D5E] text-[14px] hover:font-[800] lead-[15px] cursor-pointer mx-[2rem] flex px-[12px] items-center justify-start gap-3 py-[1rem]">
          <IconLogout />
          <div>Logout</div>
        </div>
      </div>
      {chooseTab === "chat" && <div className="desktop:w-2/3 final-block min-h-[500px] desktop:min-h-[auto] h-[100vh] w-full flex-col overflow-auto">
        <div className="flex justify-between w-full bg-[#F6F6F6] py-[1rem] px-[2rem] head-chat">
          <div className="hidden desktop:flex gap-2 items-center text-[#094138] text-[20px] font-[500]">
            Artificial Intelligence
            <span className="font-[800]">Assistant</span>
          </div>
          <div className="flex desktop:hidden text-[#094138] text-[20px] font-[500]">
            AI
            <span className="font-[800]">&nbsp;Assistant</span>
          </div>
          {user.role === 'admin' && <div className="select-role-container hidden items-center desktop:flex italic font-[600] text-white">
            <select className="select-role text-[13px] pl-[1rem] pr-[36px] py-[8px] rounded bg-[#0F6D5E]" style={{ appearance: "none" }}>
              <option>Phòng hành chính nhân sự</option>
              <option>Phòng kế toán</option>
              <option>Phòng IT</option>
            </select>

          </div>}
        </div>
        {/* <div className="w-full">
          Xin chào {user?.name}
        </div> */}
        <div className="chat-container desktop:p-[2rem] px-[7px] py-[5px] min-h-[100px] desktop:min-h-[unset] desktop:max-h-[unset]">
          {messages.length > 0 &&
            <div className="chat-box" id="chat-box">
              {messages.map((msg) => (
                <LineChat setCallFarvoriteQuestion={setCallFarvoriteQuestion} key={msg.id} msg={msg} setMessage={setMessages} />
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
            <button type="button" className="bg-[#0F6D5E] rounded-[4px] px-[12px]" onClick={() => sendMessage(userMessage)} >
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6357 13.6701L18.3521 8.5208C19.8516 4.02242 20.6013 1.77322 19.414 0.585953C18.2268 -0.601315 15.9776 0.148415 11.4792 1.64788L6.32987 3.36432C2.69923 4.57453 0.883919 5.17964 0.368059 6.06698C-0.122686 6.91112 -0.122686 7.95369 0.368058 8.79783C0.883919 9.68518 2.69923 10.2903 6.32987 11.5005C6.77981 11.6505 7.28601 11.5434 7.62294 11.2096L13.1286 5.75495C13.4383 5.44808 13.9382 5.45041 14.245 5.76015C14.5519 6.06989 14.5496 6.56975 14.2398 6.87662L8.82312 12.2432C8.45175 12.6111 8.3342 13.1742 8.49951 13.6701C9.70971 17.3007 10.3148 19.1161 11.2022 19.6319C12.0463 20.1227 13.0889 20.1227 13.933 19.6319C14.8204 19.1161 15.4255 17.3008 16.6357 13.6701Z" fill="white" />
              </svg>
            </button>
            {/* <button onClick={isListening ? () => { stopListening(); setIsListening(false) } : startListening}>{isListening ? "🛑 Dừng" : "🎤 Bắt đầu nói"}</button>
            <button onClick={resetTranscript}>🔄 Reset</button> */}
          </div>
        </div>

      </div>}
      {chooseTab === "chat" && <div className="hidden desktop:w-1/5 desktop:flex desktop:flex-col h-[100vh]">
        <div className="text-[#525252] font-[700] text-[20px] lead-[21px] py-[1.5rem] px-[1rem]">
          Câu hỏi yêu thích
        </div>
        <div className="farvorite-question">
          {listFarvoriteQuestion.map(chat => (
            <div onClick={() => sendMessage(chat.title)}  key={chat.title + chat.date} className="hover:bg-[#F9F9F9] px-[1rem] py-[.5rem] cursor-pointer">
              <div className="text-[#A0A0A0] text-[14px] font-[500]">
                {chat.date}
              </div>
              <div className="text-[#525252] text-[15px] font-[600] leading-[17px]">
                {chat.title}
                <span className="italic text-[14px] ml-2 text-[#34c99c]">Hỏi ngay</span>
              </div>
            </div>
          ))}
        </div>
      </div>}
      {chooseTab !== "chat" && <div className="desktop:w-2/3 final-block min-h-[500px] desktop:min-h-[auto] h-[100vh] w-full flex-col overflow-auto">
        <div className="flex justify-between w-full bg-[#F6F6F6] py-[1rem] px-[2rem] head-chat">
          <div className="hidden desktop:flex gap-2 items-center text-[#094138] text-[20px] font-[500]">
            Artificial Intelligence
            <span className="font-[800]">Assistant</span>
          </div>
          <div className="flex desktop:hidden text-[#094138] text-[20px] font-[500]">
            AI
            <span className="font-[800]">&nbsp;Assistant</span>
          </div>
          {user.role === 'admin' && <div className="select-role-container hidden items-center desktop:flex italic font-[600] text-white">
            <select className="select-role text-[13px] pl-[1rem] pr-[36px] py-[8px] rounded bg-[#0F6D5E]" style={{ appearance: "none" }}>
              <option>Phòng hành chính nhân sự</option>
              <option>Phòng kế toán</option>
              <option>Phòng IT</option>
            </select>

          </div>}
        </div>
      </div>}
    </div >
  )
};

export default ChatPage;
