// ============================================
// Auth Layout - Beautiful centered layout for Login / Register
// ============================================

import { Layout, Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

const AuthLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating background shapes */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-15%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <Content
        style={{
          width: "100%",
          maxWidth: 440,
          margin: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              marginBottom: 16,
            }}
          >
            <TeamOutlined style={{ fontSize: 32, color: "#fff" }} />
          </div>
          <div>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              MiniClique
            </Text>
          </div>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
            Kết nối nhóm nhỏ, tạo nên điều lớn lao
          </Text>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "40px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <Outlet />
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            © 2026 MiniClique. All rights reserved.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
