// ============================================
// Loading Component
// ============================================

import { Spin } from "antd";

const Loading = ({ tip = "Đang tải..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
      }}
    >
      <Spin tip={tip} size="large">
        <div style={{ padding: 50 }} />
      </Spin>
    </div>
  );
};

export default Loading;
