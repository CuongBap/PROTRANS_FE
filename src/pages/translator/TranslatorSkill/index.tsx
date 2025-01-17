import { Image, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/rootReducer";

interface TranslatorSkill {
  languageId: string; // Adjust the type as needed
  certificateUrl: string; // Adjust the type as needed
  key: number; // Add this since you're adding it later
}

function ManageTranslatorSkill() {
  const [dataSource, setDataSource] = useState<TranslatorSkill[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState([]);
  const UserAccount2 = useSelector(
    (store: RootState) => store.accountmanage.Id
  );

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
  const columns = [
    {
      title: "Ngôn ngữ",
      dataIndex: "languageId",
      key: "languageId",
      render: (languageId) => {
        // Check if category is available and initialized
        if (!language || language.length === 0) return "Loading...";

        // Find the category by ID and return its name
        const foundLanguage = language.find(
          (lang) => lang.value === languageId
        );
        return foundLanguage ? foundLanguage.label : "Unknown Category";
      },
    },
    {
      title: "Chứng chỉ",
      dataIndex: "certificateUrl",
      key: "certificateUrl",
      render: (certificateUrl: string) => (
        <Image src={certificateUrl} width={300} />
      ),
    },
  ];

  async function fetchTranslatorSkill() {
    setLoading(true);
    try {
      const response = await api.get(`TranslatorSkill/${UserAccount2}`);
      console.log("bang cap", response.data.data);
      // setDataSource(response.data.data);
      const data: TranslatorSkill[] = Array.isArray(response.data.data)
        ? response.data.data.map((item, index) => ({
            ...item,
            key: index,
          }))
        : [
            {
              ...response.data.data,
              key: 0,
            },
          ];
      setDataSource(data);
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
