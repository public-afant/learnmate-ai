import { Button, Table } from "antd";
import styled from "styled-components";

const SOPModal = ({ json, setIsModal }) => {
  console.log(json);

  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const today = `${year}-${month}-${day}`;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Body>
      <Container>
        <Nav>
          <Button onClick={() => setIsModal(false)}>Exit</Button>
          {/* <Button
            type="primary"
            style={{ marginLeft: 10, width: 100 }}
            onClick={() => setIsModal(false)}
          >
            Save
          </Button> */}
        </Nav>
        <Page>
          <Section style={{ textAlign: "right" }}>
            <img
              src={`${process.env.PUBLIC_URL}/image/Logo1.png`}
              style={{ width: 200 }}
            />
          </Section>
          <Section>
            <div className="title"># Project Name.</div>
            <div className="main-title">{json.project_name}</div>
          </Section>

          <Section>
            <div className="info"># Learner : {user.name}</div>
            <div className="info">
              # Date of creation : {!json.date && today}
            </div>
          </Section>

          <Section>
            <div className="title"># Project Description</div>
            <div className="sub-title">{json.project_description}</div>
          </Section>

          <Section>
            <div className="title"># Recommended Learning Materials</div>
            {json.recommended_learning_materials.map((item, idx) => {
              return (
                <div className="sub-title" key={idx}>
                  - {item}
                </div>
              );
            })}
          </Section>

          <Section>
            <div className="title"># Project Schedule</div>
            <Table
              columns={columns}
              dataSource={json.learning_plan}
              pagination={false}
            />
          </Section>
        </Page>
      </Container>
    </Body>
  );
};

export default SOPModal;

const columns = [
  {
    title: "Week",
    dataIndex: "week",
    key: "week",
    width: 82,
    render: (text) => <div>Week {text}</div>,
  },
  {
    title: "Inquiry Question",
    dataIndex: "inquiry_question",
    key: "inquiry_question",
    // render: (text) => <div>Week {text}</div>,
  },
  {
    title: "Referense Materials",
    dataIndex: "reference_materials",
    key: "reference_materials",
    render: (item) => item.map((text, idx) => <div key={idx}>- {text}</div>),
  },
  {
    title: "Learning Activity",
    dataIndex: "learning_activity",
    key: "learning_activity",
  },
];

const Body = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 99;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const Container = styled.div`
  width: 1000px;
  max-height: 900px;
  background-color: white;
  border-radius: 15px;
  padding: 20px;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow: auto;
`;

const Nav = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

const Page = styled.div`
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid black;
`;

const Section = styled.div`
  width: 100%;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  padding-top: 20px;
  padding-bottom: 20px;

  .main-title {
    font-size: 20px;
    font-weight: bold;
  }

  .title {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .sub-title {
  }

  .info {
    font-weight: bold;
    font-size: 16px;
  }
`;
