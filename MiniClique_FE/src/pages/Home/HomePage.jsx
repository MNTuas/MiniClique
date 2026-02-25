// ============================================
// Home Page - Trang chủ
// ============================================

import { Typography, Card, Row, Col, Statistic } from "antd";
import { UserOutlined, FileOutlined, TeamOutlined } from "@ant-design/icons";

const { Title } = Typography;

const HomePage = () => {
  return (
    <div>
      <Title level={3}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Người dùng"
              value={120}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bài viết"
              value={350}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Nhóm"
              value={25}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
