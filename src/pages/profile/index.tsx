import { Button, Card, Descriptions, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import "./index.css";
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";

function Profile() {
  const [accountData, setAccountData] = useState(null);
  const [translatorSkills, setTranslatorSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const account = useSelector((store: RootState) => store.accountmanage);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeCertificateUrl, setActiveCertificateUrl] = useState<
    string | null
  >(null);

  const showCertificate = (url: string) => {
    setActiveCertificateUrl(url);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setActiveCertificateUrl(null);
  };

  async function fetchAccount() {
    setLoading(true);
    try {
      const response = await api.get(`Account/${account.Id}`);
      console.log(response.data.data);
      setAccountData(response.data.data);
    } catch (error) {
      console.error("Error fetching account:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLanguages() {
    try {
      const response = await api.get(`Language`);
      const data = response.data.data;
      const list = data.map((language) => ({
        id: language.id,
        name: language.name,
      }));
      setLanguages(list);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  }

  const getLanguageName = (languageId) => {
    const language = languages.find((lang) => lang.id === languageId);
    return language ? language.name : "Unknown";
  };

  async function fetchTranslatorSkills() {
    try {
      const response = await api.get(`TranslatorSkill/${account.Id}`);
      console.log(response.data.data);
      setTranslatorSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching translator skills:", error);
    }
  }

  useEffect(() => {
    if (account.Id) {
      fetchAccount();
      fetchTranslatorSkills();
      fetchLanguages();
    }
  }, [account.Id]);

  return (
    <div className="profile-page">
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          <h1 className="profile-title">THÔNG TIN TÀI KHOẢN</h1>

          <div className="profile-container">
            {/* Card bên trái */}
            <Card
              bordered={true}
              style={{
                width: "25%",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <UserOutlined className="profile-avatar" />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                {accountData?.fullName || "N/A"}
              </span>
              <br />
              <span
                style={{
                  fontSize: "12px",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                {accountData?.code || "N/A"}
              </span>
            </Card>

            {/* Card bên phải */}
            <Card
              title="Chi tiết"
              bordered={true}
              style={{
                width: "45%",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Tên người dùng">
                  {accountData?.userName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                  {accountData?.fullName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã người dùng">
                  {accountData?.code || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {accountData?.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {accountData?.phoneNumber || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {accountData?.address || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {dayjs(accountData?.dob).format("DD/MM/YYYY") || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {accountData?.gender === "Male"
                    ? "Nam"
                    : accountData?.gender === "Female"
                    ? "Nữ"
                    : "Khác"}
                </Descriptions.Item>
                <Descriptions.Item label="Chi nhánh">
                  {accountData?.agencyName || "Không có"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Card chứng chỉ */}
            {accountData?.roleName === "Translator" && (
              <Card
                title="Chứng chỉ dịch thuật"
                bordered={true}
                style={{
                  width: "40%",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <ul>
                  {translatorSkills.length > 0 ? (
                    translatorSkills.map((skill: any) => (
                      <li key={skill.id} style={{ marginLeft: "20px" }}>
                        {skill.certificateUrl ? (
                          <a
                            onClick={() =>
                              showCertificate(skill.certificateUrl)
                            }
                          >
                            {getLanguageName(skill.languageId)}
                          </a>
                        ) : (
                          "Không hợp lệ"
                        )}
                      </li>
                    ))
                  ) : (
                    <p>Không có chứng chỉ nào.</p>
                  )}
                </ul>

                {/* Modal hiển thị chứng chỉ */}
                <Modal
                  title="Chứng chỉ dịch thuật:"
                  visible={isModalVisible}
                  onCancel={handleModalClose}
                  footer={null}
                  width={800}
                  centered
                >
                  {activeCertificateUrl ? (
                    <embed
                      src={activeCertificateUrl}
                      style={{
                        width: "100%",
                        height: "600px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <p>Không có nội dung.</p>
                  )}
                </Modal>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
