// ============================================
// Matches Page - Danh sách người đã match
// ============================================

import { useState, useEffect } from "react";
import { List, Avatar, Card, Typography, Spin, Empty, Tag, message } from "antd";
import {
  HeartFilled,
  UserOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { matchService, userService } from "@/services";
import { getUser } from "@/utils/auth";

const { Title, Text } = Typography;

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUser?.email) return;
      setLoading(true);
      try {
        const res = await matchService.getByEmail(currentUser.email);
        const data = res?.data || res || [];
        const matchList = Array.isArray(data) ? data : [];
        setMatches(matchList);

        // Lấy tất cả email đối phương
        const otherEmails = new Set();
        matchList.forEach((m) => {
          if (m.userAEmail && m.userAEmail !== currentUser.email)
            otherEmails.add(m.userAEmail);
          if (m.userBEmail && m.userBEmail !== currentUser.email)
            otherEmails.add(m.userBEmail);
        });

        // Gọi API lấy tất cả users rồi map
        if (otherEmails.size > 0) {
          try {
            const usersRes = await userService.getAll();
            const allUsers = usersRes?.data || usersRes || [];
            const map = {};
            allUsers.forEach((u) => {
              if (otherEmails.has(u.email)) {
                map[u.email] = u;
              }
            });
            setUserMap(map);
          } catch {
            // Không lấy được user info cũng OK
          }
        }
      } catch {
        message.error("Không thể tải danh sách matches.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const getPartnerEmail = (match) => {
    if (match.userAEmail === currentUser.email) return match.userBEmail;
    return match.userAEmail;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <HeartFilled style={{ fontSize: 36, color: "#f3ce83", marginBottom: 8 }} />
        <Title level={3} style={{ margin: 0 }}>
          Matches của bạn
        </Title>
        <Text type="secondary">
          {matches.length > 0
            ? `${matches.length} người đã match với bạn`
            : "Chưa có match nào"}
        </Text>
      </div>

      {matches.length === 0 ? (
        <Empty description="Hãy quay lại Khám phá để tìm match! 💕" />
      ) : (
        <List
          dataSource={matches}
          renderItem={(match) => {
            const partnerEmail = getPartnerEmail(match);
            const partner = userMap[partnerEmail];

            return (
              <Card
                hoverable
                style={{
                  borderRadius: 14,
                  marginBottom: 12,
                  border: "1px solid #f0f0f0",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: "16px 20px" }}
                onClick={() =>
                  navigate(`/matches/${match.id}`, {
                    state: { partnerEmail },
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <Avatar
                    size={56}
                    src={partner?.picture}
                    icon={!partner?.picture && <UserOutlined />}
                    style={{
                      border: "2px solid #f3ce83",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {partner?.fullName || partnerEmail}
                    </div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {match.create_At
                        ? new Date(match.create_At).toLocaleDateString("vi-VN")
                        : "—"}
                    </Text>
                    {partner?.bio && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#888",
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {partner.bio}
                      </div>
                    )}
                  </div>

                  <RightOutlined style={{ color: "#bfbfbf", fontSize: 14 }} />
                </div>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
};

export default MatchesPage;
