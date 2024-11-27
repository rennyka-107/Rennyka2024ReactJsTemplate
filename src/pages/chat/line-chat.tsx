import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useUserStore } from '../authenticate/state';

type Props = {
    msg: {
        id: string;
        sender: 'bot' | 'user',
        text: string;
        isReply?: boolean;
        question?: string;
        question_id?: string;
        is_like: boolean;
    },
    setMessage: Function;
    setCallFarvoriteQuestion: Function;
}

const LineChat = memo(({ msg, setMessage, setCallFarvoriteQuestion }: Props) => {

    const [headScripts, setHeadScripts] = useState([]);
    const [inlineHeadScripts, setInlineHeadScripts] = useState([]);
    const [bodyScripts, setBodyScripts] = useState([]);
    const { user } = useUserStore();

    // console.log(user, "user")

    useEffect(() => {
        if (msg.isReply) {
            hljs.highlightAll();
            fetch('https://apivpb.vtrusted.vn/add-to-history', {
                method: "POST",
                body: JSON.stringify({
                    data: msg,
                    role: user.role,
                    id: msg.id
                })
            }).then(res => res.json).then(res => { console.log("Them bot answer vao lich su chat") })
        }

    }, [msg.isReply]);

    function like_answer(like: boolean) {
        setMessage((prevMessages) => {
            const lastMessageIndex = prevMessages.findIndex(ms => ms.id === msg.id);
            const updatedMessages = [...prevMessages];
            updatedMessages[lastMessageIndex] = {
                ...updatedMessages[lastMessageIndex],
                is_like: like
            };
            return updatedMessages;
        }
        );
        fetch('https://apivpb.vtrusted.vn/like', {
            method: "POST",
            body: JSON.stringify({
                answer_id: msg.id,
                is_like: like
            })
        }).then(res => res.json).then(res => {setTimeout(() => setCallFarvoriteQuestion((pre) => pre + 1), 2000); console.log("Da like thanh cong") })
    }

    useEffect(() => {
        if (msg && msg.sender === 'bot' && msg.text && msg.isReply) {
            const headContent = msg.text?.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
            const bodyContent = msg.text?.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "";

            const newHeadScripts = [...headContent.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/gi)].map(
                (match) => match[1]
            );
            const newInlineHeadScripts = [...headContent.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
                (match) => match[1]
            );
            const newBodyScripts = [...bodyContent.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
                (match) => match[1]
            );

            setHeadScripts([...headScripts, ...newHeadScripts])
            setInlineHeadScripts([...inlineHeadScripts, ...newInlineHeadScripts])
            setBodyScripts([...bodyScripts, ...newBodyScripts])

            const loadScripts = [...newHeadScripts].map((src) => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.onload = resolve; // Đảm bảo thư viện đã tải xong
                    document.head.appendChild(script);
                });
            });

            // Sau khi các thư viện từ CDN được tải xong
            Promise.all(loadScripts).then(() => {
                // Thực thi các script inline trong <head>
                [...newInlineHeadScripts].forEach((scriptContent) => {
                    const newScript = document.createElement("script");
                    newScript.textContent = scriptContent;
                    document.head.appendChild(newScript);
                    document.head.removeChild(newScript);
                });

                // Thực thi các script trong <body> sau khi render
                [...newBodyScripts].forEach((scriptContent) => {
                    const newScript = document.createElement("script");
                    newScript.textContent = scriptContent;
                    document.body.appendChild(newScript);
                    document.body.removeChild(newScript);
                });
            });

        }


    }, [msg.isReply])

    const isHtmlDocument = (inputString: string) => {
        const htmlRegex = /^\s*<html[\s\S]*<\/html>\s*$/i;
        return htmlRegex.test(inputString);
    }

    const renderResponse = () => {
        const data = msg.text.split(/(<html[\s\S]*?<\/html>)/i)
        return data.map((d, idx) => {
            if (isHtmlDocument(d)) {
                return <div
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: d }}
                    className="markdown-container w-full desktop:w-[50%]"
                />
            }

            // if (msg.sender === 'user') {
            return <div key={idx} className="markdown-container">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {d}
                </ReactMarkdown>
            </div>
            // }

        })

    }

    return (
        <div id={msg.id} className="detail-chat" style={{ justifyContent: msg.sender === 'user' ? 'end' : 'start' }}>
            <div className={`${msg.sender === 'user' ? 'user-message' : 'bot-message'} w-[fit-content] max-w-[100%] desktop:max-w-[90%] flex gap-3`} >
                {msg.sender === 'user' ? <div className="bg-[#0F6D5E] text-[13px] rounded-[50%] w-[37px] h-[37px] min-h-[37px] min-w-[37px] flex justify-center items-center text-white">
                    You
                </div> : <svg className='min-w-[37px]' width={37} height={27} viewBox="0 0 37 27" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width={37} height={27} fill="url(#pattern0_1_13793)" />
                    <defs>
                        <pattern id="pattern0_1_13793" patternContentUnits="objectBoundingBox" width={1} height={1}>
                            <use xlinkHref="#image0_1_13793" transform="matrix(0.0123683 0 0 0.0169492 -0.00710032 0)" />
                        </pattern>
                        <image id="image0_1_13793" width={82} height={59} xlinkHref="data:image/png;base64,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" />
                    </defs>
                </svg>
                }
                <div
                    // dangerouslySetInnerHTML={{ __html: msg.text }}
                    className={`max-w-full w-[fit-content] flex items-start flex-col ${msg.sender === 'bot' ? "bg-white" : "bg-[#F8F9FB]"} rounded-[8px] desktop:px-[16px] px-[8px] ${msg.sender === 'bot' ? "py-[8px] pt-0" : "py-[8px]"} font-[500]`}>
                    {/* {msg.text} */}
                    {renderResponse()}
                    {msg.sender === 'bot' && <div onClick={() => like_answer(!msg.is_like)} className={`cursor-pointer flex-1 ${msg.is_like ? "bg-[#EBFED7]" : "bg-[white]"} hover:bg-[#EBFED7] max-w-[38px] max-h-[38px] min-w-[38px] min-h-[38px] flex justify-center items-center`}>
                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className={`${msg.is_like ? "fill-[#0F6D5E]" : "fill-[black]"} hover:fill-[#0F6D5E]`} fillRule="evenodd" clipRule="evenodd" d="M3.74973 2.9494C2.64374 3.45496 1.8335 4.65743 1.8335 6.09134C1.8335 7.55627 2.43297 8.68543 3.29235 9.65312C4.00065 10.4507 4.85805 11.1117 5.69425 11.7563C5.89285 11.9095 6.09026 12.0617 6.28419 12.2145C6.63488 12.491 6.94771 12.7336 7.24924 12.9098C7.55092 13.0861 7.79376 13.1666 8.00016 13.1666C8.20656 13.1666 8.4494 13.0861 8.75109 12.9098C9.05261 12.7336 9.36544 12.491 9.71613 12.2145C9.91006 12.0617 10.1075 11.9095 10.3061 11.7563C11.1423 11.1117 11.9997 10.4507 12.708 9.65312C13.5674 8.68543 14.1668 7.55627 14.1668 6.09134C14.1668 4.65743 13.3566 3.45496 12.2506 2.9494C11.1761 2.45826 9.73239 2.58832 8.36041 4.01376C8.26615 4.11169 8.13608 4.16703 8.00016 4.16703C7.86424 4.16703 7.73418 4.11169 7.63992 4.01376C6.26794 2.58832 4.82421 2.45826 3.74973 2.9494ZM8.00016 2.97248C6.45879 1.59344 4.7328 1.40052 3.334 2.03991C1.85664 2.71522 0.833496 4.28329 0.833496 6.09134C0.833496 7.86836 1.57383 9.22397 2.54464 10.3171C3.32208 11.1926 4.27364 11.9252 5.11405 12.5723C5.30455 12.719 5.48935 12.8613 5.66511 12.9999C6.0066 13.2691 6.37319 13.5561 6.74471 13.7732C7.11607 13.9902 7.5399 14.1666 8.00016 14.1666C8.46043 14.1666 8.88426 13.9902 9.25561 13.7732C9.62713 13.5561 9.99373 13.2691 10.3352 12.9999C10.511 12.8613 10.6958 12.719 10.8863 12.5723C11.7267 11.9252 12.6782 11.1926 13.4557 10.3171C14.4265 9.22397 15.1668 7.86836 15.1668 6.09134C15.1668 4.28329 14.1437 2.71522 12.6663 2.03991C11.2675 1.40052 9.54153 1.59344 8.00016 2.97248Z" />
                        </svg>
                    </div>}
                </div>

            </div>

        </div>
    )
})

export default LineChat

// const TypingEffect = ({ text, typingSpeed = 10 }) => {
//     const [displayedText, setDisplayedText] = useState('');

//     useEffect(() => {
//         if (text && text.length > 0) {
//             let i = 0;
//             const intervalId = setInterval(() => {
//                 setDisplayedText((prev) => { console.log(prev, "prev"); return prev + text[i] });
//                 i++;
//                 if (i === text.length) {
//                     clearInterval(intervalId); // Dừng lại khi gõ hết chữ
//                 }
//             }, typingSpeed); // Tốc độ gõ chữ

//             return () => clearInterval(intervalId); // Cleanup khi component unmount
//         }


//     }, [text, typingSpeed]);

//     return <div className="markdown-container">
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//             {displayedText}
//         </ReactMarkdown>
//     </div>
// };

