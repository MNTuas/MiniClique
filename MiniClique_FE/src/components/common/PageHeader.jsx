// ============================================
// PageHeader Component
// ============================================

import { Typography, Breadcrumb } from "antd";

const { Title } = Typography;

const PageHeader = ({ title, breadcrumbs = [] }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((item) => ({
            title: item.link ? <a href={item.link}>{item.label}</a> : item.label,
          }))}
        />
      )}
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>
    </div>
  );
};

export default PageHeader;
