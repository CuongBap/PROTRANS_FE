import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRightOutlined,
  BellOutlined,
  ContainerOutlined,
  HistoryOutlined,
  TranslationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Breadcrumb, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import "./index.css";
import { toast } from "react-toastify";
import api from "../../config/api";

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
    label: <Link to={`/dashboardtranslator/${key}`}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Tài liệu đang dịch", "assignment", <TranslationOutlined />),
  getItem("Lịch sử", "history", <HistoryOutlined />),
  getItem("Bằng cấp của bạn", "translatorskill", <ContainerOutlined />),
];

const DashboardTranslator: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const account = useSelector((store: RootState) => store.accountmanage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listNoti, setListNoti] = useState([]);
  const [countNoti, setCountNoti] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState("Dashboard");

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      navigate("/login");
    }
  };

  const items1: MenuProps["items"] = [
    {
      label: "Đăng xuất",
      key: "logout",
      icon: <ArrowRightOutlined />,
    },
  ];

  // const handleMenuSelect = (e) => {
  //   const selectedItem = items.find((item) => item.key === e.key);
  //   if (selectedItem) {
  //     setBreadcrumb(selectedItem.label as string);
  //   }
  // };

  const handleMenuSelect = (e) => {
    const selectedItem = items.find((item) => item?.key === e.key);

    if (selectedItem && "label" in selectedItem) {
      const labelContent =
        typeof selectedItem.label === "string"
          ? selectedItem.label
          : (selectedItem.label as React.ReactElement).props.children;

      setBreadcrumb(labelContent);
    }
  };

  useEffect(() => {
    if (account) {
      const getListNoti = async () => {
        try {
          const res = await api.get(`Notification/${account.Id}`);
          if (res) {
            const arrResponse = res.data.data;

            setListNoti(arrResponse);
          }
        } catch (error) {
          toast.error("Không thể tải thông báo.");
          setListNoti([]);
        }
      };
      console.log("check");
      getListNoti();
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(listNoti) && listNoti.length > 0) {
      const count = listNoti.filter((item) => !item.isChecked).length;

      setCountNoti(count);
    }
  }, [listNoti]);

  const renderItem: MenuProps["items"] = useMemo(() => {
    if (Array.isArray(listNoti) && listNoti.length > 0) {
      const listRenderItem = listNoti?.map((item, index) => ({
        label: (
          <a
            key={index}
            // href="https://www.antgroup.com"
            // target="_blank"
            // rel="noopener noreferrer"
            onClick={() => {
              handleReadNotification(item.id);
            }}
          >
            {item.message} - {item.isChecked ? "Đã đọc" : "Chưa đọc"}
          </a>
        ),
        key: item.id.toString(),
      }));
      console.log("lít not", listRenderItem);
      return listRenderItem;
    } else {
      return [
        {
          label: (
            <span style={{ color: "red" }}> Hiện tại không có thông báo</span>
          ),
          key: "no-notifications",
          disabled: true,
        },
      ];
    }
  }, [listNoti]);

  async function handleReadNotification(id) {
    try {
      const response = await api.put(`Notification/${id}`);

      if (response?.status === 200) {
        // Tìm và cập nhật trạng thái thông báo trong danh sách hiện tại
        const updatedList = listNoti.map((item) =>
          item.id === id ? { ...item, isChecked: true } : item
        );
        setListNoti(updatedList);

        // Hiển thị thông báo thành công
        toast.success("Đã đọc thông báo");
      }

      // toast.success("Đã đọc thông báo");
    } catch (error) {
      console.error("Cập nhập file thất bại", error);
      toast.error("Đọc thông báo thất bại");
    }
  }

  const menuProps = {
    items: items1,
    onClick: handleMenuClick,
  };
  // (
  //   <Menu onClick={handleMenuClick}>
  //     <Menu.Item key="logout" icon={<ArrowRightOutlined />}>
  //       Đăng xuất
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <div className="logo-container">
          <img
            src="/bank-images/ProTranslogo_standard_white.png"
            alt="ProTrans Logo"
            className="sidebar-logo"
            width={150}
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["assignment"]}
          mode="inline"
          items={items}
          onClick={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Header className="header-container">
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Dropdown menu={{ items: renderItem }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Badge count={countNoti} showZero>
                    <BellOutlined style={{ fontSize: "x-large" }} />
                  </Badge>
                </Space>
              </a>
            </Dropdown>

            <Dropdown.Button menu={menuProps} placement="bottomRight">
              <UserOutlined />
              {account.Username}
            </Dropdown.Button>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0", color: "black" }}>
            <Breadcrumb.Item>Translator</Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb_highlight">
              <span className="breadcrumb_span">{breadcrumb}</span>
            </Breadcrumb.Item>
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

export default DashboardTranslator;
