// ============================================
// Profile Page - Trang cá nhân (chính mình)
// ============================================

import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Typography,
  Descriptions,
  Tag,
  Spin,
  Button,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { userService } from "@/services";
import { getUser } from "@/utils/auth";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const localUser = getUser();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localUser?.id) {
        setProfile(localUser);
        setLoading(false);
        return;
      }
      try {
        const res = await userService.getById(localUser.id);
        const data = res?.data || res;
        setProfile(data);
      } catch {
        // Fallback dùng data localStorage
        setProfile(localUser);
        message.warning("Dùng dữ liệu cached.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <div>Không tìm thấy thông tin.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header card */}
      <Card
        style={{
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover */}
        <div
          style={{
            height: 160,
            background: "linear-gradient(135deg, #1a1a1a 0%, #f3ce8340 100%)",
            position: "relative",
          }}
        />

        {/* Avatar + Name */}
        <div style={{ textAlign: "center", marginTop: -50, padding: "0 24px" }}>
          <Avatar
            size={100}
            src={profile.picture}
            icon={!profile.picture && <UserOutlined />}
            style={{
              border: "4px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
          <Title level={3} style={{ marginTop: 12, marginBottom: 0 }}>
            {profile.fullName || "Chưa đặt tên"}{" "}
            {profile.gender === true ? (
              <ManOutlined style={{ color: "#52a3ff", fontSize: 20 }} />
            ) : profile.gender === false ? (
              <WomanOutlined style={{ color: "#ff6b9d", fontSize: 20 }} />
            ) : null}
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {profile.email}
          </Text>
          {profile.status && (
            <div style={{ marginTop: 8 }}>
              <Tag color={profile.status === "Active" ? "green" : "default"}>
                {profile.status}
              </Tag>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{ padding: "16px 32px 0", textAlign: "center" }}>
            <Paragraph
              style={{
                fontStyle: "italic",
                color: "#666",
                fontSize: 15,
                margin: 0,
              }}
            >
              "{profile.bio}"
            </Paragraph>
          </div>
        )}

        {/* Details */}
        <div style={{ padding: "24px 32px 32px" }}>
          <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600 }}>
            <Descriptions.Item label="🎂 Ngày sinh">
              {profile.birthday || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="👤 Giới tính">
              {profile.gender === true
                ? "Nam"
                : profile.gender === false
                ? "Nữ"
                : "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="📅 Ngày tạo">
              {profile.create_At
                ? new Date(profile.create_At).toLocaleDateString("vi-VN")
                : "—"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
