// ============================================
// Match Detail Page - Chi tiết match + lịch hẹn
// ============================================

import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  Tag,
  Timeline,
  Divider,
  Button,
  Empty,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  ScheduleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { matchService, userService } from "@/services";
import { getUser } from "@/utils/auth";

const { Title, Text } = Typography;

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getUser();

  const [detail, setDetail] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const partnerEmail =
    location.state?.partnerEmail || null;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!matchId || !currentUser?.email) return;
      setLoading(true);
      try {
        const res = await matchService.getDetail(matchId, currentUser.email);
        const data = res?.data || res || [];
        // API trả về array, lấy phần tử đầu
        const matchData = Array.isArray(data) ? data[0] : data;
        setDetail(matchData);

        // Lấy email đối phương
        const otherEmail =
          partnerEmail ||
          (matchData?.userAEmail === currentUser.email
            ? matchData?.userBEmail
            : matchData?.userAEmail);

        // Gọi API lấy info đối phương
        if (otherEmail) {
          try {
            const allUsersRes = await userService.getAll();
            const allUsers = allUsersRes?.data || allUsersRes || [];
            const found = allUsers.find((u) => u.email === otherEmail);
            if (found) setPartnerInfo(found);
          } catch {
            // ok
          }
        }
      } catch {
        message.error("Không thể tải chi tiết match.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [matchId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <Empty description="Không tìm thấy thông tin match." />
        <Button type="link" onClick={() => navigate("/matches")}>
          ← Quay lại
        </Button>
      </div>
    );
  }

  const otherEmail =
    detail.userAEmail === currentUser?.email
      ? detail.userBEmail
      : detail.userAEmail;

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Back */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/matches")}
        style={{ marginBottom: 16, fontWeight: 500 }}
      >
        Quay lại Matches
      </Button>

      {/* Partner card */}
      <Card
        style={{
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: 20,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            height: 100,
            background: "linear-gradient(135deg, #f472b6 0%, #ef4444 100%)",
          }}
        />
        <div style={{ textAlign: "center", marginTop: -40, paddingBottom: 24 }}>
          <Avatar
            size={80}
            src={partnerInfo?.picture}
            icon={!partnerInfo?.picture && <UserOutlined />}
            style={{ border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
          />
          <Title level={4} style={{ marginTop: 12, marginBottom: 0 }}>
            {partnerInfo?.fullName || otherEmail}
          </Title>
          <Text type="secondary">
            <MailOutlined style={{ marginRight: 4 }} />
            {otherEmail}
          </Text>
          {partnerInfo?.bio && (
            <div
              style={{
                padding: "8px 32px 0",
                color: "#888",
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              "{partnerInfo.bio}"
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <Tag color="pink">
              Matched {formatDate(detail.create_At)}
            </Tag>
          </div>
        </div>
      </Card>

      {/* Availabilities */}
      {detail.availabilities && detail.availabilities.length > 0 && (
        <Card
          title={
            <span>
              <ScheduleOutlined style={{ marginRight: 8 }} />
              Lịch rảnh
            </span>
          }
          style={{ borderRadius: 14, marginBottom: 20 }}
        >
          {detail.availabilities.map((avail, idx) => {
            const isMe = avail.userEmail === currentUser?.email;
            // Tìm tên user từ partnerInfo hoặc currentUser
            const displayName = isMe
              ? currentUser?.fullName || "Bạn"
              : partnerInfo?.fullName || avail.userEmail;

            return (
              <div key={avail.id || idx} style={{ marginBottom: idx < detail.availabilities.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Avatar
                    size={28}
                    src={isMe ? currentUser?.picture : partnerInfo?.picture}
                    icon={<UserOutlined />}
                  />
                  <Text strong>{displayName}</Text>
                  {isMe && <Tag color="blue" style={{ fontSize: 11 }}>Bạn</Tag>}
                </div>
                <Timeline
                  style={{ marginLeft: 16, marginBottom: 0 }}
                  items={
                    avail.availableTimes?.map((t, i) => ({
                      dot: <ClockCircleOutlined style={{ color: "#667eea" }} />,
                      children: (
                        <span key={i}>
                          <Text strong>{formatDate(t.date)}</Text> — {t.startTime || "—"}
                        </span>
                      ),
                    })) || []
                  }
                />
                {idx < detail.availabilities.length - 1 && <Divider dashed style={{ margin: "12px 0" }} />}
              </div>
            );
          })}
        </Card>
      )}

      {/* Matches Schedule */}
      {detail.matchesSchedule && detail.matchesSchedule.length > 0 && (
        <Card
          title={
            <span>
              <CheckCircleFilled style={{ color: "#52c41a", marginRight: 8 }} />
              Lịch hẹn đã xác nhận
            </span>
          }
          style={{ borderRadius: 14 }}
        >
          {detail.matchesSchedule.map((schedule) => (
            <div key={schedule.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Tag color={schedule.status ? "green" : "red"}>
                  {schedule.status ? "Đã xác nhận" : "Chờ xác nhận"}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDate(schedule.create_At)}
                </Text>
              </div>
              <Timeline
                style={{ marginLeft: 8 }}
                items={
                  schedule.matchesTime?.map((t, i) => ({
                    color: "green",
                    dot: <CalendarOutlined style={{ color: "#52c41a" }} />,
                    children: (
                      <span key={i}>
                        <Text strong>{formatDate(t.date)}</Text> lúc{" "}
                        <Tag color="purple">{t.startTime || "—"}</Tag>
                      </span>
                    ),
                  })) || []
                }
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default MatchDetailPage;
