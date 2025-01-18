import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  AlignRightOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  CloseOutlined,
  CloseSquareFilled,
  CopyOutlined,
  FormOutlined,
  HourglassOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./index.css";
import FormItem from "antd/es/form/FormItem";

function RequestManager() {
  const [formUpdate] = useForm();
  const [datasource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [idRequest, setIdRequest] = useState("");
  const [language, setLanguage] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState<string>("Waitting");
  const [activeButton, setActiveButton] = useState<string>("Waitting");
  const [loading, setLoading] = useState(false);
  const [selectcustomerid, setselectcustomerid] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

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

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setActiveButton(status);
  };

  useEffect(() => {
    if (statusFilter === "") {
      setFilteredData(datasource);
    } else {
      const filtered =
        datasource?.filter((order) => order.status === statusFilter) || []; // Kiểm tra datasource không null
      setFilteredData(filtered);
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [statusFilter, datasource]);

  // const props: UploadProps = {
  //   name: "file",
  //   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       toast.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       toast.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

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
    {
      title: "CustomerId",
      dataIndex: "customerId",
      key: "customerId",
      hidden: true,
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Thời hạn",
    //   dataIndex: "deadline",
    //   key: "deadline",
    //   render: (deadline) => {
    //     return dayjs(deadline).format("DD/MM/YYYY");
    //   },
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) =>
        dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix(),
      render: (deadline) => {
        return dayjs(deadline).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Giá ước tính (VNĐ)",
      dataIndex: "estimatedPrice",
      key: "estimatedPrice",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
      },
    },
    // {
    //   title: "Trạng thái xóa",
    //   dataIndex: "isDeleted",
    //   key: "isDeleted",
    //   render: (isDeleted) => (isDeleted ? "Có" : "Không"),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "Waitting":
            return (
              <div className="status-waiting">
                <ClockCircleOutlined />
                &nbsp; Chờ xử lý
              </div>
            );
          case "Quoted":
            return (
              <div className="status-quoted">
                <FormOutlined />
                &nbsp; Đã gửi giá
              </div>
            );
          case "Refuse":
            return (
              <div className="status-refused">
                <CloseOutlined />
                &nbsp; Bị từ chối
              </div>
            );
          case "Accept":
            return (
              <div className="status-accepted">
                <CheckOutlined />
                &nbsp; Được chấp nhận
              </div>
            );
          case "Finish":
            return (
              <div className="status-finished">
                <PauseOutlined />
                &nbsp; Kết thúc
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
      render: (id, data) => {
        if (data.status === "Waitting") {
          return (
            <Space>
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
              >
                <FormOutlined
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                  onClick={() => {
                    setselectcustomerid(data.customerId);
                    setIsOpen(true);
                    setIdRequest(id);
                    const newData = { ...data };
                    console.log(newData);

                    // Lấy dữ liệu request dựa trên id
                    const selectedRequest = datasource.find(
                      (request) => request.id === id
                    );
                    if (selectedRequest) {
                      // Chuyển đổi dữ liệu cho phù hợp với cấu trúc form yêu cầu
                      const newData = {
                        ...selectedRequest,
                        deadline: dayjs(selectedRequest.deadline),
                        documents: selectedRequest.documents || [],
                        status: "Quoted",
                      };

                      console.log("Dữ liệu được thiết lập:", newData);

                      // Thiết lập giá trị cho form
                      formUpdate.setFieldsValue(newData);
                    }
                  }}
                />
              </button>
            </Space>
          );
        } else return null;
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

  // async function handleEditRequest(value) {
  //   const updateRequest = formUpdate.getFieldsValue();
  //   console.log("day laf:", updateRequest);

  //   try {
  //     // Gửi yêu cầu PUT với requestId và payload updateRequest
  //     const response = await api.put(
  //       `Request/StaffUpdate?requestId=${idRequest}`,
  //       value
  //     );

  //     console.log("Response:", response);
  //   } catch (error) {
  //     console.error("Error updating request:", error);
  //   }
  // }

  async function handleEditRequest() {
    const updateRequest = formUpdate.getFieldsValue();

    // Chuyển đổi các giá trị boolean của Switch cho pickUpRequest và shipRequest
    // updateRequest.pickUpRequest = updateRequest.pickUpRequest ? true : false;
    // updateRequest.shipRequest = updateRequest.shipRequest ? true : false;

    try {
      // Gửi yêu cầu PUT với requestId và payload updateRequest
      const response = await api.put(
        `Request/StaffUpdate?requestId=${idRequest}`,
        updateRequest
      );
      console.log("log param,", updateRequest);
      console.log("gia uoc tinh: ", response.data.data.estimatedPrice);
      console.log("Ngày: ", response.data.data.deadline);
      console.log(selectcustomerid);
      console.log(response.data.data);

      //Gọi hàm đẩy noti
      if (response) {
        const currentDateTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo sử dụng múi giờ Việt Nam
        });

        const paramPushNoti = {
          specId: selectcustomerid,
          title: "Báo giá dịch thuật",
          message: `Yêu cầu của bạn có giá ${response.data.data.estimatedPrice}. Ngày thông báo: ${currentDateTime}`,
          author: "string",
        };

        const resPushNoti = api.post(`Notification/Single`, paramPushNoti);
        console.log("resPushNoti", resPushNoti);
      }
      fetchRequest();
      formUpdate.resetFields();
      toast.success("Gửi thông tin giá thành công.");
      setIsOpen(false);
    } catch (error) {
      toast.error("Gửi thông tin giá thất bại.");
    }
  }

  async function fetchRequest() {
    setLoading(true);
    const response = await api.get("Request/ToQuote");
    console.log(response.data.data);
    setDataSource(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className="requestmanager">
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
            activeButton === "Waitting" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Waitting")}
        >
          <ClockCircleOutlined />
          Chờ xử lý
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Quoted" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Quoted")}
        >
          <FormOutlined />
          Đã gửi giá
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Refuse" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Refuse")}
        >
          <CloseOutlined />
          Bị từ chối
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Accept" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Accept")}
        >
          <CheckOutlined />
          Được chấp nhận
        </Button>
        <Button
          className={`filter-button ${
            activeButton === "Finish" ? "active" : ""
          }`}
          onClick={() => handleStatusFilter("Finish")}
        >
          <PauseOutlined />
          Kết thúc
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
          formUpdate.resetFields();
        }}
        width={1200}
        onOk={() => {
          formUpdate.submit();
        }}
        okText="Gửi giá"
        cancelText="Đóng"
      >
        <Form form={formUpdate} onFinish={handleEditRequest}>
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
            <DatePicker />
          </Form.Item>
          <div className="request-content">
            <span>
              Yêu cầu nhận tài liệu:&nbsp;
              {formUpdate.getFieldValue("pickUpRequest") ? (
                <CheckCircleFilled style={{ color: "green" }} />
              ) : (
                <CloseCircleFilled style={{ color: "red" }} />
              )}
            </span>
            <span>
              Yêu cầu giao hàng:&nbsp;
              {formUpdate.getFieldValue("shipRequest") ? (
                <CheckCircleFilled style={{ color: "green" }} />
              ) : (
                <CloseCircleFilled style={{ color: "red" }} />
              )}
            </span>
          </div>
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
                      <Form.Item
                        {...restField}
                        name={[name, "firstLanguageId"]}
                        fieldKey={[fieldKey, "firstLanguageId"]}
                        label="Ngôn ngữ gốc"
                      >
                        <span>
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
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "secondLanguageId"]}
                        fieldKey={[fieldKey, "secondLanguageId"]}
                        label="Ngôn ngữ cần dịch"
                      >
                        <span>
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
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "pageNumber"]}
                        fieldKey={[fieldKey, "pageNumber"]}
                        label="Số trang"
                      >
                        <InputNumber min={1} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "numberOfCopies"]}
                        fieldKey={[fieldKey, "numberOfCopies"]}
                        label="Số bản cần dịch"
                      >
                        <span>
                          {formUpdate.getFieldValue([
                            "documents",
                            name,
                            "numberOfCopies",
                          ])}
                        </span>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "documentTypeId"]}
                        fieldKey={[fieldKey, "documentTypeId"]}
                        rules={[
                          {
                            required: false,
                            message: "* vui lòng chọn",
                          },
                        ]}
                        label="Loại tài liệu"
                      >
                        <Select
                          options={documentType}
                          placeholder="Loại tài liệu"
                          style={{ width: "100px" }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "urlPath"]}
                        fieldKey={[fieldKey, "urlPath"]}
                        label="Tệp đính kèm"
                      >
                        <span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openModal();
                            }}
                          >
                            <CopyOutlined />
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
                              src={getIframeSrc(
                                formUpdate.getFieldValue([
                                  "documents",
                                  name,
                                  "urlPath",
                                ])
                              )}
                              style={{
                                width: "100%",
                                height: "80vh",
                                border: "none",
                              }}
                              title="Xem tài liệu"
                            ></iframe>
                          </Modal>
                        </span>
                      </Form.Item>
                    </div>
                    <div className="document-content">
                      <Form.Item
                        {...restField}
                        name={[name, "notarizationRequest"]}
                        fieldKey={[fieldKey, "notarizationRequest"]}
                        label="Yêu cầu công chứng"
                      >
                        <span>
                          {(() => {
                            const notarizationRequest =
                              formUpdate.getFieldValue([
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
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "notarizationId"]}
                        fieldKey={[fieldKey, "notarizationId"]}
                        rules={[
                          {
                            required: false,
                            message: "* vui lòng chọn",
                          },
                        ]}
                        label="Loại công chứng"
                      >
                        <Select
                          options={notarizationType}
                          placeholder="Loại công chứng"
                          style={{ width: "400px" }}
                          disabled={
                            !formUpdate.getFieldValue([
                              "documents",
                              name,
                              "notarizationRequest",
                            ])
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "numberOfNotarizedCopies"]}
                        fieldKey={[fieldKey, "numberOfNotarizedCopies"]}
                        label="Số bản công chứng"
                      >
                        <span>
                          {formUpdate.getFieldValue([
                            "documents",
                            name,
                            "numberOfNotarizedCopies",
                          ])}
                        </span>
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <Form.Item
            label="Trạng thái"
            name={"status"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
            hidden
          >
            <Select placeholder="Trạng thái">
              <Select value="Quoted">Đã báo giá</Select>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RequestManager;
