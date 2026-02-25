// ============================================
// Auth Layout - Beautiful centered layout for Login / Register
// ============================================

import { Layout, Typography } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

const AuthLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "url('https://res.cloudinary.com/depqidlgv/image/upload/v1772032342/462081644_122116573814484983_9014429602020064447_n_os3exm.png') center center / cover no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
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
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <img
              src="https://res.cloudinary.com/depqidlgv/image/upload/v1771854520/455646505_10226057102397556_5136531480083115955_n_w9rwtc.jpg"
              alt="MiniClique Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#f3ce83",
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
            background: "#1e1e1e",
            borderRadius: 16,
            padding: "40px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            border: "1px solid #333",
          }}
        >
          <Outlet />
        </div>

        {/* Footer with social icons */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 12 }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 20 }}>
              <FacebookOutlined />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 20 }}>
              <InstagramOutlined />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 20 }}>
              <TwitterOutlined />
            </a>
            <a href="mailto:contact@miniclique.com" style={{ color: "#f3ce83", fontSize: 20 }}>
              <MailOutlined />
            </a>
          </div>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            © 2026 MiniClique. All rights reserved.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
