import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRightOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  ContainerOutlined,
  DeliveredProcedureOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FontColorsOutlined,
  FormOutlined,
  InboxOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  SignatureOutlined,
  TranslationOutlined,
  TruckFilled,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import "./index.css";
import api from "../../config/api";
import { toast } from "react-toastify";

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
  getItem("Ngôn ngữ", "language", <FontColorsOutlined />),
  getItem("Bảng giá", "quoteprice", <ContainerOutlined />),
  getItem("Loại tài liệu", "documenttype", <ProfileOutlined />),
  getItem("Loại công chứng", "notarization", <ProfileOutlined />),
  getItem("Đơn hàng", "order", <InboxOutlined />),
  getItem("Giao việc vận chuyển", "assignshipper", <TruckOutlined />),
  getItem("Giao việc công chứng", "assignNotarization", <SignatureOutlined />),
  getItem(
    "Giao đi nhận bản cứng",
    "assignhardcopy",
    <DeliveredProcedureOutlined />
  ),
  getItem("Quản lý giao dịch", "transaction", <DollarOutlined />),
  getItem("Báo cáo thống kê", "reportmanager", <BarChartOutlined />),
];

const DashboardManager: React.FC = () => {
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

  //==========================
  const items1: MenuProps["items"] = [
    {
      label: "Đăng xuất",
      key: "logout",
      icon: <ArrowRightOutlined />,
    },
  ];

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
            {item.message} -{" "}
            <span
              style={{
                color: item.isChecked ? "green" : "red",
              }}
            >
              {item.isChecked ? "Đã đọc" : "Chưa đọc"}
            </span>
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
    const notification = listNoti.find((item) => item.id === id);
    if (notification?.isChecked) {
      toast.info("Thông báo này đã được đọc.");
      return; // Dừng lại nếu thông báo đã được đọc
    }
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
        width={220}
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
          defaultSelectedKeys={["1"]}
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

            <Dropdown.Button
              menu={menuProps}
              placement="bottomRight"
              onClick={() => navigate("profile")}
            >
              <UserOutlined />
              {account.Username}
            </Dropdown.Button>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-highlight">
              <span className="breadcrumb">{breadcrumb}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: "50px 24px",
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
