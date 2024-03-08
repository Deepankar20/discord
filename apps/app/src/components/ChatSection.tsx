import { currentChat } from "@/atom/currentChat";
import { useSocket } from "@/context/SocketProvider";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chat } from "@/atom/chat";

import jwt from "jsonwebtoken";

const ChatSection = () => {
  const currChat = useRecoilValue(currentChat);

  const [fromEmail, setFromEmail] = useState<string>();
  const [value, setValue] = useState<string>();

  interface Imsg {
    from: string;
    to: string;
    content: string;
  }

  const { messages } = useSocket();

  const [message, setMessage] = useState({
    from: "",
    to: "",
    content: "",
  });
  const { sendMessage } = useSocket();

  const handleChange = (e: any) => {
    const content = e.target.value;
    setValue(content);

    const from = jwt.decode(localStorage.getItem("token") as string)?.email;
    setFromEmail(from);
    setMessage({ from, to: currChat, content });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setValue("");
    //@ts-ignore
    sendMessage(message);
  };

  // setMessages([{from:"deep1", to:"deep2", content:"hello"}])
  return (
    <div>
      <div
        className="flex flex-col gap-2 max-h-screen
       overflow-y-auto p-2"
      >
        {messages.map((msg: Imsg) => {
          return (
            ((msg.to === currChat && msg.from === fromEmail) ||
              (msg.to === fromEmail && msg.from === currChat)) && (
              <div
                className={`text-white bg-blue-700 w-fit p-5 pb-1 pt-1 rounded-l-none rounded-tl-lg rounded-lg rounded-br-lg rounded-r-none`}
                style={{ marginLeft: `${msg.from === fromEmail ? "76vw":""}` }}
              >
                {msg.content}
              </div>
            )
          );
        })}
      </div>
      <form className="fixed bottom-0 p-3" onSubmit={handleSubmit}>
        <input
          type="text"
          className="text-black rounded-sm w-[72vw] h-10"
          onChange={handleChange}
          value={value}
        />
        <button className="bg-blue-500  h-10 w-20  rounded-sm">send</button>
      </form>
    </div>
  );
};

export default ChatSection;
