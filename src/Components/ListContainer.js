import styled from "styled-components";
import { Button, List, message, Tag, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../supabase";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import SOPModal from "./SOPModal";

const ListContainer = ({ setIsNewChat, setSelRoomId }) => {
  const [roomList, setRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [plan, setPlan] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isEdit, setIsEdit] = useState(false);

  const setStateTag = (value) => {
    let data = { name: "", color: "" };
    if (value === 1) {
      data.name = "Interest Set";
      data.color = "red";
    } else if (value === 2) {
      data.name = "Planning";
      data.color = "orange";
    } else if (value === 3) {
      data.name = "Waiting";
      data.color = "purple";
    } else if (value === 4) {
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

  const handleTitle = (item) => {
    setSelRoomId(item.id);
  };

  const handleDeleteItem = async (item) => {
    // setIsLoading(true);
    const response = await supabase.from("rooms").delete().eq("id", item.id);
    getList();
    // console.log(response);
    // setIsLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      {contextHolder}
      {isLoading && <Loading />}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Button
          type="link"
          size="small"
          danger={isEdit}
          onClick={() => setIsEdit(!isEdit)}
          style={{
            color: "#512d83",
          }}
        >
          {!isEdit ? "Edit" : "Cancel"}
        </Button>
      </div>
      <List
        dataSource={roomList}
        renderItem={(item, index) => {
          return (
            <Item key={index} style={{ height: 50 }}>
              <ItemTitle
                onClick={() => {
                  if (item.state === 3) {
                    messageApi.open({
                      type: "warning",
                      content: "It's not the study period yet. Please wait.",
                    });
                    return;
                  }
                  handleTitle(item);
                }}
              >
                {item.title}
              </ItemTitle>
              <StateTitle>
                {Object.keys(item.plan).length !== 0 && (
                  <>
                    <div
                      className="plan"
                      onClick={() => {
                        setIsModal(true);
                        setPlan(item.plan);
                      }}
                    >
                      Statement of Purpose
                    </div>
                  </>
                )}
                <Tag className="tag" color={setStateTag(item.state).color}>
                  {setStateTag(item.state).name}
                </Tag>
                {isEdit && (
                  <Popconfirm
                    title="Delete the room."
                    description="Are you sure to delete this room?"
                    onConfirm={() => handleDeleteItem(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="delete"
                      type="text"
                      danger
                      size="small"
                      style={{ fontSize: 12 }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                )}
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

      {isModal && (
        <SOPModal setIsModal={setIsModal} json={plan} type={"view"} />
      )}
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
