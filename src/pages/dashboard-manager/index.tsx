import React, { useState } from "react";
import {
  ArrowRightOutlined,
  AuditOutlined,
  BookOutlined,
  FormOutlined,
  ShoppingCartOutlined,
  TranslationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboardmanager/${key}`}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Ngôn ngữ", "language", <TranslationOutlined />),
  getItem("Bảng giá", "quoteprice", <BookOutlined />),
  getItem("Loại công chứng", "notarization", <AuditOutlined />),
  getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
  getItem("Giao việc vận chuyển", "assignshipper", <FormOutlined />),
  getItem("Giao việc công chứng", "assignNotarization", <FormOutlined />),
  getItem("Giao đi nhận bản cứng", "assignhardcopy", <FormOutlined />),
  // getItem("Task Notarization List", "tasknotarizationlist", <FormOutlined />),
];

const DashboardManager: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const account = useSelector((store: RootState) => store.accountmanage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      navigate("/login");
    } else if (key === "myOrders") {
      navigate("/myOrders");
    } else if (key === "myRequests") {
      navigate("/myRequests");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout" icon={<ArrowRightOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="header-container">
          <Dropdown.Button overlay={menu} placement="bottomRight">
            <UserOutlined />
            {account.Username}
          </Dropdown.Button>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ProTrans ©2024 được phát triển bởi đội ngũ chuyên nghiệp.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardManager;
