import styled from "styled-components";
import { Button, List, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../supabase";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const ListContainer = ({ setIsNewChat, setSelRoomId }) => {
  const [roomList, setRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const setStateTag = (value) => {
    let data = { name: "", color: "" };
    if (value === 1) {
      data.name = "Interest Set";
      data.color = "red";
    } else if (value === 2) {
      data.name = "Planning";
      data.color = "orange";
    } else if (value === 3) {
      data.name = "Learning";
      data.color = "green";
    } else {
      data.name = "End";
      data.color = "gray";
    }

    return data;
  };

  const getList = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    let { data: list, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("fk_user_id", user.id);

    setRoomList(list);
    setIsLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <List
        dataSource={roomList}
        renderItem={(item, index) => {
          return (
            <Item key={index}>
              <ItemTitle onClick={() => setSelRoomId(item.id)}>
                {item.title}
              </ItemTitle>
              <StateTitle>
                <div className="plan">학습계획서</div>
                <Tag className="tag" color={setStateTag(item.state).color}>
                  {setStateTag(item.state).name}
                </Tag>
              </StateTitle>
            </Item>
          );
        }}
      />
      <AddContainer>
        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          shape="circle"
          onClick={() => {
            setIsNewChat(true);
          }}
        />
      </AddContainer>
    </>
  );
};

export default ListContainer;

// const data1 = [];

const ItemTitle = styled.div`
  color: "#512d83";
  font-weight: 600;
  cursor: pointer;
`;
const StateTitle = styled.div`
  display: flex;
  align-items: center;
  .plan {
    margin-right: 20px;
    font-size: 12px;
    color: #512d83;
    font-weight: 600;
    cursor: pointer;
  }

  .tag {
    width: 70px;
    text-align: center;
    font-size: 10px;
  }
`;

const Item = styled(List.Item)`
  /* cursor: pointer; */
`;

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
`;
