// ============================================
// Register Page - Gọi API /User/Create_User
// ============================================

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  DatePicker,
  Radio,
  Modal,
  Avatar,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  SmileOutlined,
  EditOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services";
import { setUser } from "@/utils/auth";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. Đăng ký
      await authService.register({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        fullName: values.fullName,
        gender: values.gender ?? true,
        birthday: values.birthday
          ? values.birthday.format("DD-MM-YYYY")
          : "",
        bio: values.bio || "",
      });

      // 2. Tự động đăng nhập luôn
      const loginRes = await authService.login({
        email: values.email,
        password: values.password,
      });

      const userData = loginRes?.data || loginRes;
      if (userData) {
        setUser(userData);
      }

      // 3. Popup chào mừng
      Modal.success({
        icon: null,
        centered: true,
        okText: "Bắt đầu nào!",
        okButtonProps: {
          style: {
            background: "linear-gradient(135deg, #f3ce83 0%, #d4a54a 100%)",
            border: "none",
            borderRadius: 8,
            height: 40,
            fontWeight: 600,
            color: "#1a1a1a",
          },
        },
        content: (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <Avatar
              size={72}
              src={userData?.picture}
              icon={!userData?.picture && <SmileOutlined />}
              style={{ marginBottom: 16, border: "3px solid #f0f0f0" }}
            />
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Chào mừng, {userData?.fullName || values.fullName}! 🎉
            </div>
            <div style={{ color: "#888", fontSize: 14 }}>
              Tài khoản đã được tạo thành công
            </div>
          </div>
        ),
        onOk: () => navigate("/"),
      });
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
          name="fullName"
          label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Nhập họ và tên"
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
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
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

        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            name="gender"
            label={<span style={{ fontWeight: 500 }}>Giới tính</span>}
            initialValue={true}
            style={{ flex: 1 }}
          >
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="birthday"
            label={<span style={{ fontWeight: 500 }}>Ngày sinh</span>}
            style={{ flex: 1 }}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="DD-MM-YYYY"
              style={{ borderRadius: 10, height: 48, width: "100%" }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="bio"
          label={<span style={{ fontWeight: 500 }}>Giới thiệu bản thân</span>}
        >
          <Input.TextArea
            placeholder="Viết vài dòng về bạn..."
            rows={2}
            style={{ borderRadius: 10 }}
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
              background: "linear-gradient(135deg, #f3ce83 0%, #d4a54a 100%)",
              border: "none",
              boxShadow: "0 4px 15px rgba(243, 206, 131, 0.4)",
              color: "#1a1a1a",
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
          style={{ fontWeight: 600, color: "#f3ce83" }}
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
