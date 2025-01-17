import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
import { useForm } from "antd/es/form/Form";
import {
  CheckOutlined,
  CloseOutlined,
  ContainerOutlined,
  LoadingOutlined,
  LockOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UnlockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./index.css";
import dayjs from "dayjs";
import uploadFileFire from "../../../utils/upload";

function TranslatorAccount() {
  //======================
  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
  };
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [agency, setAgency] = useState([]);
  const [language, setLanguage] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenskill, setIsOpenSkill] = useState(false);
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [allTranslator, setAllTranslator] = useState([]);
  const [currentTranslatorSkills, setCurrentTranslatorSkills] = useState([]);

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

  const fetchlanguage = async () => {
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
    fetchlanguage();
  }, []);

  const fetchRole = async () => {
    const response = await api.get("Role");
    const data = response.data.data;
    console.log({ data });

    const list = data.map((role) => ({
      value: role.id,
      label: <span>{role.name}</span>,
    }));

    setRole(list);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await api.put(`Account/Toggle?id=${id}`);
      toast.success(
        `Tài khoản đã được ${!currentStatus ? "khóa" : "kích hoạt"} thành công.`
      );

      // Cập nhật lại danh sách sau khi trạng thái được thay đổi
      fetchTranslatorAccount();
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
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
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chi nhánh",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => {
        // Check if category is available and initialized
        if (!agency || agency.length === 0) return "Loading...";

        // Find the category by ID and return its name
        const foundagency = agency.find((agen) => agen.value === agencyId);
        return foundagency ? foundagency.label : "Unknown Category";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) =>
        isDeleted ? (
          <div className="status-inactive">Ngưng hoạt động</div>
        ) : (
          <div className="status-active">Đang hoạt động</div>
        ),
    },
    {
      title: "Tác vụ",
      dataIndex: "id",
      key: "id",
      render: (id, data) => (
        <Space>
          <button
            style={{
              color: "white",
              backgroundColor: "orange",
              padding: 5,
              width: 100,
              borderRadius: 8,
              borderWidth: 0,
              fontSize: 12,
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              setCurrentTranslatorSkills(data.translatorSkills || []);
              setIsOpenSkill(true);
            }}
          >
            <ContainerOutlined />
            &nbsp; Chứng chỉ
          </button>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${
              !data.isDeleted
                ? "khóa tài khoản này?"
                : "kích hoạt lại tài khoản này?"
            }`}
            onConfirm={() => handleToggleStatus(id, data.isDeleted)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <button
              style={{
                color: "white",
                backgroundColor: data.isDeleted ? "#23d783" : "#e03955",
                padding: 5,
                width: 80,
                borderRadius: 8,
                borderWidth: 0,
                fontSize: 12,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {data.isDeleted ? (
                <div>
                  <UnlockOutlined />
                  &nbsp; Mở
                </div>
              ) : (
                <div>
                  <LockOutlined />
                  &nbsp; Khóa
                </div>
              )}
            </button>
          </Popconfirm>
        </Space>
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
  const handleSearch = (value) => {
    const filtered = allTranslator.filter((translator) =>
      translator.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  async function handleSubmit(values) {
    setModalLoading(true);
    console.log(values);

    for (let i = 0; i < values.skills.length; i++) {
      const skills = values.skills[i];
      if (skills?.certificateUrl.file?.originFileObj) {
        const originFileObj = skills.certificateUrl.file?.originFileObj;
        const upFile = await uploadFileFire(originFileObj);
        values.skills[i].certificateUrl = upFile;
      }
    }

    try {
      const response = await api.post("Account/Translator", values);

      console.log(response.data.data);
      fetchTranslatorAccount();
      formVariable.resetFields();
      toast.success("Tạo thành công tài khoản cho dịch thuật viên.");
      setModalLoading(false);
    } catch (error) {
      toast.error("Tạo thất bại. " + error.response.data.message);
      setModalLoading(false);
    }
  }

  async function fetchTranslatorAccount() {
    setLoading(true);
    try {
      const response = await api.get("Account/GetAllTranslator");
      setDataSource(response.data.data);
      setAllTranslator(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTranslatorAccount();
    fetchRole();
  }, []);

  return (
    <div className="translator">
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Button
          className="button-add"
          type="primary"
          onClick={() => {
            formVariable.setFieldsValue({
              skills: [{}],
            });
            setIsOpen(true);
          }}
        >
          <PlusOutlined />
          Tạo tài khoản mới
        </Button>
        <Input.Search
          placeholder="Tìm kiếm theo tên"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 10, width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
        onChange={handleTableChange}
      ></Table>
      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          formVariable.resetFields();
        }}
        cancelText="Hủy"
        okText="Tạo tài khoản mới"
        onOk={() => {
          formVariable.submit();
        }}
        okButtonProps={{
          loading: modalLoading,
        }}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={formVariable}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên người dùng"
            name={"userName"}
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
            label="Họ và tên"
            name={"fullName"}
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
            label="Email"
            name={"email"}
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
            label="Số điện thoại"
            name={"phoneNumber"}
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
            label="Địa chỉ"
            name={"address"}
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
            label="Mật khẩu"
            name={"password"}
            rules={[
              {
                required: true,
                message: "* vui lòng nhập",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name={"dob"}
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
                  current > dayjs().subtract(16, "years").endOf("day")
                );
              }}
              defaultPickerValue={dayjs().subtract(16, "years")}
            />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="Male">Nam</Radio>
              <Radio value="Female">Nữ</Radio>
              <Radio value="Other">Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Chi nhánh"
            name={"agencyId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Select options={agency} placeholder="Chọn chi nhánh" />
          </Form.Item>

          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "block", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Divider
                      orientation="left"
                      style={{ borderColor: "black" }}
                    >
                      Ngôn ngữ
                    </Divider>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "languageId"]}
                          fieldKey={[fieldKey, "languageId"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Ngôn ngữ"
                        >
                          <Select
                            options={language}
                            placeholder="Chọn ngôn ngữ"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "certificateUrl"]}
                          fieldKey={[fieldKey, "certificateUrl"]}
                          rules={[
                            {
                              required: true,
                              message: "* vui lòng chọn",
                            },
                          ]}
                          label="Chứng chỉ"
                        >
                          {/* <Input /> */}
                          <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                          </Upload>
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
                    Thêm ngôn ngữ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        open={isOpenskill}
        onCancel={() => {
          setIsOpenSkill(false);
        }}
        title="CHỨNG CHỈ DỊCH THUẬT VIÊN"
        footer={[
          <button
            key="cancel"
            onClick={() => setIsOpenSkill(false)}
            style={{
              padding: "5px 15px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Đóng
          </button>,
        ]}
      >
        {currentTranslatorSkills.length > 0 ? (
          currentTranslatorSkills.map((skill, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <p>
                <b>Ngôn ngữ:</b> {skill.languageName}
              </p>
              <p>
                <b>Chứng chỉ:</b>{" "}
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={skill.certificateUrl}
                    alt={`Certificate of ${skill.languageName}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </p>
              <Divider />
            </div>
          ))
        ) : (
          <p>Không có chứng chỉ được lưu.</p>
        )}
      </Modal>

      {/* <Modal
        open={isOpenskill}
        onCancel={() => {
          setIsOpenSkill(false);
        }}
        title="Ngoại ngữ của dịch thuật viên"
        footer={[
          <button
            key="cancel"
            onClick={() => setIsOpenSkill(false)}
            style={{
              padding: "5px 15px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>,
        ]}
      >
        <Form form={formVariableskill} onFinish={handleSubmit}>
          <Form.Item
            label="Ngoại ngữ"
            name={"shipperId"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Bằng cấp"
            name={"deadline"}
            rules={[
              {
                required: true,
                message: "* vui lòng chọn",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
}

export default TranslatorAccount;
