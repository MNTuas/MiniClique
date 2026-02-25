// ============================================
// Login Page - Gọi API /User/Login
// ============================================

import { useState } from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services";
import { saveCredentials, setUser } from "@/utils/auth";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login({
        userName: values.userName,
        password: values.password,
      });

      // Lưu username, password, role vào localStorage
      const userData = response?.data || response;

      saveCredentials({
        userName: values.userName,
        password: values.password,
        role: userData?.role || userData?.Role || "USER",
      });

      // Lưu full user info nếu có
      if (userData) {
        setUser(userData);
      }

      message.success("Đăng nhập thành công! 🎉");
      navigate("/");
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Tên đăng nhập hoặc mật khẩu không đúng!";
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
          name="userName"
          label={<span style={{ fontWeight: 500 }}>Tên đăng nhập</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập tên đăng nhập"
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
