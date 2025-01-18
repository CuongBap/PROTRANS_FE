import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Button,
  Spin,
  Badge,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { toast } from "react-toastify";
import { AuditOutlined, SignatureOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { SortOrder } from "antd/es/table/interface";

function AssignNotarization() {
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [shipper, setShipper] = useState([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [language, setLanguage] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  useEffect(() => {
    fetchAgency();
    fetchDocumentType();
    fetchNotarizationType();
    fetchLanguages();
    fetchShipper();
    fetchDocument();
    setSelectedDocumentIds([]);
  }, [selectedAgencyId]);

  const fetchDocumentType = async () => {
    const response = await api.get("DocumentType");
    const data = response.data.data;
    const list = data.map((Document) => ({
      value: Document.id,
      label: <span>{Document.name}</span>,
    }));
    setDocumentType(list);
  };

  const fetchNotarizationType = async () => {
    const response = await api.get("Notarization");
    const data = response.data.data;
    const list = data.map((notarization) => ({
      value: notarization.id,
      label: <span>{notarization.name}</span>,
    }));
    setNotarizationType(list);
  };

  const fetchAgency = async () => {
    const response = await api.get("Agency");
    const data = response.data.data;
    const list = data.map((agency) => ({
      value: agency.id,
      label: <span>{agency.name}</span>,
    }));
    setAgencyList(list);
    if (list.length > 0 && !selectedAgencyId) {
      setSelectedAgencyId(list[0].value);
    }
  };

  const fetchLanguages = async () => {
    const response = await api.get("Language");
    const data = response.data.data;
    const list = data.map((language) => ({
      value: language.id,
      label: <span>{language.name}</span>,
    }));
    setLanguage(list);
  };

  const fetchShipper = async () => {
    try {
      const response = await api.get(
        `Account/GetAllShipperByAgencyId?agencyId=${selectedAgencyId}`
      );
      const data = response.data.data;
      const list = data.map((ship) => ({
        value: ship.id,
        label: <span>{ship.fullName}</span>,
      }));
      setShipper(list);
    } catch (error) {
      setShipper(null);
    }
  };

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `Document/GetDocumentsToBeNotarized?id=${selectedAgencyId}`
      );

      // if (response) {
      //   const currentDateTime = new Date().toLocaleString("vi-VN", {
      //     timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo sử dụng múi giờ Việt Nam
      //   });
      //   console.log(response.data.data.customerId);

      //   const paramPushNoti = {
      //     specId: response.data.data.customerId,
      //     title: "Báo giá dịch thuật",
      //     message: `Đơn giá của bạn đã được xử lí có giá ${response.data.data.totalPrice}. Ngày thông báo: ${currentDateTime}`,
      //     author: "string",
      //   };
      //   const resPushNoti = api.post(`Notification/Single`, paramPushNoti);
      //   console.log("resPushNoti", resPushNoti);
      // }

      setDataSource(response.data.data);
      setSelectedDocumentIds([]);
      setLoading(false);
    } catch (error) {
      // toast.error("Fail.");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Chọn",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedDocumentIds.includes(record.id)}
          onChange={() => handleSelectDocument(record.id)}
        />
      ),
    },
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
      dataIndex: "firstLanguageId",
      key: "firstLanguageId",
      render: (firstLanguageId) => {
        if (!language || language.length === 0) return null;
        const foundLanguage = language.find(
          (lang) => lang.value === firstLanguageId
        );
        return foundLanguage ? foundLanguage.label : null;
      },
    },
    {
      title: "Ngôn ngữ dịch",
      dataIndex: "secondLanguageId",
      key: "secondLanguageId",
      render: (secondLanguageId) => {
        if (!language || language.length === 0) return null;
        const foundLanguage = language.find(
          (lang) => lang.value === secondLanguageId
        );
        return foundLanguage ? foundLanguage.label : null;
      },
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Số trang",
      dataIndex: "pageNumber",
      key: "pageNumber",
    },
    // {
    //   title: "Loại tài liệu",
    //   dataIndex: "documentTypeId",
    //   key: "documentTypeId",
    //   render: (documentTypeId) => {
    //     // Check if category is available and initialized
    //     if (!documentType || documentType.length === 0) return null;

    //     // Find the category by ID and return its name
    //     const founddocumentType = documentType.find(
    //       (lang) => lang.value === documentTypeId
    //     );
    //     return founddocumentType ? founddocumentType.label : null;
    //   },
    // },
    {
      title: "Thời hạn đơn hàng",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a, b) => {
        const timeA = a.deadline ? dayjs(a.deadline).unix() : 0;
        const timeB = b.deadline ? dayjs(b.deadline).unix() : 0;
        return timeA - timeB;
      },
      defaultSortOrder: "ascend" as SortOrder,
      render: (deadline) => {
        return deadline ? dayjs(deadline).format("DD/MM/YYYY") : "N/A";
      },
    },
    // {
    //   title: "Yêu cầu công chứng",
    //   dataIndex: "notarizationRequest",
    //   key: "notarizationRequest",
    //   render: (notarizationRequest) => (notarizationRequest ? "Có" : "Không"),
    // },
    {
      title: "Số bản",
      dataIndex: "numberOfNotarizedCopies",
      key: "numberOfNotarizedCopies",
    },
    {
      title: "Loại công chứng",
      dataIndex: "notarizationId",
      key: "notarizationId",
      render: (notarizationId) => {
        // Check if category is available and initialized
        if (!notarizationType || notarizationType.length === 0) return null;

        // Find the category by ID and return its name
        const foundnotarizationType = notarizationType.find(
          (lang) => lang.value === notarizationId
        );
        return foundnotarizationType ? foundnotarizationType.label : null;
      },
    },
  ];

  const handleSelectDocument = (id) => {
    if (selectedDocumentIds.includes(id)) {
      setSelectedDocumentIds(
        selectedDocumentIds.filter((docId) => docId !== id)
      );
    } else {
      setSelectedDocumentIds([...selectedDocumentIds, id]);
    }
  };

  const handleAssignNotarization = () => {
    if (selectedDocumentIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tài liệu để giao việc.");
      return;
    }
    setIsOpen(true);
  };

  const handlesubmitNotarization = async (values) => {
    const payload = {
      documentId: selectedDocumentIds,
      deadline: values.deadline,
      shipperId: values.shipperId,
    };

    try {
      const response = await api.post("AssignmentNotarization", payload);

      console.log(response.data.data);

      if (response) {
        const currentDateTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo sử dụng múi giờ Việt Nam
        });
        console.log(response.data.data.shipperId);

        const paramPushNoti = {
          specId: response.data.data.shipperId,
          title: "Giao việc đi công chứng",
          message: `Bạn có một nhiệm vụ đi công chứng vào ngày thông báo: ${currentDateTime}`,
          author: "string",
        };
        const resPushNoti = api.post(`Notification/Single`, paramPushNoti);
        console.log("resPushNoti", resPushNoti);
      }
      formVariable.resetFields();
      toast.success("Giao việc thành công.");
      setIsOpen(false);
      fetchDocument();
    } catch (error) {
      toast.error("Giao việc thất bại.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          onClick={handleAssignNotarization}
          style={{ marginRight: 10 }}
        >
          <SignatureOutlined />
          Giao việc
        </Button>
        <Select
          options={agencyList}
          value={selectedAgencyId}
          onChange={(value) => setSelectedAgencyId(value)}
          style={{ width: 300 }}
          placeholder="Chọn trung tâm"
        />
      </div>
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
      <span
        style={{
          color: selectedDocumentIds.length === 0 ? "#f07575" : "#2bc24e",
        }}
      >
        <em>* {selectedDocumentIds.length} tài liệu đang được chọn</em>
      </span>
      <Modal
        open={isOpen}
        title="Giao việc công chứng"
        cancelText="Hủy"
        onCancel={() => {
          setIsOpen(false);
          formVariable.resetFields();
        }}
        okText="Giao việc"
        onOk={() => formVariable.submit()}
      >
        <Form form={formVariable} onFinish={handlesubmitNotarization}>
          <Form.Item
            label="Nhân viên"
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
            <DatePicker
              placeholder="Chọn ngày"
              disabledDate={(current) => {
                return current && current.isBefore(dayjs(), "day");
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AssignNotarization;
