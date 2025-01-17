import { Button, Col, DatePicker, Form, Input, Radio, Row } from "antd";
import Authenlayout from "../../components/auth-layout";
import "./index.css";
import { toast } from "react-toastify";
import api from "../../config/api";
import { Link, useNavigate } from "react-router-dom";
import { MAX_VERTICAL_CONTENT_RADIUS } from "antd/es/style/placementArrow";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await api.post("Authentication/Register", values);
      toast.info(
        "Đăng ký tài khoản thành công. Vui lòng xác thực email để hoàn tất quá trình."
      );
      setLoading(false);

      navigate("/login");
    } catch (error) {
      toast.error("Đăng ký không thành công.");
      setLoading(false);
    }
  };
  return (
    <Authenlayout>
      <div className="register__header">
        <img
          src="/bank-images/ProTranslogo.png"
          alt="Logo"
          className="register__logo"
        />
        <h3 className="register__h3">Đăng ký tài khoản</h3>
      </div>
      <Form
        name="userForm"
        onFinish={handleRegister}
        initialValues={{
          role: "ADMIN",
        }}
        layout="vertical"
      >
        <Row gutter={16}>
          {/* Tên người dùng */}
          <Col span={12}>
            <Form.Item
              label="Tên người dùng"
              name="userName"
              rules={[{ required: true, message: "* vui lòng nhập" }]}
            >
              <Input placeholder="Tên người dùng" />
            </Form.Item>
          </Col>
          {/* Họ và tên */}
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "* vui lòng nhập" }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Email */}
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "* vui lòng nhập" },
                {
                  type: "email",
                  message: "* vui lòng nhập đúng định dạng email",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          {/* Số điện thoại */}
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ required: true, message: "* vui lòng nhập" }]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Địa chỉ */}
          <Col span={24}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "* vui lòng nhập" }]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Ngày sinh */}
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: "* vui lòng chọn" }]}
            >
              <DatePicker
                placeholder="Chọn ngày"
                disabledDate={(current) =>
                  current && current.valueOf() > Date.now()
                }
              />
            </Form.Item>
          </Col>
          {/* Giới tính */}
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "* vui lòng chọn" }]}
            >
              <Radio.Group>
                <Radio value="Male">Nam</Radio>
                <Radio value="Female">Nữ</Radio>
                <Radio value="Others">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Mật khẩu */}
          <Col span={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "* vui lòng nhập" }]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
          </Col>
          {/* Nhập lại mật khẩu */}
          <Col span={12}>
            <Form.Item
              label="Nhập lại mật khẩu"
              name={"confirmPassword"}
              rules={[
                {
                  required: true,
                  message: "* vui lòng xác nhận lại mật khẩu",
                },
                {
                  min: 8,
                  message: "* phải có ít nhất 8 ký tự",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("* mật khẩu không trùng khớp")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "200px" }}
              >
                {loading ? <LoadingOutlined /> : "Đăng ký"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ textAlign: "center" }}>
        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </div>
    </Authenlayout>
  );
}

export default Register;
