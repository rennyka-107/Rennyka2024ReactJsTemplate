import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    msg: {
        id: string;
        sender: 'bot' | 'user',
        text: string;
    }
}

const LineChat = memo(({ msg }: Props) => {

    const [headScripts, setHeadScripts] = useState([]);
    const [inlineHeadScripts, setInlineHeadScripts] = useState([]);
    const [bodyScripts, setBodyScripts] = useState([]);

    useEffect(() => {
        if (msg && msg.sender === 'bot') {
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


    }, [msg])

    const isHtmlDocument = (inputString: string) => {
        const htmlRegex = /^\s*<html[\s\S]*<\/html>\s*$/i;
        return htmlRegex.test(inputString);
    }

    const highlightNumbers = (input: string) => {
        return input.replace(/(\d+)/g, '<span class="highlight-number">$1</span>');
    }

    const renderResponse = () => {
        const data = msg.text.split(/(<html[\s\S]*?<\/html>)/i)
        console.log(data, "Data")
        return data.map((d, idx) => {
            if (isHtmlDocument(d)) {
                return <div
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: d }}
                    className="markdown-container"
                />
            }
            return <div key={idx} className="markdown-container">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {d}
                </ReactMarkdown>
            </div>
        })

    }

    return (
        <div id={msg.id} className="detail-chat" style={{ justifyContent: msg.sender === 'user' ? 'end' : 'start' }}>
            <div className={`${msg.sender === 'user' ? 'user-message' : 'bot-message'} w-[fit-content] max-w-[100%] desktop:max-w-[50%] flex gap-3`} >
                {/* <div className="bg-[#0C7A2D] rounded-[50%] min-w-[50px] min-h-[50px] flex justify-center items-center text-white">
                    Y
                </div> */}
                <div
                    // dangerouslySetInnerHTML={{ __html: msg.text }}
                    className="w-full min-h-[50px] flex items-center flex-col bg-white rounded-[8px] px-[16px] py-[16px]">
                    {/* {msg.text} */}
                    {renderResponse()}
                </div>
            </div>
        </div>
    )
})

export default LineChat