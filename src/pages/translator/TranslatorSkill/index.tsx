import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/rootReducer";

function ManageTranslatorSkill() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const UserAccount2 = useSelector(
    (store: RootState) => store.accountmanage.Id
  );
  const columns = [
    {
      title: "Ngôn ngữ",
      dataIndex: "languageId",
      key: "languageId",
    },
    {
      title: "Bằng cấp",
      dataIndex: "certificateUrl",
      key: "certificateUrl",
    },
  ];

  async function fetchTranslatorSkill() {
    setLoading(true);
    try {
      const response = await api.get(`TranslatorSkill/${UserAccount2}`);
      setDataSource(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Danh sách trống.");
      setLoading(false);
    }
  }
  useEffect(() => {
    if (UserAccount2) {
      fetchTranslatorSkill();
    }
  }, [UserAccount2]);

  return (
    <div className="translatorskill">
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={{
          spinning: loading,
          indicator: <Spin />,
        }}
      ></Table>
    </div>
  );
}

export default ManageTranslatorSkill;
