import {
  ArrowRightOutlined,
  BellOutlined,
  ContainerFilled,
  ContainerOutlined,
  ContainerTwoTone,
  CopyFilled,
  CopyOutlined,
  FileOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, MenuProps, message, Space } from "antd";
import { logout } from "../../redux/features/userSlice";
import { RootState } from "../../redux/rootReducer";
import { useEffect, useMemo, useState } from "react";
import api from "../../config/api";

function Header() {
  const navigate = useNavigate();
  const account = useSelector((store: RootState) => store.accountmanage);
  const dispatch = useDispatch();
  const [listNoti, setListNoti] = useState([]);
  const [countNoti, setCountNoti] = useState(0);
  useEffect(() => {
    const getListNoti = async () => {
      try {
        const res = await api.get(`Notification/${account.Id}`);
        if (res) {
          const arrResponse = res.data.data;

          setListNoti(arrResponse);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    console.log("check");
    getListNoti();
  }, []);
  
  useEffect(() => {
    if (listNoti.length > 0) {
      const count = listNoti.filter((item) => item).length;

      setCountNoti(count);
    }
  }, [listNoti]);

  const renderItem: MenuProps["items"] = useMemo(() => {
    if (listNoti.length > 0) {
      const listRenderItem = listNoti?.map((item, index) => ({
        label: (
          <a
            key={index}
            href="https://www.antgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              updateStatus(item.id);
            }}
          >
            {item.id}
          </a>
        ),
        key: item.id.toString(),
      }));
      console.log("lít not", listRenderItem);
      return listRenderItem;
    }
  }, [listNoti]);

  const updateStatus = async (id: string) => {
    try {
      // update status ở đây, ví dụ em update id = 188
      const updateStatusResponse = await api.post("/update", id);
      // ví dụ nếu response trả ra phần tử 188 đã update isRead:true
      if (updateStatusResponse?.data) {
        const updatedList = listNoti.map((item) =>
          item.id.toString() === updateStatusResponse.data.data.id.toString()
            ? updateStatusResponse.data.data
            : item
        );
        setListNoti(updatedList);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      navigate("/");
    }
    if (key === "MyRequest") {
      navigate("/myrequest");
    }
    if (key === "HistoryOrder") {
      navigate("/myhistoryorder");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Đơn hàng của tôi",
      key: "HistoryOrder",
      icon: <HistoryOutlined />,
    },
    {
      label: "Yêu cầu của tôi",
      key: "MyRequest",
      icon: <HistoryOutlined />,
    },
    {
      label: "Đăng xuất",
      key: "logout",
      icon: <ArrowRightOutlined />,
    },
  ];

  const notiItems: MenuProps["items"] = [
    {
      label: (
        <a
          href="https://www.antgroup.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          1st menu item
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          href="https://www.aliyun.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="header">
      <div className="header__left">
        <img
          src="/bank-images/ProTranslogo_standard.png"
          alt="logo"
          className="header__logo"
          width={150}
          onClick={() => navigate("/")}
        />
      </div>
      <ul className="header__navigation">
        <li>Giới Thiệu</li>
        <li>Dịch Thuật</li>
        <li
          onClick={() => {
            if (account) {
              navigate("/sendrequest");
              window.scrollTo(0, 0);
            } else {
              navigate("/login");
            }
          }}
        >
          Gửi yêu cầu
        </li>
        <li>Chuyên Ngành</li>
        <li onClick={() => navigate("/quotePageDesign")}>Bảng Giá</li>
      </ul>
      <div className="header__right">
        <div className="header__account">
          {account ? (
            <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
              <UserOutlined />
              {account.Username}
            </Dropdown.Button>
          ) : (
            <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
          )}
        </div>

        <div className="header__Noti">
          <Dropdown menu={{ items: renderItem }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <BellOutlined />
                <p>{countNoti}</p>
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;
