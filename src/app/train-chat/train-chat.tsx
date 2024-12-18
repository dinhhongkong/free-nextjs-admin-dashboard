"use client";
import { useNotification } from "@/context/NotificationContext";
import { useChatIntent } from "@/hooks/ChatIntentHook";
import { BusinessDocument } from "@/model/BusinessDocument";
import { ChatIntent } from "@/model/ChatIntent";
import { ProChat } from "@ant-design/pro-chat";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Typography,
} from "antd";
import { use, useState } from "react";

type OnChange = NonNullable<TableProps<ChatIntent>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Option } = Select;

export default function TrainChat() {
  const [form] = Form.useForm();
  const { setNotification } = useNotification();

  const [isUser, setIsUser] = useState<boolean>(true);
  const [openForm, setOpenForm] = useState(false);
  const [deleteChatIntentId, setDeleteChatIntentId] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const { chatIntents, fetchChatIntents, createChatIntent, deleteChatIntent, updateChatIntent } = useChatIntent();

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const columns: TableColumnsType<ChatIntent> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      sorter: (a: ChatIntent, b: ChatIntent) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a: ChatIntent, b: ChatIntent) =>
        a.title.length - b.title.length,
      sortOrder:
        sortedInfo.columnKey === "officeName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      filteredValue: filteredInfo.address || null,
      sorter: (a: ChatIntent, b: ChatIntent) =>
        a.content.length - b.content.length,
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
    setDeleteChatIntentId(id);
  };

  const onClickAdd = () => {
    setOpenForm(true);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const onCreateChatIntent = async (values: any) => {
    try {
      await createChatIntent(values);
      setOpenForm(false);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };


  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm chat intent</Button>
        <Button onClick={fetchChatIntents}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={chatIntents} onChange={handleChange} />

      <Modal
        open={openForm}
        title={"Manage chat intent"}
        onCancel={() => setOpenForm(false)}
        footer={[<></>]}
        style={{ marginRight: 150, minWidth: 900 }}
      >
        <div>
          <Typography.Title level={5}>Tiêu đề ngữ cảnh gợi nhớ:</Typography.Title>
          <Input/>
        </div>


        <div className="mt-5">
          <Typography.Title level={5}>Loại system prompt:</Typography.Title>
          <Select style={{ width: 400 }}>
            <Select.Option value="PROMPT_CUSTOMER_TEMPLATE">PROMPT_CUSTOMER_TEMPLATE</Select.Option>
            <Select.Option value="PROMPT_RETRIEVAL">PROMPT_RETRIEVAL</Select.Option>
          </Select>
        </div>

        
        {/* <Form
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
        </Form> */}

        <ProChat
          locale="en-US"
          style={{ height: "60vh" }}
          helloMessage={
            "Xin chào quý khách, đây là trợ lý ảo của nhà xe Phương Trang, không biết quý khách có thắc mắc gì với dịch vụ ạ"
          }
          // chats={chats}
          onChatsChange={(chats) => {
            console.log(chats);
          }}
          request={async (messages) => {
            return new Response("Chatbot trả lời");
          }}
        />

        {isUser && (
          <div>
            <Space.Compact style={{ width: "100%" }} className="my-2">
              <h1>Tin nhắn user: </h1>
              <Input />
              <Button className={"my-2 to-blue-600"}>Submit</Button>
            </Space.Compact>
          </div>
        )}

        {!isUser && (
          <div>
            <Space.Compact style={{ width: "100%" }} className="my-2">
              <h1>Tin nhắn assistant: </h1>
              <Input />
              <Button className={"my-2 to-blue-600"}>Submit</Button>
            </Space.Compact>
            <Button className="mt-4 flex items-center justify-center bg-orange-300">
              Lưu đoạn chat
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={confirmDelete}
        title="Xác nhận xóa"
        onOk={() => deleteChatIntent(deleteChatIntentId)}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={() => deleteChatIntent(deleteChatIntentId)}
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
