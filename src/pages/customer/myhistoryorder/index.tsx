import {
  Table,
  Button,
  Spin,
  Divider,
  Form,
  Modal,
  Popconfirm,
  Steps,
  Input,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import api from "../../../config/api";
import "./index.css";
import {
  AlignRightOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
  CopyOutlined,
  EyeTwoTone,
  FieldTimeOutlined,
  FileDoneOutlined,
  FileOutlined,
  FormOutlined,
  ForwardOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  LikeOutlined,
  MailTwoTone,
  SendOutlined,
  SmallDashOutlined,
  TruckFilled,
  TruckOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

function HistoryOrder() {
  const [formUpdate] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [idRequest, setIdRequest] = useState("");
  const [datasource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const account = useSelector((store: RootState) => store.accountmanage);
  const [agency, setAgency] = useState([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeButton, setActiveButton] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // Lấy thông tin các agency
  const fetchAgency = async () => {
    const response = await api.get("Agency");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((agency) => ({
      value: agency.id,
      label: <span>{agency.name}</span>,
    }));

    setAgency(list);
  };

  useEffect(() => {
    fetchAgency();
  }, []);

  // Lấy tất cả đơn hàng của khách hàng
  async function fetchMyOrders() {
    setLoading(true);
    const response = await api.get(`Order/GetByCustomerId?id=${account.Id}`);
    console.log(response.data.data);
    setDataSource(response.data.data);
    setFilteredData(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    if (account.Id) {
      fetchMyOrders();
    }
  }, [account.Id]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setActiveButton(status);
  };

  const description = "This is a description.";

  useEffect(() => {
    if (statusFilter === "") {
      setFilteredData(datasource);
    } else {
      const filtered =
        datasource?.filter((order) => order.status === statusFilter) || []; // Kiểm tra datasource không null
      setFilteredData(filtered);
    }
  }, [statusFilter, datasource]);

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

  const handleSubmitFeedback = async () => {
    if (!feedbackValue.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    const payload = {
      message: feedbackValue,
      accountId: account.Id,
      orderId: selectedOrderId,
    };

    try {
      const response = await api.post("Feedback", payload);
      console.log("Feedback response:", response.data);

      toast.success("Gửi đánh giá thành công.");
      setIsFeedbackOpen(false);
      setFeedbackValue("");
      fetchMyOrders();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchDocumentType();
  }, []);

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
    // {
    //   title: "Tên khách hàng",
    //   dataIndex: "fullName",
    //   key: "fullName",
    // },
    // {
    //   title: "Số điện thoại",
    //   dataIndex: "phoneNumber",
    //   key: "phoneNumber",
    // },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "address",
    //   key: "address",
    // },
    {
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => dayjs(deadline).format("DD/MM/YYYY HH:mm"),
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
      title: "Yêu cầu nhận tài liệu",
      dataIndex: "pickUpRequest",
      key: "pickUpRequest",
      render: (pickUpRequest) =>
        pickUpRequest ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Yêu cầu giao hàng",
      dataIndex: "shipRequest",
      key: "shipRequest",
      render: (shipRequest) =>
        shipRequest ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Chi nhánh",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => {
        if (!agency || agency.length === 0) return "Loading...";
        const foundAgency = agency.find((agen) => agen.value === agencyId);
        return foundAgency ? foundAgency.label : "Không";
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
          case "Implementing":
            return (
              <div className="status-implementing">
                <FormOutlined />
                &nbsp; Đang thực hiện
              </div>
            );
          case "Completed":
            return (
              <div className="status-completed">
                <LikeOutlined />
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
          case "Canceled":
            return (
              <div className="status-canceled">
                <CloseOutlined />
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
        <div>
          <EyeTwoTone
            style={{ fontSize: "18px" }}
            onClick={() => {
              setIsOpen(true);
              setIdRequest(id);
              const newData = { ...data };
              console.log(newData);

              const selectedOrder = datasource.find(
                (request) => request.id === id
              );
              if (selectedOrder) {
                // Chuyển đổi dữ liệu cho phù hợp với cấu trúc form yêu cầu
                const newData = {
                  ...selectedOrder,
                  deadline: dayjs(selectedOrder.deadline),
                  documents: selectedOrder.documents || [],
                };

                console.log("Dữ liệu được thiết lập:", newData);

                // Thiết lập giá trị cho form
                formUpdate.setFieldsValue(newData);
              }
            }}
          />
          {data.status === "Delivered" && !data.doneFeedback && (
            <MailTwoTone
              style={{ marginLeft: "10px", fontSize: "18px" }}
              onClick={() => {
                setSelectedOrderId(id);
                setIsFeedbackOpen(true);
              }}
            />
          )}
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

  return (
    <div className="historyorderpage">
      <h1>ĐƠN HÀNG CỦA BẠN</h1>
      <div>
        <Button
          className={`filter-button ${activeButton === "" ? "active" : ""}`}
          onClick={() => handleStatusFilter("")}
        >
          <AlignRightOutlined />
          Tất cả
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Processing" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Processing")}
        >
          <ClockCircleOutlined />
          Chờ xử lý
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Implementing" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Implementing")}
        >
          <FormOutlined />
          Đang thực hiện
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Completed" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Completed")}
        >
          <LikeOutlined />
          Đã hoàn thành
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Delivering" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Delivering")}
        >
          <TruckOutlined />
          Đang giao
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Delivered" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Delivered")}
        >
          <CheckOutlined />
          Đã giao
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Canceled" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Canceled")}
        >
          <CloseOutlined />
          Đã hủy
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={1200}
      >
        <Form form={formUpdate}>
          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <div key={key}>
                    <Divider
                      orientation="left"
                      style={{ borderColor: "black" }}
                    >
                      Tài liệu {index + 1}
                    </Divider>
                    <div className="document-content">
                      <span>
                        <label>Ngôn ngữ gốc: </label>
                        {(() => {
                          const firstLanguageId = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "firstLanguageId",
                          ]);
                          if (!language || language.length === 0) {
                            return "Loading...";
                          }
                          const foundLanguage = language.find(
                            (lang) => lang.value === firstLanguageId
                          );
                          return foundLanguage ? foundLanguage.label : null;
                        })()}
                      </span>
                      <span>
                        <label>Ngôn ngữ cần dịch: </label>
                        {(() => {
                          const secondLanguageId = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "secondLanguageId",
                          ]);
                          if (!language || language.length === 0) {
                            return "Loading...";
                          }
                          const foundLanguage = language.find(
                            (lang) => lang.value === secondLanguageId
                          );
                          return foundLanguage ? foundLanguage.label : null;
                        })()}
                      </span>
                      <span>
                        <label>Số trang: </label>
                        {formUpdate.getFieldValue([
                          "documents",
                          name,
                          "pageNumber",
                        ])}
                      </span>
                      <span>
                        <label>Số bản cần dịch: </label>
                        {formUpdate.getFieldValue([
                          "documents",
                          name,
                          "numberOfCopies",
                        ])}
                      </span>
                      <span>
                        <label>Loại tài liệu: </label>
                        {(() => {
                          const documentTypeId = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "documentTypeId",
                          ]);
                          if (!documentType || documentType.length === 0) {
                            return "Loading...";
                          }
                          const found = documentType.find(
                            (lang) => lang.value === documentTypeId
                          );
                          return found ? found.label : null;
                        })()}
                      </span>
                      <span>
                        <label>Tài liệu gốc: </label>
                        {(() => {
                          const urlPath = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "urlPath",
                          ]);
                          return urlPath ? (
                            <a
                              href={urlPath}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <CopyOutlined style={{ fontSize: "16px" }} />
                            </a>
                          ) : null;
                        })()}
                      </span>
                      {(() => {
                        const translatedUrlPath = formUpdate.getFieldValue([
                          "documents",
                          name,
                          "translatedUrlPath",
                        ]);

                        return translatedUrlPath ? (
                          <>
                            <span>
                              <ForwardOutlined />
                            </span>
                            <span>
                              <label>Tài liệu đã dịch: </label>
                              <a
                                href={translatedUrlPath}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CopyOutlined
                                  style={{ fontSize: "16px", color: "orange" }}
                                />
                              </a>
                            </span>
                          </>
                        ) : null;
                      })()}
                    </div>
                    <div className="document-content">
                      <span>
                        <label>Yêu cầu công chứng: </label>
                        {(() => {
                          const notarizationRequest = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "notarizationRequest",
                          ]);
                          return notarizationRequest ? (
                            <CheckCircleFilled style={{ color: "green" }} />
                          ) : (
                            <CloseCircleFilled style={{ color: "red" }} />
                          );
                        })()}
                      </span>
                      <span>
                        <label>Loại công chứng: </label>
                        {(() => {
                          const notarizationId = formUpdate.getFieldValue([
                            "documents",
                            name,
                            "notarizationId",
                          ]);
                          if (
                            !notarizationType ||
                            notarizationType.length === 0
                          ) {
                            return "Loading...";
                          }
                          const found = notarizationType.find(
                            (lang) => lang.value === notarizationId
                          );
                          return found ? found.label : "Không có";
                        })()}
                      </span>
                      <span>
                        <label>Số bản công chứng: </label>
                        {formUpdate.getFieldValue([
                          "documents",
                          name,
                          "numberOfNotarizedCopies",
                        ])}
                      </span>
                    </div>
                    {/* Hiển thị listTranslationStatus */}
                    <div style={{ width: "70%" }}>
                      {" "}
                      <Divider
                        orientation="left"
                        variant="dashed"
                        style={{
                          borderColor: "gray",
                          fontSize: "14px",
                          color: "#0394fc",
                        }}
                      >
                        <InfoCircleFilled /> Trạng thái dịch thuật
                      </Divider>
                    </div>
                    <div>
                      {formUpdate
                        .getFieldValue([
                          "documents",
                          name,
                          "listTranslationStatus",
                        ])
                        ?.map((statusItem, index, array) => (
                          <div
                            key={index}
                            style={{
                              display: "inline-block",
                              marginRight: "16px",
                              marginBottom: "8px",
                              fontSize: "12px",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              {statusItem.status}
                            </span>
                            <span style={{ marginLeft: "8px", color: "gray" }}>
                              {dayjs(statusItem.time).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </span>

                            {index < array.length - 1 && " |"}
                          </div>
                        )) || "Không có trạng thái"}
                    </div>

                    {/* Hiển thị listNotarizationStatus */}
                    {formUpdate.getFieldValue([
                      "documents",
                      name,
                      "notarizationRequest",
                    ]) && (
                      <div style={{ width: "70%" }}>
                        <Divider
                          orientation="left"
                          variant="dashed"
                          style={{
                            borderColor: "gray",
                            fontSize: "14px",
                            color: "#0394fc",
                          }}
                        >
                          <InfoCircleFilled /> Trạng thái công chứng
                        </Divider>
                        <div>
                          {formUpdate
                            .getFieldValue([
                              "documents",
                              name,
                              "listNotarizationStatus",
                            ])
                            ?.map((statusItem, index, array) => (
                              <div
                                key={index}
                                style={{
                                  display: "inline-block",
                                  marginRight: "16px",
                                  marginBottom: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                <span style={{ fontWeight: "bold" }}>
                                  {statusItem.status}
                                </span>
                                <span
                                  style={{ marginLeft: "8px", color: "gray" }}
                                >
                                  {dayjs(statusItem.time).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </span>
                                {index < array.length - 1 && " |"}
                              </div>
                            )) || "Không có trạng thái"}
                        </div>
                      </div>
                    )}
                    <div className="document-price">
                      <span>
                        <label>Giá dịch thuật: </label>
                        {formUpdate
                          .getFieldValue([
                            "documents",
                            name,
                            "documentPrice",
                            "translationPrice",
                          ])
                          ?.toLocaleString("vi-VN") || "N/A"}{" "}
                        VNĐ
                      </span>
                      <span>
                        <label>Giá công chứng: </label>
                        {formUpdate
                          .getFieldValue([
                            "documents",
                            name,
                            "documentPrice",
                            "notarizationPrice",
                          ])
                          ?.toLocaleString("vi-VN") || "N/A"}{" "}
                        VNĐ
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <Divider orientation="left" style={{ borderColor: "black" }}>
            Giá
          </Divider>
          {formUpdate.getFieldValue("pickUpRequest") ? (
            <div className="request-price">
              <label>
                <strong>Phí nhận tài liệu tại nhà:</strong> 40.000 VNĐ
              </label>
            </div>
          ) : null}
          {formUpdate.getFieldValue("shipRequest") ? (
            <div className="request-price">
              <label>
                <strong>Phí giao hàng:</strong> 40.000 VNĐ
              </label>
            </div>
          ) : null}
          <div className="request-price-total">
            <label style={{ fontSize: "18px" }}>
              <strong>TỔNG GIÁ: </strong>
              <span style={{ color: "green" }}>
                {formUpdate
                  .getFieldValue("totalPrice")
                  ?.toLocaleString("vi-VN") || "N/A"}{" "}
                VNĐ
              </span>
            </label>
          </div>
        </Form>
      </Modal>
      <Modal
        open={isFeedbackOpen}
        title="ĐÁNH GIÁ ĐƠN HÀNG"
        onCancel={() => {
          setIsFeedbackOpen(false);
          setFeedbackValue("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsFeedbackOpen(false);
              setFeedbackValue("");
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => handleSubmitFeedback()}
          >
            Gửi
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Nội dung:" required>
            <Input.TextArea
              rows={4}
              placeholder="Nhập đánh giá của bạn"
              value={feedbackValue}
              onChange={(e) => setFeedbackValue(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HistoryOrder;
