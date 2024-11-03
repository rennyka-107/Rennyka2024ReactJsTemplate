import MasterLayout from "@/layouts/master";
import ChatPage from ".";

const ChatRouter = [
  {
    path: "chat",
    element: <ChatPage />,
    private: true
  },
];

export default ChatRouter;
