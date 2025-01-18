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
import { useNavigate } from "react-router-dom";
import {
  BarsOutlined,
  BorderOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { SortOrder } from "antd/es/table/interface";

function Transaction() {
  const [formVariable] = useForm();
  const [formUpdate] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "address",
    //   key: "address",
    // },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: (
        <span>
          <Tooltip title="Đây là tổng giá trị của đơn hàng mà khách hàng đã thanh toán.">
            <InfoCircleOutlined
              style={{
                marginRight: 5,
                color: "#219136",
                cursor: "pointer",
              }}
            />
          </Tooltip>
          Tổng giá (VNĐ)
        </span>
      ),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => {
        return text !== null ? (
          <span style={{ color: "#219136" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ) : (
          text
        );
      },
    },
    {
      title: (
        <span>
          <Tooltip title="Đây là phí công chứng mà trung tâm đã trả cho đơn vị công chứng.">
            <InfoCircleOutlined
              style={{
                marginRight: 5,
                color: "#e84354",
                cursor: "pointer",
              }}
            />
          </Tooltip>
          Phí công chứng (VNĐ)
        </span>
      ),
      dataIndex: "totalNotarizationFee",
      key: "totalNotarizationFee",
      render: (text) => {
        return text !== null && text !== 0 ? (
          <span style={{ color: "#e84354" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ) : (
          text
        );
      },
    },
    {
      title: "Trung tâm",
      dataIndex: "agencyName",
      key: "agencyName",
    },
    {
      title: "Thời gian thanh toán",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      sorter: (a, b) => {
        const timeA = a.modifiedDate ? dayjs(a.modifiedDate).unix() : 0;
        const timeB = b.modifiedDate ? dayjs(b.modifiedDate).unix() : 0;
        return timeA - timeB;
      },
      defaultSortOrder: "descend" as SortOrder,
      render: (modifiedDate) => {
        return modifiedDate
          ? dayjs(modifiedDate).format("HH:mm DD/MM/YYYY")
          : "N/A";
      },
    },
    {
      title: "Tác vụ",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => (
        <div>
          <Tooltip title="Chi tiết">
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
              onClick={() =>
                navigate(`/dashboardmanager/order/details/${orderId}`)
              }
            >
              <BarsOutlined style={{ fontSize: "18px", fontWeight: "bold" }} />
            </button>
          </Tooltip>
        </div>
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

  async function fetchTransaction() {
    setLoading(true);
    const response = await api.get("Transaction");
    console.log(response.data.data);
    setDataSource(response.data.data);
    setLoading(false);
  }

  async function handleSubmit(values) {
    console.log(values);

    const response = await api.post("Transaction", values);
    setDataSource([...dataSource, values]);
    formVariable.resetFields();
    handleHideModal();
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

  const handleDelete = async (id) => {
    console.log(id);

    await api.delete(`Transaction/${id}`);

    const listAfterDelete = dataSource.filter(
      (transaction) => transaction.id != id
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
    fetchTransaction();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
      ></Table>
      <span>
        <em>
          <Button
            style={{
              background: "#219136",
              border: "none",
              width: "10px",
              height: "10px",
              padding: 0,
              borderRadius: "50%",
            }}
          />
          &nbsp; : tổng giá trị của đơn hàng mà khách hàng đã thanh toán.
        </em>
      </span>
      <br />
      <br />
      <span>
        <em>
          <Button
            style={{
              background: "#e84354",
              border: "none",
              width: "10px",
              height: "10px",
              padding: 0,
              borderRadius: "50%",
            }}
          />
          &nbsp; : phí công chứng mà trung tâm đã trả cho đơn vị công chứng.
        </em>
      </span>
      <Modal
        open={isOpen}
        title="Thêm"
        onCancel={handleHideModal}
        onOk={handleOk}
        cancelText="Đóng"
        okText="Thêm"
      >
        <Form form={formVariable} onFinish={handleSubmit}>
          <Form.Item
            label="Loại"
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
        title="Cập nhật"
        onCancel={() => {
          setVisibleEditModal(false);
        }}
        onOk={() => {
          formUpdate.submit();
        }}
      >
        <Form form={formUpdate} onFinish={handleSubmit}>
          <Form.Item
            label="Loại"
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

export default Transaction;
