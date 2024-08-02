import { Button } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SOPModal from "./SOPModal";

const GPTMsg = ({
  message: obj,
  setPlanJson,
  roomId,
  setIsNewChat,
  setSelRoomId,
}) => {
  const [isModal, setIsModal] = useState(false);
  //   console.log(obj.json);
  useEffect(() => {
    if (obj.json) setPlanJson(obj.json);
  }, []);

  const handleButton = (json) => {
    // console.log(json);
    setIsModal(true);
  };
  return (
    <>
      <div>{obj.message}</div>
      {obj.json !== undefined && (
        <>
          <PlanButton
            type="primary"
            size={"small"}
            onClick={() => handleButton(obj.json)}
          >
            View Plan
          </PlanButton>
          {isModal && (
            <SOPModal
              json={obj.json}
              setIsModal={setIsModal}
              roomId={roomId}
              setIsNewChat={setIsNewChat}
              setSelRoomId={setSelRoomId}
            />
          )}
        </>
      )}
    </>
  );
};

export default GPTMsg;

const PlanButton = styled(Button)`
  font-size: 12px;
  margin-top: 10px;
  padding: 13px 15px;
`;
