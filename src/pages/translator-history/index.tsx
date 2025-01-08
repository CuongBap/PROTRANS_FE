import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useForm } from "antd/es/form/Form";
import {
  CheckCircleOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeTwoTone,
  FileOutlined,
  FileSyncOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { toast } from "react-toastify";
import dayjs from "dayjs";

function History() {
  const [dataSource, setDataSource] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const UserAccount = useSelector((store: RootState) => store.accountmanage);
  const UserAccount2 = useSelector(
    (store: RootState) => store.accountmanage.Id
  );

  const [language, setLanguage] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  console.log(UserAccount);

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

  useEffect(() => {
    fetchLanguages();
  }, []);

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

  // const openInNewTab = (url) => {
  //   // Tạo nội dung HTML cho tab mới
  //   const newWindow = window.open();
  //   if (newWindow) {
  //     newWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Tài liệu</title>
  //         <style>
  //           body { margin: 0; padding: 0; overflow: hidden; }
  //           iframe {
  //             width: 100%;
  //             height: 100vh;
  //             border: none;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <iframe src="${url}" title="Document Viewer"></iframe>
  //       </body>
  //     </html>
  //   `);
  //     newWindow.document.close();
  //   } else {
  //     console.error("Popup bị chặn! Hãy kiểm tra cài đặt trình duyệt.");
  //   }
  // };

  useEffect(() => {
    fetchNotarizationType();
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
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a, b) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
      render: (deadline) => {
        return dayjs(deadline).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Chi tiết",
      dataIndex: "document",
      key: "document",
      align: "center" as const,
      render: (document) => (
        <div style={{ textAlign: "center" as const }}>
          <Tooltip title="Xem chi tiết tài liệu">
            <EyeOutlined
              style={{
                cursor: "pointer",
                fontSize: selectedDocumentId === document.id ? "24px" : "18px",
                color: selectedDocumentId === document.id ? "#1890ff" : "black",
              }}
              onClick={() => {
                setSelectedDocument(document);
                setSelectedDocumentId(document.id);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        switch (status) {
          case "Translating":
            return (
              <div className="status-translating">
                <FileSyncOutlined />
                &nbsp; Đang dịch
              </div>
            );
          case "Translated":
            return (
              <div className="status-translated">
                <CheckOutlined />
                &nbsp; Đã dịch xong
              </div>
            );
          default:
            return status;
        }
      },
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const fetchAssignment = async () => {
    console.log(UserAccount2);
    try {
      setLoading(true);
      const response = await api.get(`AssignmentTranslation/${UserAccount2}`);

      const filteredData = response.data.data.filter(
        (item) => item.status !== "Translating"
      );

      setDataSource(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (UserAccount2) {
      fetchAssignment();
    }
  }, [UserAccount2]);

  return (
    <div className="container">
      <div className="document-details">
        <h1>CHI TIẾT TÀI LIỆU</h1>
        {selectedDocument ? (
          <div className="details-grid">
            <div className="details-row">
              <span>Ngôn ngữ gốc</span>
              <span>
                :{" "}
                {(() => {
                  const firstLanguageId = selectedDocument.firstLanguageId;
                  if (!language || language.length === 0) {
                    return "Loading...";
                  }
                  const foundLanguage = language.find(
                    (lang) => lang.value === firstLanguageId
                  );
                  return foundLanguage ? foundLanguage.label : null;
                })()}
              </span>
            </div>
            <div className="details-row">
              <span>Ngôn ngữ cần dịch</span>
              <span>
                :{" "}
                {(() => {
                  const firstLanguageId = selectedDocument.secondLanguageId;
                  if (!language || language.length === 0) {
                    return "Loading...";
                  }
                  const foundLanguage = language.find(
                    (lang) => lang.value === firstLanguageId
                  );
                  return foundLanguage ? foundLanguage.label : null;
                })()}
              </span>
            </div>
            <div className="details-row">
              <span>Mã tài liệu</span>
              <span>: {selectedDocument.code}</span>
            </div>
            <div className="details-row">
              <span>Loại tài liệu</span>
              <span>
                :{" "}
                {(() => {
                  const documentTypeId = selectedDocument.documentTypeId;
                  if (!documentType || documentType.length === 0) {
                    return "Loading...";
                  }
                  const foundLanguage = documentType.find(
                    (lang) => lang.value === documentTypeId
                  );
                  return foundLanguage ? foundLanguage.label : null;
                })()}
              </span>
            </div>
            <div className="details-row">
              <span>Số trang</span>
              <span>: {selectedDocument.pageNumber}</span>
            </div>
            <div className="details-row">
              <span>Số bản cần dịch</span>
              <span>: {selectedDocument.numberOfCopies}</span>
            </div>
            <div className="details-row">
              <span>Yêu cầu công chứng</span>
              <span>
                : {selectedDocument.notarizationRequest ? "Có" : "Không"}
              </span>
            </div>
            <div className="details-row">
              <span>Loại công chứng</span>
              <span>
                :{" "}
                {(() => {
                  const notarizationId = selectedDocument.notarizationId;
                  if (!notarizationType || notarizationType.length === 0) {
                    return "Loading...";
                  }
                  const foundLanguage = notarizationType.find(
                    (lang) => lang.value === notarizationId
                  );
                  return foundLanguage ? foundLanguage.label : "Không";
                })()}
              </span>
            </div>
            <div className="details-row">
              <span>Số bản công chứng</span>
              <span>: {selectedDocument.numberOfNotarizedCopies}</span>
            </div>
            <div className="details-row">
              <span>Tệp đính kèm</span>
              <span>
                :{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal();
                  }}
                >
                  Xem
                </a>
                <Modal
                  closable={false}
                  visible={isModalVisible}
                  onCancel={closeModal}
                  footer={null}
                  width="80%"
                >
                  <iframe
                    src={selectedDocument.urlPath}
                    style={{
                      width: "100%",
                      height: "80vh",
                      border: "none",
                    }}
                    title="Xem tài liệu"
                  ></iframe>
                </Modal>
              </span>
            </div>
            {/* <div className="iframe-container">
              {iframeUrl && (
                <iframe
                  src={iframeUrl}
                  style={{
                    width: "100%",
                    height: "600px",
                    border: "none",
                  }}
                  title="Xem tài liệu"
                ></iframe>
              )}
            </div> */}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            Chọn một tài liệu để xem chi tiết
          </p>
        )}
      </div>
      <Table
        style={{ width: "50%" }}
        columns={columns}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
      ></Table>
    </div>
  );
}

export default History;
