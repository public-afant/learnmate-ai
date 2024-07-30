import { Button, Input } from "antd";
import { useState } from "react";
import styled from "styled-components";
import supabase from "../supabase";

const Preview = ({ title, subTitle, setIsStart, setRoomId }) => {
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const buildRoom = async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .insert([
          {
            fk_user_id: user.id,
            title: input,
            state: 1,
            plan: {},
            prev_plan: {},
            thread_id: "",
          },
        ])
        .select();

      setRoomId(data[0].id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = () => {
    if (input === "") {
      return;
    }
    buildRoom();
    setIsStart(true);
  };

  return (
    <Container>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
      <Input
        className="title"
        placeholder="ex) Computers / Software"
        onChange={(e) => setInput(e.target.value)}
      />

      <Button className="button" type="primary" block onClick={handleNext}>
        Next
      </Button>
    </Container>
  );
};

export default Preview;

const Container = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    width: 300px;
    margin-bottom: 20px;
  }
  .button {
    width: 300px;
  }
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #512d83;
  margin-bottom: 10px;
`;
const SubTitle = styled.div`
  color: #979797;
  margin-bottom: 15px;
  font-size: 16px;
`;
