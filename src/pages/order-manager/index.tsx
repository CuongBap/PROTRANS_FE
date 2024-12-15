import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  FormOutlined,
  MoreOutlined,
  PauseOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import "./index.css";

function Order() {
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notarizationType, setNotarizationType] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [language, setLanguage] = useState([]);
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
            return (
              <div className="status-completed">
                <FormOutlined />
                &nbsp; Đã hoàn thành
              </div>
            );
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
        <Button
          type="primary"
          style={{ background: "orange", borderRadius: "8px" }}
          onClick={() => navigate(`details/${id}`)}
        >
          <FormOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />
        </Button>
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
    const response = await api.get("Order");
    console.log(response.data.data);
    setDataSource(response.data.data);
  }

  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <div className="orderPage">
      {/* <Button
        type="primary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add New Order
      </Button> */}
      <Table
        columns={columns}
        dataSource={dataSource}
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

export default Order;
