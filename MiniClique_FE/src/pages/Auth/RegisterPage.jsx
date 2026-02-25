// ============================================
// Register Page - Gọi API /User/Create_User
// ============================================

import { useState } from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.register({
        userName: values.userName,
        email: values.email,
        password: values.password,
      });

      message.success("Đăng ký thành công! Hãy đăng nhập. 🎉");
      navigate("/login");
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Không thể đăng ký. Vui lòng thử lại!";
      message.error(typeof errMsg === "string" ? errMsg : "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          Tạo tài khoản mới
        </Title>
        <Text type="secondary">Tham gia MiniClique ngay hôm nay</Text>
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
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            { min: 3, message: "Tên đăng nhập ít nhất 3 ký tự!" },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập tên đăng nhập"
            style={{ borderRadius: 10, height: 48 }}
          />
        </Form.Item>

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
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập mật khẩu"
            style={{ borderRadius: 10, height: 48 }}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span style={{ fontWeight: 500 }}>Xác nhận mật khẩu</span>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập lại mật khẩu"
            style={{ borderRadius: 10, height: 48 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={<UserAddOutlined />}
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
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "16px 0", color: "#d9d9d9", fontSize: 13 }}>
        hoặc
      </Divider>

      <div style={{ textAlign: "center" }}>
        <Text type="secondary">Đã có tài khoản? </Text>
        <Link
          to="/login"
          style={{ fontWeight: 600, color: "#764ba2" }}
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
