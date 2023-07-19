import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { useEffect, useState } from "react";
// import EmojiPicker from "emoji-picker-react";

export default function Chat() {
  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.addEventListener("message", handleMessage);
  }, []);
  const handleMessage = (e) => {
    console.log("new message", e.data);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // Send the message
      console.log("Message sent:", message);
      // Clear the input field
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      <div className=" w-1/5 bg-clr-400">contacts</div>
      <div className=" w-4/5 flex flex-col">
        <div className="flex-grow">messages with selected person</div>
        <div
          className="bg-white p-2 flex items-center mx-3 my-4 rounded-md"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
          }}
        >
          <GrAttachment size={22} />
          {/* <EmojiPicker onEmojiClick={handleMessageChange} /> */}
          <input
            type="text"
            placeholder="type your message..."
            className="bg-white p-2 outline-none flex-grow text-md"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`ml-2 p-2 ${
              message.trim() === ""
                ? "opacity-30 cursor-not-allowed"
                : "bg-clr-450 text-white p-2  rounded-md"
            }`}
            onClick={handleSendMessage}
            disabled={message.trim() === ""}
          >
            <IoSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
