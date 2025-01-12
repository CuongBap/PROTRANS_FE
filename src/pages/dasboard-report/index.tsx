import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { FaSackDollar } from "react-icons/fa6";
import "./index.css";
import { TruckOutlined } from "@ant-design/icons";
import { DatePicker, Form, Select, Spin } from "antd";
import api from "../../config/api";
import { useEffect, useState } from "react";
import moment from "moment";

const { RangePicker } = DatePicker;

// Định nghĩa RADIAN
const RADIAN = Math.PI / 180;

function Report() {
  const [data, setData] = useState({
    numberOfRequests: 0,
    numberOfOrders: 0,
    numberOfAccounts: 0,
    revenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [chartAgencyData, setChartAgencyData] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [agency, setAgency] = useState(null);

  const fetchagency = async () => {
    const response = await api.get(`Agency`);
    const data = response.data.data;
    console.log({ data });

    const list = data.map((agency) => ({
      value: agency.id,
      label: <span>{agency.name}</span>,
    }));

    setAgency(list);
  };

  useEffect(() => {
    fetchagency();
  }, []);

  const handleDateChange = async (value, dateString) => {
    setLoading(true);
    if (value && dateString.length === 2) {
      const [fromTime, toTime] = value.map(
        (date) => date.toISOString() // Format ngày trước khi truyền vào API
      );

      try {
        const response = await api.get(`Dashboard`, {
          params: {
            fromTime,
            toTime,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure token is valid
          },
        });

        console.log("API Response:", response.data.data);
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        // Log detailed error for debugging
        if (error.response) {
          console.error("API Error Response:", error.response.data);
          console.error("API Status Code:", error.response.status);
        } else {
          console.error("Unexpected Error:", error.message);
        }
        setLoading(false);
      }
    }
  };

  const handleYearChange = async (date, dateString) => {
    if (dateString) {
      setLoading(true);
      try {
        const response = await api.get(`/Dashboard/MonthlyRevenueByYear`, {
          params: {
            year: dateString,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const formattedData = response.data.data.map((item) => ({
          month: `Tháng ${item.month}`,
          revenue: item.revenue || 0, // Đảm bảo giá trị là số
        }));
        console.log("chart", response.data.data);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleYearAgencyChange = async (date, dateString) => {
    if (dateString && agency) {
      setLoading(true);
      try {
        const response = await api.get(
          `Dashboard/MonthlyRevenueByYearByAgencyId`,
          {
            params: {
              yearAgency: dateString,
              agencyId: agency,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formattedData = response.data.data.map((item) => ({
          month: `Tháng ${item.month}`,
          revenue: item.revenue || 0, // Đảm bảo giá trị là số
        }));
        console.log("chart", response.data.data);
        setChartAgencyData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <main className="main-container-report">
        <div className="main-title-report">
          <h3>Thống kê</h3>
        </div>
        <Form>
          <Form.Item>
            <RangePicker
              // showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              disabledDate={(current) => {
                const today = moment().endOf("day");
                return (
                  // Không cho phép chọn ngày tương lai
                  current && current > today
                );
              }}
              onChange={handleDateChange}
            />
          </Form.Item>
        </Form>
        <div className="main-cards-report">
          <div className="card-report">
            <div className="card-inner-report">
              <BsFillArchiveFill className="card_icon-report" />
              <h3>Số lượng yêu cầu</h3>
              <h1>{data.numberOfRequests ?? 0}</h1>
            </div>
          </div>
          <div className="card-report">
            <div className="card-inner-report">
              <BsFillGrid3X3GapFill className="card_icon-report" />
              <h3>Số lượng đơn hàng</h3>
              <h1>{data.numberOfOrders ?? 0}</h1>
            </div>
          </div>
          <div className="card-report">
            <div className="card-inner-report">
              <BsPeopleFill className="card_icon-report" />
              <h3>Số lượng người dùng</h3>
              <h1>{data.numberOfAccounts ?? 0}</h1>
            </div>
          </div>
          <div className="card-report">
            <div className="card-inner-report">
              <TruckOutlined className="card_icon-report" />
              <h3>Tổng doanh thu</h3>
              <h1>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data.revenue ?? 0)}
              </h1>
            </div>
          </div>
        </div>
        <div className="charts">
          <div className="chart-title-report">
            <h3>Biểu đồ doanh thu theo tháng</h3>
          </div>
          <Form>
            <Form.Item>
              <DatePicker
                picker="year"
                onChange={handleYearChange}
                disabledDate={(current) => {
                  return current && current > moment().endOf("year");
                }}
                placeholder="Chọn năm"
              />
            </Form.Item>
          </Form>
          <div className="charts-report w-full">
            <div className="revenueAll">
              <ResponsiveContainer
                width="100%"
                height={400}
                className="mx-auto"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 50, // Increased margin for rotated labels
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                    tick={{ fontSize: 12, dx: -10 }} // Giảm kích thước chữ và đẩy nhãn sang trái
                    label={{
                      angle: -90,
                      position: "insideLeft",
                      dx: -20,
                    }}
                  />
                  <Tooltip
                    formatter={(value) => {
                      const numericValue =
                        typeof value === "number" ? value : Number(value);
                      return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(numericValue);
                    }}
                  />
                  {/* <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              /> */}
                  {/* <Legend /> */}
                  <Legend align="center" verticalAlign="bottom" />
                  <Bar
                    dataKey="revenue"
                    fill="#8884d8"
                    name="Doanh thu theo tháng"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="revenueagency">
            <div
              className="chart-title-report"
              style={{ marginBottom: "20px" }}
            >
              <h3>Biểu đồ doanh thu theo tháng của agency</h3>
            </div>
            <div className="revenueagency_infor">
              <Form>
                <div
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <Form.Item>
                    <Form.Item>
                      <Select
                        placeholder="Chọn chi nhánh"
                        options={agency}
                        onChange={(value) => setAgency(value)}
                      />
                    </Form.Item>
                    <DatePicker
                      picker="year"
                      onChange={handleYearAgencyChange}
                      disabledDate={(current) => {
                        return current && current > moment().endOf("year");
                      }}
                      placeholder="Chọn năm"
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <ResponsiveContainer width="100%" height={400} className="mx-auto">
              <BarChart
                data={chartAgencyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 50, // Increased margin for rotated labels
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                  tick={{ fontSize: 12, dx: -10 }} // Giảm kích thước chữ và đẩy nhãn sang trái
                  label={{
                    angle: -90,
                    position: "insideLeft",
                    dx: -20,
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value);
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(numericValue);
                  }}
                />
                {/* <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              /> */}
                {/* <Legend /> */}
                <Legend align="center" verticalAlign="bottom" />
                <Bar
                  dataKey="revenue"
                  fill="#ff6d00"
                  name="Doanh thu theo tháng của agency"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </Spin>
  );
}

export default Report;
