import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditTwoTone,
  FileTwoTone,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

function DocumentDetails() {
  const [formVariable] = useForm();
  const { id } = useParams();
  const [document, setDocument] = useState<Document[]>();
  const [translator, setTranslator] = useState([]);
  const [language, setLanguage] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [selectsecondlanguageId, setSelectsecondlanguageId] = useState(null);
  const [selectfirstlanguageId, setSelectfirstlanguageId] = useState(null);
  const [dataAssignTrans, setDataAssignTrans] = useState([]);
  const [Selectdealine, setSelectdealine] = useState(null);
  //---------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getIframeSrc = (urlPath) => {
    if (!urlPath || typeof urlPath !== "string") {
      return "";
    }

    const hasExtension = urlPath.includes(".");
    if (!hasExtension) {
      console.warn("URL không xác định định dạng.");
      return "";
    }

    const extension = urlPath.split(".").pop().split("?")[0].toLowerCase();
    console.log(extension);

    switch (extension) {
      case "pdf":
        return urlPath;
      case "docx":
      case "doc":
      case "pptx":
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          urlPath
        )}`;
      default:
        console.warn(`Định dạng không được hỗ trợ: ${extension}`);
        return "";
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);

  //------------------------------------------------
  const fetchNotarizationType = async () => {
    const response = await api.get("Notarization");
    setIsFetching(false);
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

  //-----------------------------------------
  const fetchLanguages = async () => {
    const response = await api.get("Language");
    setIsFetching(false);
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

  //-----------------------------------------------------

  const fetchDocumentType = async () => {
    const response = await api.get("DocumentType");
    setIsFetching(false);
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

  //--------------------------------------------------------
  const columns = [
    {
      title: "Ngôn ngữ gốc",
      dataIndex: "firstLanguageId",
      key: "firstLanguageId",
      render: (firstLanguageId) => {
        // Check if category is available and initialized
        if (!language || language.length === 0) return null;

        // Find the category by ID and return its name
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
        // Check if category is available and initialized
        if (!language || language.length === 0) return null;

        // Find the category by ID and return its name
        const foundLanguage = language.find(
          (lang) => lang.value === secondLanguageId
        );
        return foundLanguage ? foundLanguage.label : null;
      },
    },
    {
      title: "Mã tài liệu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tệp",
      dataIndex: "urlPath",
      key: "urlPath",
      render: (urlPath) => {
        // Check if there is a URL to render
        return urlPath ? (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
            >
              <FileTwoTone style={{ fontSize: "16px" }} />
            </a>
            <Modal
              closable={false}
              visible={isModalVisible}
              onCancel={closeModal}
              footer={null}
              width="80%"
              centered
            >
              <iframe
                src={getIframeSrc(urlPath)}
                style={{
                  width: "100%",
                  height: "80vh",
                  border: "none",
                }}
                title="Xem tài liệu"
              ></iframe>
            </Modal>
          </div>
        ) : null;
      },
    },
    {
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => {
        return <span>{dayjs(deadline).format("DD/MM/YYYY")}</span>;
      },
    },
    // {
    //   title: "Loại tài liệu",
    //   dataIndex: "fileType",
    //   key: "fileType",
    // },
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
    // {
    //   title: "Số trang",
    //   dataIndex: "pageNumber",
    //   key: "pageNumber",
    // },
    // {
    //   title: "Số bản cần dịch",
    //   dataIndex: "numberOfCopies",
    //   key: "numberOfCopies",
    // },
    {
      title: "Yêu cầu công chứng",
      dataIndex: "notarizationRequest",
      key: "notarizationRequest",
      render: (notarizationRequest) =>
        notarizationRequest ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: "16px" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: "16px" }} />
        ),
    },
    // {
    //   title: "Số bản công chứng",
    //   dataIndex: "numberOfNotarizedCopies",
    //   key: "numberOfNotarizedCopies",
    // },
    // {
    //   title: "Loại công chứng",
    //   dataIndex: "notarizationId",
    //   key: "notarizationId",
    //   render: (notarizationId) => {
    //     // Check if category is available and initialized
    //     if (!notarizationType || notarizationType.length === 0) return null;

    //     // Find the category by ID and return its name
    //     const foundnotarizationType = notarizationType.find(
    //       (lang) => lang.value === notarizationId
    //     );
    //     return foundnotarizationType ? foundnotarizationType.label : null;
    //   },
    // },
    {
      title: "Trạng thái dịch",
      dataIndex: "translationStatus",
      key: "translationStatus",
      render: (status) => (
        <Tag
          color={
            status === "Translating"
              ? "orange"
              : status === "Translated"
              ? "green"
              : status === "Processing"
              ? "red"
              : "default"
          }
        >
          {status === "Translating"
            ? "Đang dịch"
            : status === "Translated"
            ? "Đã dịch"
            : status === "Processing"
            ? "Chờ xử lý"
            : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái công chứng",
      dataIndex: "notarizationStatus",
      key: "notarizationStatus",
      render: (status) => (
        <Tag color="blue">
          {status === "Processing"
            ? "Chờ xử lý"
            : status === "PickingUp"
            ? "Đang chờ lấy bản gốc"
            : status === "PickedUp"
            ? "Đã lấy bản gốc"
            : status === "Notarizating"
            ? "Đang công chứng"
            : status === "Notarizated"
            ? "Đã công chứng"
            : "Không"}
        </Tag>
      ),
    },
    {
      title: "Tác vụ",
      dataIndex: "id",
      key: "id",
      render: (id, data) =>
        data.translationStatus === "Processing" ? (
          <EditTwoTone
            style={{ fontSize: "18px" }}
            onClick={() => {
              console.log(data.firstLanguageId);
              console.log(data.secondLanguageId);
              setSelectfirstlanguageId(data.firstLanguageId);
              setSelectsecondlanguageId(data.secondLanguageId);
              setSelectedDocumentId(id);
              setIsOpen(true);
              setSelectdealine(data.deadline);
            }}
          />
        ) : null,
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          borderRadius: "8px",
          justifyContent: "center",
        }}
      >
        <p>
          <b>Số trang:</b> {record.pageNumber}
        </p>
        <p>
          <b>Loại tài liệu:</b>{" "}
          {documentType.find((type) => type.value === record.documentTypeId)
            ?.label || "Không"}
        </p>
        <p>
          <b>Số bản cần dịch:</b> {record.numberOfCopies}
        </p>
        <p>
          <b>Loại công chứng:</b>{" "}
          {notarizationType.find((type) => type.value === record.notarizationId)
            ?.label || "Không"}
        </p>
        <p>
          <b>Số bản công chứng:</b> {record.numberOfNotarizedCopies}
        </p>
      </div>
    ),
  };

  // async function fetchDocument() {
  //   const response = await api.get("Document");
  //   console.log(response.data.data);
  //   setDocument(response.data.data);
  // }

  // useEffect(() => {
  //   fetchDocument();
  // }, []);

  //----------------------Điều Phối-----------------------------------//
  const fetchTranslator = async (
    selectfirstlanguageId,
    selectsecondlanguageId
  ) => {
    console.log(selectfirstlanguageId);
    console.log(selectsecondlanguageId);
    try {
      const response = await api.get(
        `Account/GetBy2LanguageId?firstLanguageId=${selectfirstlanguageId}&secondLanguageId=${selectsecondlanguageId}&documentId=${selectedDocumentId}`
      );
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      console.log(data);

      const list = data.map((Account) => ({
        value: Account.id,
        label: (
          <span
            style={{
              whiteSpace: "normal",
              width: "auto",
              maxWidth: "none",
              display: "inline-block",
            }}
          >
            <strong>
              {Account.fullName} -{" "}
              <small style={{ color: "#888" }}>
                {Account.agencyName} - Đang nhận {Account.assignmentsInProgress}{" "}
                việc
              </small>
            </strong>
          </span>
        ),
      }));

      console.log(list);
      setTranslator(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectfirstlanguageId && selectsecondlanguageId && selectedDocumentId) {
      fetchTranslator(selectfirstlanguageId, selectsecondlanguageId);
    }
  }, [selectfirstlanguageId, selectsecondlanguageId, selectedDocumentId]);
  //---------------------AssignmentTranslation--------------------------------//

  const handlesubmitAssignTrans = async (values) => {
    const payload = {
      translatorId: values.translatorId,
      status: "string",
      documentId: selectedDocumentId,
      deadline: values.deadline.toISOString(),
    };

    try {
      const response = await api.post("AssignmentTranslation", payload);

      if (response) {
        const currentDateTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo sử dụng múi giờ Việt Nam
        });
        console.log(response.data.data.translatorId);

        const paramPushNoti = {
          specId: response.data.data.translatorId,
          title: "Nhiệm vụ dịch thuật",
          message: `Bạn đã nhận một task mới vào ngày thông báo ${currentDateTime}.`,
          author: "string",
        };
        const resPushNoti = api.post(`Notification/Single`, paramPushNoti);
        console.log("resPushNoti", resPushNoti);
      }

      setDataAssignTrans(response.data.data);
      formVariable.resetFields();
      toast.success("Giao việc thành công.");
      fetchDetaildocuments();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    }
    console.log("payload:", payload);
  };

  //----------------------------------------------------------------------------//
  const fetchDetaildocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`Document/GetByOrderId?id=${id}`);
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      console.log(response.data.data);
      if (data.length > 0) {
        setDocument(data);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Không có dữ liệu");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetaildocuments();
  }, [id]);

  return (
    <div className="details">
      <Table
        columns={columns}
        dataSource={document}
        expandable={expandable}
        rowKey="id"
        loading={loading}
      ></Table>
      <Modal
        open={isOpen}
        title="GIAO VIỆC DỊCH TÀI LIỆU"
        onCancel={() => {
          setIsOpen(false);
          formVariable.resetFields();
        }}
        onOk={() => {
          formVariable.submit();
        }}
        cancelText="Hủy"
        okText="Giao việc"
        width={600}
      >
        <Form form={formVariable} onFinish={handlesubmitAssignTrans}>
          <Form.Item
            label="Dịch thuật viên"
            name={"translatorId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={translator} style={{ width: "420px" }} />
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
                return (
                  current &&
                  (current.isSameOrBefore(dayjs(), "day") ||
                    current.isSameOrAfter(dayjs(Selectdealine), "day"))
                );
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DocumentDetails;
