// ============================================
// Login Page - Gọi API /User/Login
// ============================================

import { useState } from "react";
import { Form, Input, Button, Typography, Divider, Modal, Avatar, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services";
import { setUser } from "@/utils/auth";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // response đã qua interceptor => response = response.data gốc
      // Cấu trúc: { success, data: {...}, message }
      const result = response;
      const userData = result?.data || result;

      // Lưu toàn bộ user data vào localStorage
      if (userData) {
        setUser(userData);
      }

      // Hiện popup chào mừng
      Modal.success({
        icon: null,
        centered: true,
        okText: "Bắt đầu nào!",
        okButtonProps: {
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: 8,
            height: 40,
            fontWeight: 600,
          },
        },
        content: (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <Avatar
              size={72}
              src={userData?.picture}
              icon={!userData?.picture && <SmileOutlined />}
              style={{
                marginBottom: 16,
                border: "3px solid #f0f0f0",
              }}
            />
            <div
              style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}
            >
              Xin chào, {userData?.fullName || "bạn"}! 👋
            </div>
            <div style={{ color: "#888", fontSize: 14 }}>
              Chào mừng bạn quay trở lại MiniClique
            </div>
          </div>
        ),
        onOk: () => navigate("/"),
      });
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Email hoặc mật khẩu không đúng!";
      message.error(typeof errMsg === "string" ? errMsg : "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          Chào mừng trở lại!
        </Title>
        <Text type="secondary">Đăng nhập để tiếp tục với MiniClique</Text>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={<span style={{ fontWeight: 500 }}>Email</span>}
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập email"
            style={{ borderRadius: 10, height: 48 }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập mật khẩu"
            style={{ borderRadius: 10, height: 48 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={<LoginOutlined />}
            style={{
              height: 48,
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "16px 0", color: "#d9d9d9", fontSize: 13 }}>
        hoặc
      </Divider>

      <div style={{ textAlign: "center" }}>
        <Text type="secondary">Chưa có tài khoản? </Text>
        <Link
          to="/register"
          style={{ fontWeight: 600, color: "#764ba2" }}
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
