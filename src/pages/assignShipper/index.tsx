import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { CheckOutlined, FormOutlined, TruckOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

function AssignShipper() {
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [dataAssignshipper, setDataAssignShipper] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [shipper, setShipper] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [agency, setAgency] = useState([]);

  const fetchAgency = async () => {
    const response = await api.get("Agency");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((agen) => ({
      value: agen.id,
      label: <span>{agen.name}</span>,
    }));

    setAgency(list);
  };

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
      title: "Chi nhánh",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => {
        // Check if category is available and initialized
        if (!agency || agency.length === 0) return null;

        // Find the category by ID and return its name
        const foundAgency = agency.find((agen) => agen.value === agencyId);
        return foundAgency ? foundAgency.label : null;
      },
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
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "Completed":
            return (
              <div className="status-completed">
                <FormOutlined />
                &nbsp; Đã hoàn thành
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
        <TruckOutlined
          type="primary"
          style={{ fontSize: "25px", color: "orange" }}
          title="Giao việc"
          onClick={() => {
            setIsOpen(true);
            setSelectedOrderId(id);
            setSelectedAgencyId(data.agencyId);
          }}
        />
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
    const payload = {
      shipperId: values.shipperId,
      orderId: selectedOrderId,
      deadline: values.deadline,
    };
    console.log(payload);
    try {
      const response = await api.post("AssignmentShipping/Ship", payload);

      console.log(response.data.data);
      setDataAssignShipper([...dataAssignshipper, response.data.data]);
      formVariable.resetFields();
      setIsOpen(false);
      fetchOrder();
      toast.success("Giao việc thành công");
    } catch (error) {
      toast.error("Giao việc shipper thất bại");
    }
  }

  const fetchShipper = async () => {
    const response = await api.get(
      `Account/GetAllShipperByAgencyId?agencyId=${selectedAgencyId}`
    );
    const data = response.data.data;
    console.log({ data });

    const list = data.map((ship) => ({
      value: ship.id,
      label: (
        <span>
          <strong>
            {ship.fullName} -{" "}
            <small style={{ color: "#888" }}>{ship.agencyName}</small>
          </strong>{" "}
          <br />
        </span>
      ),
    }));

    setShipper(list);
  };

  async function fetchOrder() {
    const response = await api.get("Order/GetCompletedOrders");
    console.log(response.data.data);
    setDataSource(response.data.data);
  }

  useEffect(() => {
    fetchShipper();
  }, [selectedAgencyId]);

  useEffect(() => {
    fetchAgency();
    fetchOrder();
  }, []);

  return (
    <div className="AssignShipper">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
      ></Table>
      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        onOk={() => formVariable.submit()}
        cancelText="Đóng"
        okText="Giao việc"
        title="Giao việc vận chuyển"
      >
        <Form form={formVariable} onFinish={handleSubmit}>
          <Form.Item
            label="Người vận chuyển"
            name={"shipperId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={shipper} />
          </Form.Item>
          <Form.Item
            label="Thời hạn"
            name={"deadline"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <DatePicker placeholder="Chọn ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AssignShipper;
