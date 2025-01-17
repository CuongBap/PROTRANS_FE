import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast } from "react-toastify";
import uploadFileFire from "../../../utils/upload";
import "./index.scss";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

function SendRequest() {
  const [formVariable] = useForm();
  const [language, setLanguage] = useState([]);
  const [notarizationType, setNotarizationType] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPickUpEnabled, setIsPickUpEnabled] = useState(false);

  dayjs.extend(isSameOrBefore);

  //--------------------------------
  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    // onChange(info) {
    //   if (info.file.status !== "uploading") {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (info.file.status === "done") {
    //     toast.success(`${info.file.name} file uploaded successfully`);
    //   } else if (info.file.status === "error") {
    //     toast.error(`${info.file.name} file upload failed.`);
    //   }
    // },
  };

  //-----------------------------------------------
  const fetchDocumentType = async () => {
    const response = await api.get("DocumentType/Existing");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((Document) => ({
      value: Document.id,
      label: <span>{Document.name}</span>,
    }));

    setDocumentType(list);
  };

  const checkPickUpRequestState = (documents) => {
    const hasNotarizationRequest = documents.some(
      (doc) => doc.notarizationRequest
    );
    setIsPickUpEnabled(hasNotarizationRequest);

    if (!hasNotarizationRequest) {
      formVariable.setFieldValue("pickUpRequest", false);
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    if (changedValues.documents) {
      checkPickUpRequestState(allValues.documents);
    }
  };

  useEffect(() => {
    fetchDocumentType();
  }, []);

  //----------------------------------------------
  const fetchNotarizationType = async () => {
    const response = await api.get("Notarization/Existing");
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

  //----------------------------------------------
  const fetchLanguages = async () => {
    const response = await api.get("Language/Existing");
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

  async function handleSubmit(values) {
    setLoading(true);
    console.log(values);

    // const originFileObj =
    //   values.documents[0]?.urlPath?.file?.originFileObj || null;

    // if (originFileObj) {
    //   const upFile = await uploadFileFire(originFileObj);
    //   values.documents[0].urlPath = upFile;
    // }

    for (let i = 0; i < values.documents.length; i++) {
      const document = values.documents[i];
      if (document?.urlPath?.file?.originFileObj) {
        const originFileObj = document.urlPath.file.originFileObj;
        const upFile = await uploadFileFire(originFileObj); // Upload each file individually
        values.documents[i].urlPath = upFile; // Ensure each document gets a unique URL
      }
    }

    try {
      const response = await api.post("Request", values);
      console.log(response.data.data);
      toast.success("Gửi yêu cầu thành công.");
      setLoading(false);
      formVariable.resetFields();
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại. " + error.response.data.message);
      setLoading(false);
    }
  }

  const handleNotarizationChange = (index, checked) => {
    const newDocuments = formVariable.getFieldValue("documents");
    newDocuments[index].notarizationRequest = checked;
    if (!checked) {
      newDocuments[index].numberOfNotarizedCopies = 0;
      newDocuments[index].notarizationId = null;
    }
    if (checked) {
      newDocuments[index].numberOfNotarizedCopies = 1;
    }
    formVariable.setFieldsValue({ documents: newDocuments });
    checkPickUpRequestState(newDocuments);
  };

  return (
    <div className="sendrequest">
      <h1>GỬI YÊU CẦU DỊCH THUẬT</h1>
      <div className="sendrequestmiddle">
        <Form
          form={formVariable}
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          layout="vertical"
          initialValues={{
            deadline: "",
            phoneNumber: "",
            address: "",
            documents: [
              {
                firstLanguageId: null,
                secondLanguageId: null,
                urlPath: null,
                fileType: "Soft",
                pageNumber: 1,
                numberOfCopies: 1,
                notarizationRequest: false,
                numberOfNotarizedCopies: 0,
                notarizationId: null,
                documentTypeId: null,
              },
            ],
          }}
        >
          <Row gutter={16}>
            {" "}
            <Col span={4}>
              {" "}
              <Form.Item
                label="Thời gian yêu cầu"
                name="deadline"
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
                    // return current && current.isSameOrBefore(dayjs(), "day");

                    return (
                      current && current.isBefore(dayjs().add(3, "day"), "day")
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Yêu cầu nhận tài liệu"
                name="pickUpRequest"
                valuePropName="checked"
                rules={[
                  {
                    required: false,
                    message: "* vui lòng chọn",
                  },
                ]}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={false}
                  disabled={!isPickUpEnabled}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Yêu cầu giao hàng"
                name="shipRequest"
                valuePropName="checked"
                rules={[{ required: false, message: "* vui lòng chọn" }]}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{ display: "block", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Divider
                      orientation="left"
                      style={{ borderColor: "black" }}
                    >
                      Tài liệu
                    </Divider>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "firstLanguageId"]}
                          fieldKey={[fieldKey, "firstLanguageId"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Ngôn ngữ gốc"
                        >
                          <Select
                            options={language}
                            placeholder="Ngôn ngữ gốc"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "secondLanguageId"]}
                          fieldKey={[fieldKey, "secondLanguageId"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Ngôn ngữ cần dịch"
                        >
                          <Select
                            options={language}
                            placeholder="Ngôn ngữ cần dịch"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, "documentTypeId"]}
                          fieldKey={[fieldKey, "documentTypeId"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Loại tài liệu"
                        >
                          <Select
                            options={documentType}
                            placeholder="Loại tài liệu"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, "pageNumber"]}
                          fieldKey={[fieldKey, "pageNumber"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Số trang"
                          initialValue={1}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Số trang"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "numberOfCopies"]}
                          fieldKey={[fieldKey, "numberOfCopies"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Số bản cần dịch"
                          initialValue={1}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Số bản cần dịch"
                            style={{ width: "75%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, "urlPath"]}
                          fieldKey={[fieldKey, "urlPath"]}
                          rules={[
                            { required: true, message: "* vui lòng chọn" },
                          ]}
                          label="Tệp"
                        >
                          {/* <Input placeholder="Đường dẫn" /> */}
                          <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, "notarizationRequest"]}
                          valuePropName="checked"
                          fieldKey={[fieldKey, "notarizationRequest"]}
                          label="Công chứng"
                          initialValue={false}
                        >
                          <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked={false}
                            onChange={(checked) =>
                              handleNotarizationChange(index, checked)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "numberOfNotarizedCopies"]}
                          fieldKey={[fieldKey, "numberOfNotarizedCopies"]}
                          rules={[
                            {
                              required: formVariable.getFieldValue([
                                "documents",
                                index,
                                "notarizationRequest",
                              ]),
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Số bản công chứng"
                          initialValue={0}
                        >
                          <InputNumber
                            min={1}
                            placeholder=""
                            style={{ width: "75%" }}
                            value={formVariable.getFieldValue([
                              "documents",
                              index,
                              "numberOfNotarizedCopies",
                            ])}
                            onChange={(value) => {
                              const newDocuments =
                                formVariable.getFieldValue("documents");
                              newDocuments[index].numberOfNotarizedCopies =
                                value;
                              formVariable.setFieldsValue({
                                documents: newDocuments,
                              });
                            }}
                            disabled={
                              !formVariable.getFieldValue([
                                "documents",
                                index,
                                "notarizationRequest",
                              ])
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "notarizationId"]}
                          fieldKey={[fieldKey, "notarizationId"]}
                          rules={[
                            {
                              required: formVariable.getFieldValue([
                                "documents",
                                index,
                                "notarizationRequest",
                              ]),
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Loại công chứng"
                        >
                          <Select
                            options={notarizationType}
                            placeholder="Loại công chứng"
                            disabled={
                              !formVariable.getFieldValue([
                                "documents",
                                index,
                                "notarizationRequest",
                              ])
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ fontSize: "24px", color: "red" }} // Tùy chỉnh kích thước và màu nếu muốn
                      />
                    </Form.Item>
                  </Space>
                ))}

                <Form.Item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ width: "160px" }}
                  >
                    Thêm tài liệu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "160px" }}>
              {loading ? <LoadingOutlined /> : "Gửi yêu cầu"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default SendRequest;
