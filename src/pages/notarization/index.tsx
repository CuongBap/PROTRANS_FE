import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
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

function Notarization() {
  const [formVariable] = useForm();
  const [formUpdate] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
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
      title: "Loại công chứng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
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
            title="Delete Category"
            description="Are you sure to delete this language?"
            onConfirm={() => handleDeleteLanguage(id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Vô hiệu hóa">
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
                setVisibleEditModal(true);
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

  async function fetchNotarization() {
    setLoading(true);
    try {
      const response = await api.get("Notarization");
      console.log(response.data.data);
      setDataSource(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }

  async function handleSubmit(values) {
    console.log(values);
    try {
      const response = await api.post("Notarization", values);
      setDataSource([...dataSource, values]);
      formVariable.resetFields();
      handleHideModal();
    } catch (error) {
      toast.error("Thêm mới loại công chứng thất bại.");
      setLoading(false);
    }
  }

  // async function handleEditLanguage(value) {
  //   const updateCategory = formUpdate.getFieldsValue();
  //   console.log(updateCategory);
  //   api
  //     .put(`Language/${value.id}`, {
  //       name: value.name,
  //     })
  //     .then(() => {
  //       fetchLanguage();
  //       setVisibleEditModal(false);
  //     });
  //   console.log("cuong");
  // }

  const handleDeleteLanguage = async (id) => {
    console.log(id);

    await api.delete(`Notarization/${id}`);

    const listAfterDelete = dataSource.filter(
      (notarization) => notarization.id != id
    );

    setDataSource(listAfterDelete);
  };

  function handleShowModal() {
    setIsOpen(true);
  }

  function handleHideModal() {
    setIsOpen(false);
  }

  function handleOk() {
    formVariable.submit();
  }

  useEffect(() => {
    fetchNotarization();
  }, []);

  return (
    <div className="languagePage">
      <Button
        type="primary"
        onClick={() => {
          formVariable.resetFields();
          setIsOpen(true);
        }}
        style={{ marginBottom: "10px" }}
      >
        <PlusOutlined />
        Thêm loại công chứng mới
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
        title="Thêm loại công chứng"
        onCancel={handleHideModal}
        onOk={handleOk}
        cancelText="Đóng"
        okText="Thêm"
      >
        <Form form={formVariable} onFinish={handleSubmit}>
          <Form.Item
            label="Loại công chứng"
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
            label="Giá"
            name={"price"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={visibleEditModal}
        title="Cập nhật loại công chứng"
        onCancel={() => {
          setVisibleEditModal(false);
        }}
        onOk={() => {
          formUpdate.submit();
          //handleEditLanguage(Value);
        }}
      >
        <Form form={formUpdate} onFinish={handleSubmit}>
          <Form.Item
            label="Loại công chứng"
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
        </Form>
      </Modal>
    </div>
  );
}

export default Notarization;
