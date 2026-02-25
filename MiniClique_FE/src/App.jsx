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
          colorPrimary: "#f3ce83",
          borderRadius: 6,
          colorBgBase: "#1a1a1a",
          colorTextBase: "#ffffff",
          colorBgContainer: "#1a1a1a",
          colorBgElevated: "#2a2a2a",
          colorBorder: "#3a3a3a",
          colorBorderSecondary: "#2a2a2a",
          colorText: "#ffffff",
          colorTextSecondary: "#aaa",
          colorBgLayout: "#111111",
        },
        components: {
          Menu: {
            itemBg: "#1a1a1a",
            itemColor: "#ccc",
            itemSelectedBg: "#f3ce8320",
            itemSelectedColor: "#f3ce83",
            itemHoverColor: "#f3ce83",
            itemHoverBg: "#f3ce8310",
          },
          Card: {
            colorBgContainer: "#1e1e1e",
            colorBorderSecondary: "#333",
          },
          Input: {
            colorBgContainer: "#2a2a2a",
            colorBorder: "#444",
            colorText: "#fff",
            activeBorderColor: "#f3ce83",
          },
          Button: {
            colorBgContainer: "#2a2a2a",
            colorText: "#fff",
          },
          Modal: {
            contentBg: "#1e1e1e",
            headerBg: "#1e1e1e",
            titleColor: "#fff",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
