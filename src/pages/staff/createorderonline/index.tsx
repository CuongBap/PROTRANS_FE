import { FileAddOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Table } from "antd";
import api from "../../../config/api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function CreateOrderOnline() {
  const [datasource, setDataSource] = useState([]);
  const token = localStorage.getItem("token");

  console.log(token);
  const columns = [
    {
      title: "Tên Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thời gian hoàn thành",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => {
        return dayjs(deadline).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Giá ước tính",
      dataIndex: "estimatedPrice",
      key: "estimatedPrice",
    },
    {
      title: "Yêu cầu nhận tài liệu",
      dataIndex: "pickUpRequest",
      key: "pickUpRequest",
      render: (pickUpRequest) => (pickUpRequest ? "Có" : "Không"),
    },
    {
      title: "Yêu cầu ship",
      dataIndex: "shipRequest",
      key: "shipRequest",
      render: (shipRequest) => (shipRequest ? "Có" : "Không"),
    },
    {
      title: "Trạng Thái xóa",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) => (isDeleted ? "Có" : "Không"),
    },
    {
      title: "trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, data) => (
        <Space>
          <FormOutlined
            onClick={() => {
              const newData = { ...data };
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
          />
        </Space>
      ),
    },
  ];

  async function handleSubmit(values) {
    console.log(values);

    try {
      const response = await api.post("Order/CreateOrderFromRequest", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token if required
        },
      });

      console.log(response.data.data);
      toast.success("tạo order thành công");
    } catch (error) {
      toast.error("Tạo order thất bại");
    }
  }

  async function fetchMyRequest() {
    const response = await api.get("Request/GetStatusAccept");
    console.log("=============================");
    console.log(response.data.data);
    setDataSource(response.data.data);
  }

  useEffect(() => {
    fetchMyRequest();
  }, []);

  return (
    <div className="orderonline">
      <Table columns={columns} dataSource={datasource}></Table>
    </div>
  );
}

export default CreateOrderOnline;