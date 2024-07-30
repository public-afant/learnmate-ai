import styled from "styled-components";
import { useState } from "react";
import LoginPanner from "./Components/LoginPanner";
import MainPanner from "./Components/MainPanner";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  return (
    <BackGround>
      {isLogined === false ? (
        <LoginPanner setIsLogined={setIsLogined} />
      ) : (
        <MainPanner setIsLogined={setIsLogined} />
      )}
      <Footer>
        <FooterTitle>{"TAEJAE EPT(Education Planning Team)"}</FooterTitle>
      </Footer>
    </BackGround>
  );
}

export default App;

const BackGround = styled.div`
  width: 100vw;
  height: 100vh;
  /* justify-content: center;
  align-items: center; */
  display: flex;
  /* flex-direction: column; */
`;

const Footer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
`;

const FooterTitle = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  color: #979797;
  padding-bottom: 10px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;
