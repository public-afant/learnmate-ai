import styled from "styled-components";
import { useEffect, useState } from "react";
import LoginPanner from "./Components/LoginPanner";
import MainPanner from "./Components/MainPanner";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Admin/Login";
import Admin from "./Pages/Admin/Admin";
import Faculty from "./Pages/Faculty/Faculty";
import FacultyLogin from "./Pages/Faculty/FacultyLogin";

function App() {
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {}, []);

  return (
    <BackGround>
      <Routes>
        <Route
          path="/login"
          element={
            isLogined ? (
              <Navigate replace to="/" />
            ) : (
              <LoginPanner setIsLogined={setIsLogined} />
            )
          }
        />
        <Route
          path="/"
          element={
            !isLogined ? (
              <Navigate replace to="/login" />
            ) : (
              <MainPanner setIsLogined={setIsLogined} />
            )
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<Login />} />

        <Route path="/faculty" element={<Faculty />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />

        {/* {isLogined === false ? (
          <LoginPanner setIsLogined={setIsLogined} />
        ) : (
          <MainPanner setIsLogined={setIsLogined} />
        )} */}
      </Routes>
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
