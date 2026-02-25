// ============================================
// Main Layout - Layout chính với Sidebar + Header + Footer
// ============================================

import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Modal } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FireOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout as doLogout } from "@/utils/auth";

const { Header, Sider, Content, Footer } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <FireOutlined />,
    label: "Khám phá",
  },
  {
    key: "/matches",
    icon: <HeartOutlined />,
    label: "Matches",
  },
  {
    key: "/profile",
    icon: <UserOutlined />,
    label: "Trang cá nhân",
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Tài khoản",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      Modal.confirm({
        title: "Đăng xuất",
        content: "Bạn có chắc muốn đăng xuất?",
        okText: "Đăng xuất",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          doLogout();
          navigate("/login");
        },
      });
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#111" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#1a1a1a", borderRight: "1px solid #2a2a2a" }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
            color: "#f3ce83",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          {!collapsed && (
            <img
              src="https://res.cloudinary.com/depqidlgv/image/upload/v1771854520/455646505_10226057102397556_5136531480083115955_n_w9rwtc.jpg"
              alt="Logo"
              style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }}
            />
          )}
          {collapsed ? "MC" : "MiniClique"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, background: "#1a1a1a" }}
        />
      </Sider>

      <Layout style={{ background: "#111" }}>
        <Header
          style={{
            padding: "0 24px",
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: "pointer", color: "#f3ce83" },
            }
          )}

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                src={user?.picture}
                icon={!user?.picture && <UserOutlined />}
                style={{ border: "2px solid #f3ce83" }}
              />
              <span style={{ color: "#fff" }}>{user?.fullName || "User"}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#1a1a1a",
            borderRadius: 12,
            minHeight: 280,
            overflow: "auto",
            border: "1px solid #2a2a2a",
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            background: "#1a1a1a",
            borderTop: "1px solid #2a2a2a",
            padding: "16px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 18 }}>
              <FacebookOutlined />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 18 }}>
              <InstagramOutlined />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f3ce83", fontSize: 18 }}>
              <TwitterOutlined />
            </a>
            <a href="mailto:contact@miniclique.com" style={{ color: "#f3ce83", fontSize: 18 }}>
              <MailOutlined />
            </a>
          </div>
          <div style={{ color: "#666", fontSize: 12 }}>
            © 2026 MiniClique. All rights reserved.
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
