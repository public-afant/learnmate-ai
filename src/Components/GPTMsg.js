import { Button } from "antd";
import { useEffect } from "react";
import styled from "styled-components";

const GPTMsg = ({ message: obj, setPlanJson }) => {
  //   console.log(obj.json);
  useEffect(() => {
    if (obj.json) setPlanJson(obj.json);
  }, []);

  const handleButton = (json) => {
    console.log(json);
  };
  return (
    <>
      <div>{obj.message}</div>
      {obj.json !== undefined && (
        <PlanButton
          type="primary"
          size={"small"}
          onClick={() => handleButton(obj.json)}
        >
          View Plan
        </PlanButton>
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
