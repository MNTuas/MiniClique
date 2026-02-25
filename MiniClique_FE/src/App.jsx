// ============================================
// App Component
// ============================================

import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import viVN from "antd/locale/vi_VN";
import router from "@/router";

const App = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
