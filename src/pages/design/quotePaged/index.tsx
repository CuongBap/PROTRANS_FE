import { useEffect, useState } from "react";
import api from "../../../config/api";
import { Col, Input, Row, Spin, Table } from "antd";
import "./index.css";
import { SearchOutlined } from "@ant-design/icons";

function QuotePageDesign() {
  const [dataSource, setDataSource] = useState([]);
  const [language, setLanguage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFirstLanguage, setSearchFirstLanguage] = useState("");
  const [searchSecondLanguage, setSearchSecondLanguage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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

  async function fetchQuotePrice() {
    setLoading(true);
    const response = await api.get("QuotePrice/Existing");
    const data = response.data.data;
    const sortedData = data.sort((a, b) => {
      const langA = language.find((lang) => lang.value === a.firstLanguageId);
      const langB = language.find((lang) => lang.value === b.firstLanguageId);

      const nameA = langA ? langA.label.props.children : "";
      const nameB = langB ? langB.label.props.children : "";

      if (nameA === "Việt Nam") return -1;
      if (nameB === "Việt Nam") return 1;

      return 0;
    });
    console.log(response.data.data);
    setDataSource(sortedData);
    setFilteredData(sortedData);
    setLoading(false);
  }

  useEffect(() => {
    if (language.length > 0) {
      fetchQuotePrice();
    }
  }, [language]);

  useEffect(() => {
    handleSearch();
  }, [searchFirstLanguage, searchSecondLanguage]);

  const handleSearch = () => {
    const filtered = dataSource.filter((item) => {
      const firstLang = language.find(
        (lang) => lang.value === item.firstLanguageId
      );
      const secondLang = language.find(
        (lang) => lang.value === item.secondLanguageId
      );

      const firstLangName = firstLang ? firstLang.label.props.children : "";
      const secondLangName = secondLang ? secondLang.label.props.children : "";

      return (
        firstLangName
          .toLowerCase()
          .includes(searchFirstLanguage.toLowerCase()) &&
        secondLangName
          .toLowerCase()
          .includes(searchSecondLanguage.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Ngôn ngữ gốc",
      dataIndex: "firstLanguageId",
      key: "firstLanguageId",
      render: (firstLanguageId) => {
        if (!language || language.length === 0) return "Loading...";

        const foundLanguage = language.find(
          (lang) => lang.value === firstLanguageId
        );
        return foundLanguage ? foundLanguage.label : "Unknown Category";
      },
    },
    {
      title: "Ngôn ngữ dịch",
      dataIndex: "secondLanguageId",
      key: "secondLanguageId",
      render: (secondLanguageId) => {
        if (!language || language.length === 0) return "Loading...";

        const foundLanguage = language.find(
          (lang) => lang.value === secondLanguageId
        );
        return foundLanguage ? foundLanguage.label : "Unknown Category";
      },
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "pricePerPage",
      key: "pricePerPage",
      render: (text) => {
        return text !== null ? text.toLocaleString("vi-VN") : text;
      },
    },
  ];

  return (
    <div className="quote-page">
      <h1>BẢNG GIÁ DỊCH THUẬT CÔNG CHỨNG</h1>
      <p>
        Bạn đang băn khoăn về chi phí và quy trình dịch thuật công chứng cho
        khối lượng tài liệu lớn? <strong>ProTrans</strong> hiểu rằng để tìm kiếm
        một dịch vụ công chứng dịch thuật vừa <em>đảm bảo chất lượng</em>,{" "}
        <em>vừa tiết kiệm chi phí</em> là điều không hề dễ dàng. Một quyết định
        đúng đắn bắt đầu từ việc tìm hiểu kỹ lưỡng, hãy cùng chúng tôi khám phá
        dịch vụ công chứng dịch thuật qua bài sau.
      </p>
      <h2>
        Dịch thuật công chứng khác với dịch thuật thông thường ở điểm nào?
      </h2>
      <p>
        <strong>Dịch thuật công chứng</strong> là quá trình chuyển đổi ngôn ngữ,
        trong đó bản dịch được kiểm duyệt kỹ lưỡng về mặt ngữ pháp, từ vựng và
        nội dung để đảm bảo tính chính xác cao nhất. Sau khi hoàn thành, bản
        dịch sẽ được công chứng viên chứng thực, tạo ra một bản sao có giá trị
        pháp lý tương đương với bản gốc.
      </p>
      <img
        className="images"
        src="/bank-images/translator.jpg"
        alt="Translator"
      />
      <figcaption className="figure">
        Dịch thuật công chứng chỉ được thực hiện bởi những dịch giả có chứng
        chỉ.
      </figcaption>
      <h2>Mức giá dịch thuật công chứng hiện nay như thế nào?</h2>
      <p>
        <strong>Giá dịch thuật công chứng</strong> thay đổi tùy thuộc vào từng
        trường hợp cụ thể. Chi phí được xác định dựa trên nhiều yếu tố khác
        nhau, bao gồm{" "}
        <em>ngôn ngữ, tính chuyên môn của văn bản và số lượng trang</em>. Ngoài
        ra phí dịch thuật và phí công chứng sẽ được tính riêng.
      </p>
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col span={6}>
          <Input
            placeholder="Tìm kiếm Ngôn ngữ gốc"
            value={searchFirstLanguage}
            onChange={(e) => setSearchFirstLanguage(e.target.value)}
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Tìm kiếm Ngôn ngữ dịch"
            value={searchSecondLanguage}
            onChange={(e) => setSearchSecondLanguage(e.target.value)}
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        className="custom-table"
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
      ></Table>
      <h2>
        Tại sao ProTrans là lựa chọn hàng đầu cho dịch thuật công chứng ở TP. Hồ
        Chí Minh?
      </h2>
      <p>
        <strong>ProTrans</strong> là giải pháp toàn diện cho mọi nhu cầu dịch
        thuật công chứng:
      </p>
      <div className="why-choose">
        <ul>
          <li>Cam kết hoàn tiền 100% nếu bản dịch có sai sót hơn 10%.</li>
          <li>
            Tiết kiệm đến 40% thời gian và chi phí so với các đơn vị khác trên
            thị trường.
          </li>
          <li>
            Nội dung dịch đảm bảo chính xác, tuân thủ đầy đủ các quy định chuẩn
            mực.
          </li>
          <li>
            Giá trị pháp lý được đảm bảo tuyệt đối, có thể sử dụng trên toàn
            cầu.
          </li>
          <li>
            Mọi phản hồi về chất lượng bản dịch sẽ được giải quyết trong vòng
            tối đa 3 ngày.
          </li>
          <li>
            Tổng đài hỗ trợ 24/7, sẵn sàng giải đáp mọi thắc mắc cho quý khách
            hàng một cách nhanh chóng.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default QuotePageDesign;
