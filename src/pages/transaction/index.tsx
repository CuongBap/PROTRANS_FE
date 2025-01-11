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
import dayjs from "dayjs";

function Transaction() {
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
      title: "Khách hàng",
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
      title: "Tổng giá (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
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
      render: (modifiedDate) => {
        return dayjs(modifiedDate).format("HH:mm DD/MM/YYYY");
      },
    },
    // {
    //   title: "Tác vụ",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (id, data) => (
    //     <Space>
    //       <Popconfirm
    //         title="Delete Category"
    //         description="Are you sure to delete this language?"
    //         onConfirm={() => handleDeleteLanguage(id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Tooltip title="Vô hiệu hóa">
    //           <button
    //             style={{
    //               color: "white",
    //               backgroundColor: data.isDeleted ? "#23d783" : "#e03955",
    //               padding: 5,
    //               borderRadius: 8,
    //               borderWidth: 0,
    //               fontSize: 12,
    //               textAlign: "center",
    //               cursor: "pointer",
    //             }}
    //           >
    //             {data.isDeleted ? (
    //               <div>
    //                 <EyeOutlined style={{ fontSize: "18px" }} />
    //               </div>
    //             ) : (
    //               <div>
    //                 <EyeInvisibleOutlined style={{ fontSize: "18px" }} />
    //               </div>
    //             )}
    //           </button>
    //         </Tooltip>
    //       </Popconfirm>
    //       <Tooltip title="Cập nhật">
    //         <button
    //           style={{
    //             color: "white",
    //             backgroundColor: "orange",
    //             padding: 5,
    //             borderRadius: 8,
    //             borderWidth: 0,
    //             fontSize: 12,
    //             textAlign: "center",
    //             cursor: "pointer",
    //           }}
    //           onClick={() => {
    //             setVisibleEditModal(true);
    //             formVariable.setFieldsValue(data);
    //           }}
    //         >
    //           <EditOutlined style={{ fontSize: "18px" }} />
    //         </button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
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
