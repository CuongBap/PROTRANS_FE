import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileAddOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Popconfirm, Space, Spin, Table, Tag } from "antd";
import api from "../../../config/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function CreateOrderOnline() {
  const [datasource, setDataSource] = useState([]);
  // const [selectcustomerid, setselectcustomerid] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  console.log(token);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => {
        const currentPage = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "CustomerId",
      dataIndex: "customerId",
      key: "customerId",
      hidden: true,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    {
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => {
        return dayjs(deadline).format("DD/MM/YYYY");
      },
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "estimatedPrice",
      key: "estimatedPrice",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
      },
    },
    {
      title: "Yêu cầu nhận tài liệu",
      dataIndex: "pickUpRequest",
      key: "pickUpRequest",
      render: (pickUpRequest) =>
        pickUpRequest ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Yêu cầu giao hàng",
      dataIndex: "shipRequest",
      key: "shipRequest",
      render: (shipRequest) =>
        shipRequest ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    // {
    //   title: "Trạng thái xóa",
    //   dataIndex: "isDeleted",
    //   key: "isDeleted",
    //   render: (isDeleted) => (isDeleted ? "Có" : "Không"),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === "Accept" ? (
          <Tag color="orange">Được chấp nhận</Tag>
        ) : (
          status
        );
      },
    },
    {
      title: "Tác vụ",
      dataIndex: "id",
      key: "id",
      render: (id, data) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn tạo đơn hàng này không?"
          okText="Có"
          cancelText="Hủy"
          onConfirm={() => {
            console.log(data.customerId);
            // setselectcustomerid(data.customerId);
            const newData = { ...data };
            console.log("id", newData.customerId);
            console.log(newData);

            for (const key of Object.keys(data)) {
              const value = newData[key];

              const date: any = new Date(value);
              // const time: any = date.getTime();
              //|| isNaN(time)
              if (typeof value === "number") {
              } else {
                newData[key] = dayjs(value);
              }
            }
            handleSubmit(id);
          }}
        >
          <button
            style={{
              color: "white",
              backgroundColor: "orange",
              padding: 5,
              borderRadius: 8,
              borderWidth: 0,
              fontSize: 12,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <FormOutlined
              title="Tạo đơn hàng"
              style={{ fontSize: "18px", fontWeight: "bold" }}
            />
          </button>
        </Popconfirm>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  async function handleSubmit(values) {
    console.log(values);

    try {
      const response = await api.post("Order/CreateOrderFromRequest", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token if required
        },
      });

      // console.log("customer", selectcustomerid);

      if (response) {
        const currentDateTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo sử dụng múi giờ Việt Nam
        });
        console.log(response.data.data.customerId);

        const paramPushNoti = {
          specId: response.data.data.customerId,
          title: "Báo giá dịch thuật",
          message: `Đơn giá của bạn đã được xử lí có giá ${response.data.data.totalPrice}. Ngày thông báo: ${currentDateTime}`,
          author: "string",
        };
        const resPushNoti = api.post(`Notification/Single`, paramPushNoti);
        console.log("resPushNoti", resPushNoti);
      }
      console.log(response.data.data);
      fetchMyRequest();
      toast.success("Tạo đơn hàng thành công.");
    } catch (error) {
      toast.error("Tạo đơn hàng thất bại.");
    }
  }

  async function fetchMyRequest() {
    setLoading(true);
    const response = await api.get("Request/GetStatusAccept");
    console.log("=============================");
    console.log(response.data.data);
    setDataSource(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMyRequest();
  }, []);

  return (
    <div className="orderonline">
      <Table
        columns={columns}
        dataSource={datasource}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
      ></Table>
    </div>
  );
}

export default CreateOrderOnline;
