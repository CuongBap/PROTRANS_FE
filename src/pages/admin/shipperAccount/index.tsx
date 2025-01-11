import { Input, Popconfirm, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

function ShipperAcccount() {
  const [dataSource, setDataSource] = useState([]);
  const [role, setRole] = useState([]);
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allShipper, setAllShipper] = useState([]);

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
      fetchShipperAccount();
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
      dataIndex: "fullName", // Use secondLanguageId from QuotePrice data
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
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "address",
    //   key: "address",
    // },
    // {
    //   title: "Ngày sinh",
    //   dataIndex: "dob",
    //   key: "dob",
    // },
    // {
    //   title: "Giới tính",
    //   dataIndex: "gender",
    //   key: "gender",
    // },
    // {
    //   title: "Vai trò",
    //   dataIndex: "roleId",
    //   key: "roleId",
    //   render: (roleId) => {
    //     // Check if category is available and initialized
    //     if (!role || role.length === 0) return null;

    //     // Find the category by ID and return its name
    //     const foundrole = role.find((rol) => rol.value === roleId);
    //     return foundrole ? foundrole.label : null;
    //   },
    // },
    {
      title: "Chi nhánh",
      dataIndex: "agencyId",
      key: "agencyId",
      render: (agencyId) => {
        // Check if category is available and initialized
        if (!agency || agency.length === 0) return null;

        // Find the category by ID and return its name
        const foundagency = agency.find((agen) => agen.value === agencyId);
        return foundagency ? foundagency.label : null;
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
    const filtered = allShipper.filter((translator) =>
      translator.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  async function fetchShipperAccount() {
    setLoading(true);
    try {
      const response = await api.get("Account/GetAllShipper");
      setDataSource(response.data.data);
      setAllShipper(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShipperAccount();
    fetchAgency();
    fetchRole();
  }, []);
  return (
    <div className="manageshipper">
      <div className="searchstaff">
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
    </div>
  );
}

export default ShipperAcccount;
