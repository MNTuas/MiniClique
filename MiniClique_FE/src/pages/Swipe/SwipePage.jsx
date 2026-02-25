// ============================================
// Swipe Page - Tinder-like card swipe
// ============================================

import { useState, useEffect, useCallback } from "react";
import { Spin, message, Tag, Modal, Avatar, Button } from "antd";
import {
  HeartFilled,
  CloseOutlined,
  ManOutlined,
  WomanOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { userService, likeService } from "@/services";
import { getUser } from "@/utils/auth";

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(null); // 'left' | 'right' | null
  const currentUser = getUser();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      const allUsers = res?.data || res || [];
      // Lọc bỏ chính mình
      const filtered = allUsers.filter(
        (u) => u.email !== currentUser?.email && u.id !== currentUser?.id
      );
      setUsers(filtered);
      setCurrentIndex(0);
    } catch {
      message.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email, currentUser?.id]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const card = users[currentIndex];

  const handleLikeApi = async (likedUser) => {
    try {
      const res = await likeService.create({
        id: "", 
        fromEmail: currentUser?.email,
        toEmail: likedUser.email,
      });

      // Kiểm tra message để xác định match
      const resMessage = res?.message || res?.data?.message || "";
      const isMatch =
        resMessage.toLowerCase().includes("both are matches") ||
        resMessage.toLowerCase().includes("matches successful");

      if (isMatch) {
        // Lấy matchId từ response nếu có
        const matchData = res?.data || res;
        const matchId = matchData?.id || matchData?.matchId || "";

        Modal.success({
          icon: null,
          centered: true,
          closable: true,
          footer: null,
          content: (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉💕</div>
              <Avatar
                size={80}
                src={likedUser.picture}
                icon={!likedUser.picture && <SmileOutlined />}
                style={{ border: "3px solid #f472b6", marginBottom: 12 }}
              />
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                It's a Match!
              </div>
              <div style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
                Bạn và <strong>{likedUser.fullName}</strong> đã thích nhau!
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Button
                  onClick={() => Modal.destroyAll()}
                  style={{ borderRadius: 8, height: 40 }}
                >
                  Tiếp tục swipe
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.destroyAll();
                    if (matchId) {
                      navigate(`/matches/${matchId}`, {
                        state: { partnerEmail: likedUser.email },
                      });
                    } else {
                      navigate("/matches");
                    }
                  }}
                  style={{
                    borderRadius: 8,
                    height: 40,
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #f472b6 0%, #ef4444 100%)",
                    border: "none",
                  }}
                >
                  Xem Match 💕
                </Button>
              </div>
            </div>
          ),
        });
      }
    } catch {
      // Like thất bại thì im
    }
  };

  const handleSwipe = (direction) => {
    if (!card || swiping) return;
    setSwiping(direction);

    if (direction === "right") {
      message.success({
        content: `❤️ Bạn đã thích ${card.fullName}!`,
        duration: 1.5,
      });
      // Gọi API like
      handleLikeApi(card);
    }

    setTimeout(() => {
      setSwiping(null);
      if (currentIndex < users.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Hết người → tự reload lại danh sách
        fetchUsers();
      }
    }, 400);
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" tip="Đang tìm người..." />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={styles.center}>
        <Spin size="large" tip="Đang tìm người mới..." />
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Card */}
      <div
        style={{
          ...styles.card,
          transform: swiping === "left"
            ? "translateX(-120%) rotate(-15deg)"
            : swiping === "right"
            ? "translateX(120%) rotate(15deg)"
            : "translateX(0) rotate(0)",
          opacity: swiping ? 0.5 : 1,
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Ảnh */}
        <div style={styles.imageContainer}>
          {card.picture ? (
            <img src={card.picture} alt={card.fullName} style={styles.image} />
          ) : (
            <div style={styles.placeholder}>
              <span style={{ fontSize: 80, color: "#d9d9d9" }}>
                {card.fullName?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div style={styles.gradient} />

          {/* Swipe labels */}
          {swiping === "right" && (
            <div style={{ ...styles.swipeLabel, ...styles.likeLabel }}>
              LIKE
            </div>
          )}
          {swiping === "left" && (
            <div style={{ ...styles.swipeLabel, ...styles.nopeLabel }}>
              NOPE
            </div>
          )}

          {/* Info overlay */}
          <div style={styles.infoOverlay}>
            <div style={styles.name}>
              {card.fullName || "Ẩn danh"}{" "}
              {card.gender === true ? (
                <ManOutlined style={{ color: "#52a3ff" }} />
              ) : card.gender === false ? (
                <WomanOutlined style={{ color: "#ff6b9d" }} />
              ) : null}
            </div>
            {card.birthday && (
              <div style={styles.sub}>🎂 {card.birthday}</div>
            )}
            {card.email && (
              <div style={styles.sub}>📧 {card.email}</div>
            )}
            {card.bio && (
              <div style={styles.bio}>"{card.bio}"</div>
            )}
            {card.status && (
              <Tag
                color={card.status === "Active" ? "green" : "default"}
                style={{ marginTop: 6 }}
              >
                {card.status}
              </Tag>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={styles.actions}>
        <button
          style={{ ...styles.btn, ...styles.btnNope }}
          onClick={() => handleSwipe("left")}
          disabled={!!swiping}
        >
          <CloseOutlined style={{ fontSize: 32 }} />
        </button>

        <button
          style={{ ...styles.btn, ...styles.btnLike }}
          onClick={() => handleSwipe("right")}
          disabled={!!swiping}
        >
          <HeartFilled style={{ fontSize: 32 }} />
        </button>
      </div>

      {/* Counter */}
      <div style={styles.counter}>
        {currentIndex + 1} / {users.length}
      </div>
    </div>
  );
};

// ========== Styles ==========
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 160px)",
    userSelect: "none",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 160px)",
  },
  card: {
    width: 380,
    maxWidth: "90vw",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    background: "#fff",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 500,
    overflow: "hidden",
    background: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
    pointerEvents: "none",
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px 24px",
    color: "#fff",
    zIndex: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: 700,
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  sub: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    opacity: 0.85,
    marginTop: 8,
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  swipeLabel: {
    position: "absolute",
    top: 40,
    padding: "8px 20px",
    fontSize: 32,
    fontWeight: 800,
    borderRadius: 8,
    border: "4px solid",
    zIndex: 10,
    letterSpacing: 2,
    transform: "rotate(-15deg)",
  },
  likeLabel: {
    left: 24,
    color: "#4ade80",
    borderColor: "#4ade80",
    transform: "rotate(-15deg)",
  },
  nopeLabel: {
    right: 24,
    color: "#f87171",
    borderColor: "#f87171",
    transform: "rotate(15deg)",
  },
  actions: {
    display: "flex",
    gap: 32,
    marginTop: 28,
  },
  btn: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  btnNope: {
    background: "#fff",
    color: "#f87171",
    border: "2px solid #fecaca",
  },
  btnLike: {
    background: "linear-gradient(135deg, #f472b6 0%, #ef4444 100%)",
    color: "#fff",
  },
  counter: {
    marginTop: 16,
    fontSize: 13,
    color: "#aaa",
  },
};

export default SwipePage;
