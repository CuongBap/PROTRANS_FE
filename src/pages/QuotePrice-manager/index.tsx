import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../config/api";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

function QuotePrice() {
  const [formVariable] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [language, setLanguage] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLanguages = async () => {
    const response = await api.get(`Language`);
    const data = response.data.data;
    console.log({ data });

    const list = data.map((language) => ({
      value: language.id,
      label: <span>{language.name}</span>,
    }));

    setLanguage(list);
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await api.delete(`QuotePrice/${id}`);
      toast.info("Cập nhật thành công.");
      fetchQuotePrice();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // const fetchLanguages = async () => {
  //   const response = await axios.get(`https://localhost:7122/api/Language`);
  //   const data = response.data.data;
  //   console.log({ data });

  //   const list = data.flatMap((language) => [
  //     {
  //       value: language.firstLanguageId,
  //       label: <span>{language.name}</span>,
  //     },
  //     {
  //       value: language.secondLanguageId,
  //       label: <span>{language.name}</span>,
  //     },
  //   ]);

  //   console.log(list);
  //   setLanguage(list);
  // };

  useEffect(() => {
    fetchLanguages();
  }, []);

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
      title: "Ngôn ngữ gốc",
      dataIndex: "firstLanguageId", // Use firstLanguageId from QuotePrice data
      key: "firstLanguageId",
      render: (firstLanguageId) => {
        // Check if category is available and initialized
        if (!language || language.length === 0) return "Loading...";

        // Find the category by ID and return its name
        const foundLanguage = language.find(
          (lang) => lang.value === firstLanguageId
        );
        return foundLanguage ? foundLanguage.label : "Unknown Category";
      },
    },
    {
      title: "Ngôn ngữ cần dịch",
      dataIndex: "secondLanguageId", // Use secondLanguageId from QuotePrice data
      key: "secondLanguageId",
      render: (secondLanguageId) => {
        // Check if category is available and initialized
        if (!language || language.length === 0) return "Loading...";

        // Find the category by ID and return its name
        const foundLanguage = language.find(
          (lang) => lang.value === secondLanguageId
        );
        return foundLanguage ? foundLanguage.label : "Unknown Category";
      },
    },
    {
      title: "Giá (VNĐ/trang)",
      dataIndex: "pricePerPage",
      key: "pricePerPage",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) =>
        isDeleted ? (
          <div className="status-inactive">Đã ẩn</div>
        ) : (
          <div className="status-active">Hiển thị</div>
        ),
    },
    {
      title: "Tác vụ",
      dataIndex: "id",
      key: "id",
      render: (id, data) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn?"
            onConfirm={() => handleDelete(id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Ngưng dịch">
              <button
                style={{
                  color: "white",
                  backgroundColor: data.isDeleted ? "#23d783" : "#e03955",
                  padding: 5,
                  borderRadius: 8,
                  borderWidth: 0,
                  fontSize: 12,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {data.isDeleted ? (
                  <div>
                    <EyeOutlined style={{ fontSize: "18px" }} />
                  </div>
                ) : (
                  <div>
                    <EyeInvisibleOutlined style={{ fontSize: "18px" }} />
                  </div>
                )}
              </button>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Cập nhật">
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
              onClick={() => {
                setIsOpenUpdate(true);
                formVariable.setFieldsValue(data);
              }}
            >
              <EditOutlined style={{ fontSize: "18px" }} />
            </button>
          </Tooltip>
        </Space>
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

  async function fetchQuotePrice() {
    setLoading(true);
    try {
      const response = await api.get("QuotePrice");
      console.log("=============================");
      console.log(response.data.data);
      setDataSource(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuotePrice();
  }, []);

  async function handleSubmit(values) {
    console.log(values);
    try {
      console.log(values);
      const response = await api.post("QuotePrice", values);
      toast.success("Tạo báo giá mới thành công.");
      console.log(response.data.data);
      setDataSource([...dataSource, response.data.data]);
      formVariable.resetFields();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleUpdate(values) {
    console.log(values);
    try {
      const { id, ...updateData } = values; // Lấy id riêng và các trường khác
      const response = await api.put(`QuotePrice/${id}`, updateData); // Truyền id vào URL
      toast.success("Cập nhật thành công.");
      console.log(response.data.data);
      setIsOpenUpdate(false);
      fetchQuotePrice();
      formVariable.resetFields();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  function handleOk() {
    formVariable.submit();
  }

  return (
    <div className="quotePricePage">
      <Button
        type="primary"
        onClick={() => {
          formVariable.resetFields();
          setIsOpen(true);
        }}
        style={{ marginBottom: "10px" }}
      >
        <PlusOutlined />
        Tạo báo giá mới
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
        pagination={pagination}
        onChange={handleTableChange}
      ></Table>
      <Modal
        open={isOpen}
        title="Tạo báo giá mới"
        onCancel={() => setIsOpen(false)}
        onOk={handleOk}
        cancelText="Hủy"
        okText="Tạo"
      >
        <Form form={formVariable} onFinish={handleSubmit}>
          <Form.Item
            label="Ngôn ngữ gốc"
            name={"firstLanguageId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={language} />
          </Form.Item>
          <Form.Item
            label="Ngôn ngữ cần dịch"
            name={"secondLanguageId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={language} />
          </Form.Item>
          <Form.Item
            label="Giá"
            name={"pricePerPage"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <InputNumber min={10000} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isOpenUpdate}
        title="Cập nhật bảng báo giá"
        okText="Cập nhật"
        cancelText="Hủy"
        onCancel={() => {
          setIsOpenUpdate(false);
          formVariable.resetFields(); // Reset form
        }}
        onOk={handleOk}
      >
        <Form form={formVariable} onFinish={handleUpdate}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngôn ngữ gốc"
            name={"firstLanguageId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={language} disabled />
          </Form.Item>
          <Form.Item
            label="Ngôn cần dịch"
            name={"secondLanguageId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={language} disabled />
          </Form.Item>
          <Form.Item
            label="Giá"
            name={"pricePerPage"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <InputNumber min={10000} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default QuotePrice;
