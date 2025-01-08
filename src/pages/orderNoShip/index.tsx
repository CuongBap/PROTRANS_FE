import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  AlignRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  FormOutlined,
  LikeOutlined,
  MoreOutlined,
  PauseOutlined,
  SendOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import "./index.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

function OrderNoShip() {
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notarizationType, setNotarizationType] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [language, setLanguage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>("");
  const account = useSelector((store: RootState) => store.accountmanage);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const fetchNotarizationType = async () => {
    const response = await api.get("Notarization");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((notarization) => ({
      value: notarization.id,
      label: <span>{notarization.name}</span>,
    }));

    setNotarizationType(list);
  };

  useEffect(() => {
    fetchNotarizationType();
  }, []);

  //====================================================

  const fetchDocumentType = async () => {
    const response = await api.get("DocumentType");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((Document) => ({
      value: Document.id,
      label: <span>{Document.name}</span>,
    }));

    setDocumentType(list);
  };

  useEffect(() => {
    fetchDocumentType();
  }, []);

  //=================================================

  const fetchLanguages = async () => {
    const response = await api.get("Language");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((language) => ({
      value: language.id,
      label: <span>{language.name}</span>,
    }));

    setLanguage(list);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string) => {
    try {
      // Gọi API PUT
      const response = await api.put(
        `Order/UpdateOrderStatusDeliveredByOrderId?orderId=${orderId}`
      );
      console.log(response.data);

      // Hiển thị thông báo thành công
      toast.success("Đã xác nhận thành công.");

      // Refresh danh sách order
      fetchOrder();
    } catch (error) {
      // Xử lý lỗi
      console.error("Update failed", error);
      toast.error("Xác nhận thất bại, vui lòng thử lại.");
    }
  };

  //===============================

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
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a, b) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
      render: (deadline) => {
        return dayjs(deadline).format("DD/MM/YYYY");
      },
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdDate",
    //   key: "createdDate",
    //   sorter: (a, b) =>
    //     dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix(),
    //   render: (deadline) => {
    //     return dayjs(deadline).format("DD/MM/YYYY HH:mm");
    //   },
    // },
    {
      title: "Tổng giá (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "Processing":
            return (
              <div className="status-processing">
                <ClockCircleOutlined />
                &nbsp; Chờ xử lý
              </div>
            );
          case "Completed":
            return <Tag color="green">Đã hoàn thành</Tag>;
          case "Delivering":
            return (
              <div className="status-delivering">
                <TruckOutlined />
                &nbsp; Đang giao
              </div>
            );
          case "Delivered":
            return (
              <div className="status-delivered">
                <CheckOutlined />
                &nbsp; Đã giao
              </div>
            );
          case "Implementing":
            return (
              <div className="status-implementing">
                <CheckOutlined />
                &nbsp; Đang thực hiện
              </div>
            );
          case "Canceled":
            return (
              <div className="status-canceled">
                <PauseOutlined />
                &nbsp; Đã hủy
              </div>
            );
          default:
            return status;
        }
      },
    },
    {
      title: "Tác vụ",
      dataIndex: "id",
      key: "id",
      render: (id, data) => (
        <Popconfirm
          title="Bạn có xác nhận bàn giao đơn hàng này cho khách hàng?"
          okText="Xác nhận"
          cancelText="Hủy"
          onConfirm={() => handleUpdateOrderStatus(id)}
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
            <SendOutlined style={{ fontSize: "18px", fontWeight: "bold" }} />
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

  // async function handleSubmit(values) {
  //   try {
  //     const response = await api.post("Order", values);

  //     console.log(response.data.data);
  //     setDataSource([...dataSource, response.data.data]);
  //     formVariable.resetFields();
  //     setIsOpen(false);
  //   } catch (error) {
  //     toast.error("Create Order Fail");
  //   }
  // }

  async function fetchOrder() {
    setLoading(true);
    const response = await api.get(
      `Order/GetNoShipCompletedOrders?staffId=${account.Id}`
    );
    console.log(response.data.data);
    setDataSource(response.data.data);
    setFilteredData(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setActiveButton(status);
  };

  useEffect(() => {
    if (statusFilter === "") {
      setFilteredData(dataSource);
    } else {
      const filtered =
        dataSource?.filter((order) => order.status === statusFilter) || []; // Kiểm tra dataSource không null
      setFilteredData(filtered);
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [statusFilter, dataSource]);

  return (
    <div>
      {/* <div>
        <Button
          className={`filter-button ${activeButton === "" ? "active" : ""}`}
          onClick={() => handleStatusFilter("")}
        >
          <AlignRightOutlined />
          Tất cả
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Processing" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Processing")}
        >
          <ClockCircleOutlined />
          Chờ xử lý
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Implementing" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Implementing")}
        >
          <FormOutlined />
          Đang thực hiện
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Completed" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Completed")}
        >
          <LikeOutlined />
          Đã hoàn thành
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Delivering" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Delivering")}
        >
          <TruckOutlined />
          Đang giao
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Delivered" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Delivered")}
        >
          <CheckOutlined />
          Đã giao
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Canceled" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Canceled")}
        >
          <CloseOutlined />
          Đã hủy
        </Button>
      </div> */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
        pagination={pagination}
        onChange={handleTableChange}
      ></Table>
      {/* <Modal
          open={isOpen}
          title="Add New Order"
          onCancel={() => {
            setIsOpen(false);
          }}
          onOk={() => formVariable.submit()}
        >
          <Form form={formVariable} onFinish={handleSubmit}>
            <Form.Item
              label="Full Name"
              name={"fullName"}
              rules={[
                {
                  required: true,
                  message: "Please Input Full Name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name={"phoneNumber"}
              rules={[
                {
                  required: true,
                  message: "Please Input Phone Number",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name={"address"}
              rules={[
                {
                  required: true,
                  message: "Please Input Address",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="First Language"
              name={["documents", 0, "firstLanguageId"]}
              rules={[
                {
                  required: true,
                  message: "Please Input First Language",
                },
              ]}
            >
              <Select options={language} />
            </Form.Item>
            <Form.Item
              label="Second Language"
              name={["documents", 0, "secondLanguageId"]}
              rules={[
                {
                  required: true,
                  message: "Please Input First Language",
                },
              ]}
            >
              <Select options={language} />
            </Form.Item>
            <Form.Item
              label="File"
              name={["documents", 0, "urlPath"]}
              rules={[
                {
                  required: true,
                  message: "Please Input File",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="fileType"
              name={["documents", 0, "fileType"]}
              rules={[
                {
                  required: true,
                  message: "Please Input First Language",
                },
              ]}
            >
              <Select placeholder="Select File Type">
                <Select.Option value="Hard">Hard</Select.Option>
                <Select.Option value="Soft">Soft</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="PageNumber"
              name={["documents", 0, "pageNumber"]}
              rules={[
                {
                  required: true,
                  message: "Please Input PageNumber",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              label="NumberOfCopies"
              name={["documents", 0, "NumberOfCopies"]}
              rules={[
                {
                  required: true,
                  message: "Please Input NumberOfCopies",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              label="notarizationRequest"
              name={["documents", "notarizationRequest"]}
              rules={[
                {
                  required: true,
                  message: "Please Input notarizationRequest",
                },
              ]}
            >
              <Select placeholder="Select notarizationRequest">
                <Select.Option value="True">Yes</Select.Option>
                <Select.Option value="false">No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="NumberOfNotarizatedCopies"
              name={["documents", 0, "NumberOfNotarizatedCopies"]}
              rules={[
                {
                  required: true,
                  message: "Please Input NumberOfNotarizatedCopies",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              label="Notarization Type"
              name={["documents", 0, "notarizationId"]}
              rules={[
                {
                  required: true,
                  message: "Please Input Notarization Type",
                },
              ]}
            >
              <Select options={notarizationType} />
            </Form.Item>
            <Form.Item
              label="Document Type"
              name={["documents", 0, "documentTypeId"]}
              rules={[
                {
                  required: true,
                  message: "Please Input Document Type",
                },
              ]}
            >
              <Select options={documentType} />
            </Form.Item>
          </Form>
        </Modal> */}
    </div>
  );
}

export default OrderNoShip;
