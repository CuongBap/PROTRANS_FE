import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { Value } from "sass";
import api from "../../config/api";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

function DocumentType() {
  const [formVariable] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [allDocumentTypes, setAllDocumentTypes] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  console.log("TOKEN: ", token);
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hệ số giá",
      dataIndex: "priceFactor",
      key: "priceFactor",
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
        <Popconfirm
          title={`Bạn có chắc chắn muốn ${
            !data.isDeleted
              ? `ẩn loại tài liệu ${data.name}?`
              : `hiển thị lại loại tài liệu ${data.name}?`
          }`}
          onConfirm={() => handleDeleteDocumentType(id)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Tooltip title={!data.isDeleted ? "Ẩn" : "Hiển thị lại"}>
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

  const handleSearch = (value) => {
    const filtered = allDocumentTypes.filter((documentType) =>
      documentType.name.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  async function fetchDocumentType() {
    setLoading(true);
    try {
      console.log("token", token);
      const response = await api.get("DocumentType");
      console.log(response.data.data);
      setDataSource(response.data.data);
      setAllDocumentTypes(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }

  async function handleSubmit(values) {
    try {
      console.log(values);

      const response = await api.post("DocumentType", values);
      toast.success("Thêm loại tài liệu mới thành công.");
      fetchDocumentType();
      formVariable.resetFields();
      handleHideModal();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const handleDeleteDocumentType = async (id) => {
    console.log(id);
    await api.delete(`DocumentType/${id}`);
    toast.info("Cập nhật thành công.");
    fetchDocumentType();
  };

  function handleHideModal() {
    setIsOpen(false);
  }

  function handleOk() {
    formVariable.submit();
  }

  useEffect(() => {
    fetchDocumentType();
  }, []);
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          formVariable.resetFields();
          setIsOpen(true);
        }}
        style={{ marginBottom: "10px", marginRight: "10px" }}
      >
        <PlusOutlined />
        Thêm loại tài liệu mới
      </Button>
      <Input.Search
        placeholder="Tìm kiếm theo tên"
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 10, width: 300 }}
      />
      <Table
        style={{ width: "1200px" }}
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
        title="Thêm loại tài liệu mới"
        onCancel={handleHideModal}
        onOk={handleOk}
        cancelText="Đóng"
        okText="Thêm"
      >
        <Form form={formVariable} onFinish={handleSubmit}>
          <Form.Item
            label="Loại tài liệu"
            name={"name"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Hệ số giá"
            name={"priceFactor"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DocumentType;
