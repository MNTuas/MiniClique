// ============================================
// Match Detail Page - Chi tiết match + lịch hẹn + chọn time slot
// ============================================

import { useState, useEffect, useMemo } from "react";
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
  Modal,
  Alert,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  ScheduleOutlined,
  MailOutlined,
  SendOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { matchService, userService, availabilityService } from "@/services";
import { getUser } from "@/utils/auth";

const { Title, Text } = Typography;

// Tạo danh sách 21 ngày kế tiếp (3 tuần)
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const HOURS = [
  { label: "19:00", value: "19:00:00" },
  { label: "20:00", value: "20:00:00" },
  { label: "21:00", value: "21:00:00" },
];

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getUser();

  const [detail, setDetail] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]); // [{date, startTime}]
  const [submitting, setSubmitting] = useState(false);
  const [forcePickerOpen, setForcePickerOpen] = useState(false); // force reopen khi no matching time
  const [isUpdateMode, setIsUpdateMode] = useState(false); // dùng update API thay vì create

  const partnerEmail = location.state?.partnerEmail || null;

  const dates = useMemo(() => generateDates(), []);

  const fetchDetail = async () => {
    if (!matchId || !currentUser?.email) return;
    setLoading(true);
    try {
      const res = await matchService.getDetail(matchId, currentUser.email);
      const data = res?.data || res || [];
      const matchData = Array.isArray(data) ? data[0] : data;
      setDetail(matchData);

      const otherEmail =
        partnerEmail ||
        (matchData?.userAEmail === currentUser.email
          ? matchData?.userBEmail
          : matchData?.userAEmail);

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

  useEffect(() => {
    fetchDetail();
  }, [matchId]);

  // Kiểm tra matchesSchedule đã có chưa
  const hasSchedule =
    detail?.matchesSchedule && detail.matchesSchedule.length > 0;

  // Kiểm tra user hiện tại đã gửi availability chưa
  const hasMyAvailability = detail?.availabilities?.some(
    (a) => a.userEmail === currentUser?.email
  );

  // Lấy availability id của mình (dùng cho update)
  const myAvailability = detail?.availabilities?.find(
    (a) => a.userEmail === currentUser?.email
  );

  // Logic đơn giản: chưa có schedule => luôn hiện picker cho chọn/chọn lại
  const showPicker = !hasSchedule;

  // Toggle chọn slot
  const toggleSlot = (dateStr, hour) => {
    setSelectedSlots((prev) => {
      const exists = prev.find(
        (s) => s.date === dateStr && s.startTime === hour
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.date === dateStr && s.startTime === hour)
        );
      }
      return [...prev, { date: dateStr, startTime: hour }];
    });
  };

  const isSlotSelected = (dateStr, hour) =>
    selectedSlots.some((s) => s.date === dateStr && s.startTime === hour);

  // Gửi availability
  const handleSubmitAvailability = async () => {
    if (selectedSlots.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 khung giờ.");
      return;
    }
    setSubmitting(true);
    try {
      const isUpdate = !!myAvailability?.id;
      const payload = {
        id: isUpdate ? myAvailability.id : "",
        matchId,
        userEmail: currentUser?.email,
        availableTimes: selectedSlots,
        create_At: new Date().toISOString(),
      };

      let res;
      // Dùng update nếu đã có availability trước đó
      if (isUpdate) {
        res = await availabilityService.update(myAvailability.id, payload);
      } else {
        res = await availabilityService.create(payload);
      }

      const resMessage = res?.message || res?.data?.message || "";
      setSelectedSlots([]);

      if (resMessage.toLowerCase().includes("match found and schedule created")) {
        // Case 2: Cả 2 đã chọn trùng giờ → chúc mừng
        setForcePickerOpen(false);
        setIsUpdateMode(false);
        Modal.success({
          icon: null,
          centered: true,
          content: (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉📅</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                Lịch hẹn đã được tạo!
              </div>
              <div style={{ color: "#888", fontSize: 14 }}>
                Hệ thống đã tìm được thời gian phù hợp cho cả hai. Chúc bạn buổi hẹn vui vẻ! 💕
              </div>
            </div>
          ),
          okText: "Tuyệt vời!",
          onOk: () => {},
        });
        await fetchDetail();
      } else if (resMessage.toLowerCase().includes("no matching time found")) {
        // Case 3: Không trùng giờ → mở lại picker để chọn lại (update mode)
        setForcePickerOpen(true);
        setIsUpdateMode(true);
        Modal.warning({
          icon: null,
          centered: true,
          content: (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                Không tìm thấy giờ trùng!
              </div>
              <div style={{ color: "#888", fontSize: 14 }}>
                Lịch của bạn và đối phương không trùng nhau. Vui lòng chọn lại khung giờ khác nhé.
              </div>
            </div>
          ),
          okText: "Chọn lại",
        });
        await fetchDetail();
      } else {
        // Case 1: "Availability created. Waiting for second user" hoặc message khác
        setForcePickerOpen(false);
        setIsUpdateMode(false);
        Modal.info({
          icon: null,
          centered: true,
          content: (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                Đã gửi lịch rảnh!
              </div>
              <div style={{ color: "#888", fontSize: 14 }}>
                Đang chờ đối phương chọn lịch. Bạn sẽ nhận được thông báo khi có kết quả.
              </div>
            </div>
          ),
          okText: "Đã hiểu",
        });
        await fetchDetail();
      }
    } catch {
      message.error("Gửi lịch rảnh thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const formatShortDate = (d) =>
    d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });

  const toISODate = (d) => d.toISOString().split("T")[0] + "T00:00:00Z";

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
            background: "linear-gradient(135deg, #1a1a1a 0%, #f3ce8340 100%)",
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
            <Tag color="pink">Matched {formatDate(detail.create_At)}</Tag>
          </div>
        </div>
      </Card>

      {/* Warning: chưa có schedule và đã có availability => chưa trùng giờ */}
      {!hasSchedule && hasMyAvailability && (
        <Alert
          message="Chưa tìm được lịch hẹn trùng"
          description="Khung giờ của bạn và đối phương chưa trùng nhau. Vui lòng chọn lại khung giờ khác bên dưới."
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{
            borderRadius: 12,
            marginBottom: 20,
            background: "#ff4d4f15",
            border: "1px solid #ff4d4f40",
          }}
        />
      )}

      {/* Time Slot Picker */}
      {showPicker && (
        <Card
          title={
            <span>
              <CalendarOutlined style={{ marginRight: 8, color: "#f3ce83" }} />
              {hasMyAvailability ? "Chọn lại khung giờ rảnh" : "Chọn khung giờ rảnh của bạn"}
            </span>
          }
          extra={
            <Tag color="orange">
              {selectedSlots.length} slot đã chọn
            </Tag>
          }
          style={{
            borderRadius: 14,
            marginBottom: 20,
            border: "2px solid #f3ce8333",
          }}
        >
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Chọn các khung giờ bạn rảnh trong 3 tuần tới. Hệ thống sẽ tìm thời gian phù hợp cho cả hai.
          </Text>

          {/* Time slot grid */}
          <div
            style={{
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 4,
                width: "100%",
                minWidth: 400,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "6px 8px",
                      fontSize: 12,
                      color: "#999",
                      minWidth: 90,
                    }}
                  >
                    Ngày
                  </th>
                  {HOURS.map((h) => (
                    <th
                      key={h.value}
                      style={{
                        textAlign: "center",
                        padding: "6px 4px",
                        fontSize: 12,
                        color: "#f3ce83",
                        fontWeight: 600,
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dates.map((date) => {
                  const dateStr = toISODate(date);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <tr key={dateStr}>
                      <td
                        style={{
                          padding: "4px 8px",
                          fontSize: 13,
                          fontWeight: isWeekend ? 600 : 400,
                          color: isWeekend ? "#f3ce83" : "#ccc",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatShortDate(date)}
                      </td>
                      {HOURS.map((hour) => {
                        const selected = isSlotSelected(dateStr, hour.value);
                        return (
                          <td key={hour.value} style={{ textAlign: "center", padding: 2 }}>
                            <div
                              onClick={() => toggleSlot(dateStr, hour.value)}
                              style={{
                                width: "100%",
                                height: 36,
                                borderRadius: 8,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                transition: "all 0.2s",
                                background: selected
                                  ? "linear-gradient(135deg, #f3ce83 0%, #d4a54a 100%)"
                                  : "#2a2a2a",
                                color: selected ? "#1a1a1a" : "#555",
                                border: selected
                                  ? "2px solid #f3ce83"
                                  : "2px solid transparent",
                                boxShadow: selected
                                  ? "0 2px 8px rgba(243,206,131,0.3)"
                                  : "none",
                              }}
                            >
                              {selected ? "✓" : "—"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Divider style={{ margin: "16px 0 12px" }} />

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              disabled={selectedSlots.length === 0}
              onClick={handleSubmitAvailability}
              style={{
                height: 42,
                borderRadius: 10,
                fontWeight: 600,
                background:
                  selectedSlots.length > 0
                    ? "linear-gradient(135deg, #f3ce83 0%, #d4a54a 100%)"
                    : undefined,
                border: "none",
                paddingInline: 28,
                color: selectedSlots.length > 0 ? "#1a1a1a" : undefined,
              }}
            >
              Gửi lịch rảnh ({selectedSlots.length})
            </Button>
          </div>
        </Card>
      )}

      {/* Availabilities đã gửi */}
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
            const displayName = isMe
              ? currentUser?.fullName || "Bạn"
              : partnerInfo?.fullName || avail.userEmail;

            return (
              <div
                key={avail.id || idx}
                style={{
                  marginBottom:
                    idx < detail.availabilities.length - 1 ? 20 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Avatar
                    size={28}
                    src={isMe ? currentUser?.picture : partnerInfo?.picture}
                    icon={<UserOutlined />}
                  />
                  <Text strong>{displayName}</Text>
                  {isMe && (
                    <Tag color="blue" style={{ fontSize: 11 }}>
                      Bạn
                    </Tag>
                  )}
                </div>
                <Timeline
                  style={{ marginLeft: 16, marginBottom: 0 }}
                  items={
                    avail.availableTimes?.map((t, i) => ({
                      dot: (
                        <ClockCircleOutlined style={{ color: "#f3ce83" }} />
                      ),
                      children: (
                        <span key={i}>
                          <Text strong>{formatDate(t.date)}</Text> —{" "}
                          {t.startTime || "—"}
                        </span>
                      ),
                    })) || []
                  }
                />
                {idx < detail.availabilities.length - 1 && (
                  <Divider dashed style={{ margin: "12px 0" }} />
                )}
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
              <CheckCircleFilled
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              Lịch hẹn đã xác nhận
            </span>
          }
          style={{ borderRadius: 14 }}
        >
          {detail.matchesSchedule.map((schedule) => (
            <div key={schedule.id} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
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
                    dot: (
                      <CalendarOutlined style={{ color: "#52c41a" }} />
                    ),
                    children: (
                      <span key={i}>
                        <Text strong>{formatDate(t.date)}</Text> lúc{" "}
                        <Tag color="gold">{t.startTime || "—"}</Tag>
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
