import styled from "styled-components";
import { Button, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import supabase from "../supabase";

const LoginPanner = ({ setIsLogined }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setIsLogined(true);
    }
  }, []);

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "인증에 실패하였습니다. 코드를 확인해주세요.",
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    let { data: user, error } = await supabase
      .from("users")
      .select("id,name")
      .eq("code", code);

    if (user.length > 0) {
      setIsLogined(true);
      localStorage.setItem("user", JSON.stringify(user[0]));
    } else {
      errorMessage();
    }
    setCode("");
    setIsLoading(false);
  };

  return (
    <Body>
      {contextHolder}

      <Container>
        <LogoImage src="/image/Logo1.png" alt="" />
        <Input.Password
          placeholder="Authentication Code"
          prefix={<UserOutlined />}
          style={{ marginBottom: 10 }}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={handleLogin}
          value={code}
        />

        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
      </Container>
      {isLoading && <Loading />}
    </Body>
  );
};

export default LoginPanner;

const Container = styled.div`
  width: 400px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10px 60px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 10px;
`;

const LogoImage = styled.img`
  width: 260px;
  padding-bottom: 28px;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
