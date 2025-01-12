"use client";
import { useNotification } from "@/context/NotificationContext";
import { useBusinessDocumentHook } from "@/hooks/BusinessDocumentHook";
import { BusinessDocument } from "@/model/BusinessDocument";
import { Button, Form, Input, Modal, Select, Space, Table, TableColumnsType, TableProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { use, useState } from "react";

type OnChange = NonNullable<TableProps<BusinessDocument>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Option } = Select;

export default function Document() {
  const [form] = Form.useForm();
  const { setNotification } = useNotification();

  const [openForm, setOpenForm] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const  { documents, setDocuments,fetchDocuments, deleteDocument, createDocument } = useBusinessDocumentHook();


  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const columns: TableColumnsType<BusinessDocument> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      sorter: (a : BusinessDocument, b : BusinessDocument) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a : BusinessDocument, b : BusinessDocument) => a.title.length - b.title.length,
      sortOrder:
        sortedInfo.columnKey === "officeName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      filteredValue: filteredInfo.address || null,
      sorter: (a : BusinessDocument, b : BusinessDocument) => a.content.length - b.content.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chức năng",
      ellipsis: true,
      render: (value) => (
        <div>
          <Button onClick={() => onClickDelete(value.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteDocumentId(id);
  };

  const onClickAdd = () => {
    form.setFieldsValue({});
    setOpenForm(true);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const onCreateDocument = async (values: any) => {
    try {
      await createDocument(values);
      setOpenForm(false);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      form.setFieldsValue({"title": "", "content":""});
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const onFinish = (values: any) => {
    onCreateDocument(values);
  };


  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm document</Button>
        <Button onClick={fetchDocuments}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={documents}
        onChange={handleChange}
      />

      <Modal
        open={openForm}
        title={"Thêm document"}
        onCancel={() => setOpenForm(false)}
        footer={[<></>]}
        style={{marginRight: 150 , minWidth: 900 }}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{  minWidth: 700 }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề gợi nhớ cho tài liệu:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung tài liệu:"
            rules={[{ required: true }]}
          >
            <TextArea autoSize={{ minRows: 7, maxRows: 17 }} />
          </Form.Item>


          <Form.Item>
            <Space>
              <Button
                className={"bg-blue-500"}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={confirmDelete}
        title="Xác nhận xóa"
        onOk={()=> deleteDocument(deleteDocumentId)}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={()=>  {
              deleteDocument(deleteDocumentId)
              setConfirmDelete(false)
              setNotification({
                show: true,
                message: "đang tải lại ds",
                type: "success",
              });
              } 
            }
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn xóa</p>
      </Modal>
    </>
  );
}