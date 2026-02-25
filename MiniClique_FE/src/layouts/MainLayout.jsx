// ============================================
// Main Layout - Layout chính với Sidebar + Header
// ============================================

import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Space, Modal } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FireOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout as doLogout } from "@/utils/auth";

const { Header, Sider, Content } = Layout;

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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
            color: "#1677ff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {collapsed ? "MC" : "MiniClique"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: "pointer" },
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
              />
              <span>{user?.fullName || "User"}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
