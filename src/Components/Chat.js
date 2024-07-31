import { Button, Divider, Input, Spin, message, Popconfirm } from "antd";
import styled from "styled-components";
import { SendOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import supabase from "../supabase";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import GPTMsg from "./GPTMsg";

const confirm = (e) => {
  console.log(e);
  message.success("Click on Yes");
};

const Chat = ({ roomId, action }) => {
  // console.log("Chat : ", roomId);
  const messageEndRef = useRef();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [state, setState] = useState(1);
  const [roomInfo, setRoomInfo] = useState({});

  const [planJson, setPlanJson] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getRoomInfo();
    if (action) {
      getChats();
    }
  }, []);

  useEffect(() => {
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  });

  const getRoomInfo = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("title,thread_id,state,id")
      .eq("id", roomId);
    setRoomInfo(data[0]);
    setThreadId(data[0].thread_id);
    setState(data[0].state);
  };

  const getChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .eq("fk_room_id", roomId);

    const result = data.map((item) => {
      return {
        message: item.message,
        createdAt: item.created_at,
        role: item.role,
      };
    });

    setChats(result);
  };

  const getAssistantMSG = async (msg, thread, idx) => {
    try {
      setMsgLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_NODE_BASE_URL}/message`,
        {
          userMessage: msg,
          threadId: thread,
          type: idx,
        }
      );
      if (threadId === "") {
        setThreadId(data.threadId);
        await supabase
          .from("rooms")
          .update({ thread_id: data.threadId })
          .eq("id", roomId)
          .select();
      }

      setMsgLoading(false);

      // console.log(data);

      insertMessage(data.assistant, "assistant");
    } catch (e) {
      console.log(e);
    }
  };

  const insertMessage = async (msg, role) => {
    try {
      const { data } = await supabase
        .from("chats")
        .insert([
          {
            fk_user_id: user.id,
            fk_room_id: roomInfo.id,
            message: msg,
            role: role,
          },
        ])
        .select();
      // console.log(data, role);

      setChats((prev) => [
        ...prev,
        { message: msg, createdAt: "", role: role },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMessage = async () => {
    if (message !== "") {
      // User Chat Process
      insertMessage(message, "user");

      //Assistant Chat Process
      getAssistantMSG(message, threadId, state);

      setMessage("");
    }
  };

  const changeInputValueHandler = (e) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
      handleMessage();
    }
  };

  const handleNextLevel = async () => {
    // console.log(chats);
    setState(2);
    setThreadId("");
    await supabase
      .from("rooms")
      .update({ state: 2, thread_id: "" })
      .eq("id", roomId)
      .select();
    getAssistantMSG(JSON.stringify(chats), "", 2);
  };

  const messageFilterFn = (text) => {
    // JSON 부분 추출하기
    const jsonStart = text.indexOf("```json");
    const jsonEnd = text.indexOf("```", jsonStart + 6);

    if (jsonStart === -1) return { message: text };

    // JSON 문자열 추출
    const jsonString = text.substring(jsonStart + 7, jsonEnd).trim();

    // 나머지 텍스트 추출
    const textOnly =
      text.substring(0, jsonStart).trim() +
      "\n" +
      text.substring(jsonEnd + 3).trim();

    // JSON 문자열을 객체로 파싱
    let jsonData;
    try {
      jsonData = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON 파싱 오류:", e);
    }

    return { message: textOnly, json: jsonData };
  };

  return (
    <Container>
      <ChatContainer ref={messageEndRef}>
        {chats.map((item, index) => {
          if (item.role === "user")
            return (
              <UserMessage key={index}>
                <Message className="user">{item.message}</Message>
              </UserMessage>
            );
          else if (item.role === "assistant")
            return (
              <GptMessage key={index}>
                <Message className="gpt">
                  <GPTMsg
                    message={messageFilterFn(item.message)}
                    setPlanJson={setPlanJson}
                  />
                </Message>
              </GptMessage>
            );
        })}

        {msgLoading && <Spin />}
      </ChatContainer>
      <Divider />
      <InputContainer>
        <Input
          placeholder="send message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={changeInputValueHandler}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{ marginLeft: 10, width: 50 }}
          onClick={handleMessage}
        />

        <Popconfirm
          title="Caution"
          description="I can't come back to the next one."
          onConfirm={handleNextLevel}
          okText="Yes"
          cancelText="Cancle"
        >
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            // onClick={handleNextLevel}
          >
            Next
          </Button>
        </Popconfirm>
      </InputContainer>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  flex: 9;
  /* margin-bottom: 10px; */
  overflow-y: auto;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InputContainer = styled.div`
  flex-direction: row;
  display: flex;
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: end;
  .user {
    /* max-width: 480px; */
    color: white;
    background-color: #512d83;
    border-radius: 10px;
  }
`;

const GptMessage = styled.div`
  display: flex;
  margin-right: 50px;
  .gpt {
    border-radius: 10px;
    border: 2px solid #512d83;
  }
`;

const Message = styled.div`
  white-space: pre-line;
  font-size: 14px;
  padding: 20px;
  margin-bottom: 20px;
`;

let a = {
  project_name: "",
  project_description: "",
  recommended_learning_materials: [],
  learning_plan: [
    {
      week: 1,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
    {
      week: 2,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
    {
      week: 3,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
  ],
};
