"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import apiClient from "@/api/apiClient";
import { useNotification } from "@/context/NotificationContext";

type OnChange = NonNullable<TableProps<Bus>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface Bus {
  id: number;
  licensePlates: string;
  status: number;
  typeId: string;
  typeName: string;
}

const statusBus: any = {
  0: "Dừng hoạt động",
  1: "Đang hoạt động",
  2: "Đang bảo dưỡng",
};

const Bus: React.FC = () => {
  const [form] = Form.useForm();
  const { setNotification } = useNotification();
  const [busList, setBusList] = useState<Bus[]>();
  const [update, setUpdate] = useState<boolean>(false);
  const [deleteBusId, setDeleteBusId] = useState<number>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  useEffect(() => {
    loadBus();
  }, []);

  const columns: TableColumnsType<Bus> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Biển số",
      dataIndex: "licensePlates",
      key: "licensePlates",
      sorter: (a, b) => a.licensePlates.length - b.licensePlates.length,
      sortOrder:
        sortedInfo.columnKey === "licensePlates" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Loại xe",
      dataIndex: "typeName",
      key: "typeName",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.typeName.includes(value as string),
      sorter: (a, b) => a.typeName.length - b.typeName.length,
      sortOrder: sortedInfo.columnKey === "typeName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filteredValue: filteredInfo.address || null,
      render: (status) => statusBus[status],
      sorter: (a, b) => a.status - b.status,
      sortOrder: sortedInfo.columnKey === "status" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chức năng",
      ellipsis: true,
      render: (value) => (
        <div>
          <Button onClick={() => onClickUpdate(value)}>Sửa</Button>
          <Button onClick={() => onClickDelete(value.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteBusId(id);
  };

  const onFinish = (values: any) => {
    console.log(values);
    const createBus = async (body: any) => {
      try {
        const data = await apiClient.post("/manage/bus", body);
        setNotification({
          show: true,
          message: "Lưu thành công",
          type: "success",
        });
        setOpen(false);
        await loadBus();
      } catch (error) {
        setNotification({
          show: true,
          message: "Lỗi khi lưu",
          type: "error",
        });
      }
    };

    const updateBus = async (body: any) => {
      try {
        const data = await apiClient.put("/manage/bus/" + body.id, body);
        setNotification({
          show: true,
          message: "Lưu thành công",
          type: "success",
        });
        setOpen(false);
        await loadBus();
      } catch (error) {
        setNotification({
          show: true,
          message: "Lỗi khi lưu",
          type: "error",
        });
      }
    };
    if (update) {
      updateBus(values);
    } else {
      createBus(values);
    }
  };

  const deleteBus = async () => {
    try {
      const data = await apiClient.delete("/manage/bus/" + deleteBusId);
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadBus();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi xóa vì khóa ngoại",
        type: "error",
      });
    }
    setConfirmDelete(false);
  };

  const onClickUpdate = (values: any) => {
    form.setFieldsValue(values);
    setOpen(true);
    setUpdate(true);
  };

  const onClickAdd = () => {
    form.setFieldsValue({});
    setOpen(true);
    setUpdate(false);
  };

  const loadBus = async () => {
    try {
      const data: Bus[] = await apiClient.get("/manage/buses");
      setBusList(data);
      setNotification({
        show: true,
        message: "Load thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách xe",
        type: "error",
      });
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm xe khách</Button>
        <Button onClick={loadBus}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={busList} onChange={handleChange} />

      <Modal
        open={open}
        title={update ? "Cập nhật thông tin xe khách" : "Thêm xe khách"}
        onCancel={handleCancel}
        footer={[<></>]}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          {update && (
            <Form.Item name="id" label="Id" rules={[{ required: true }]}>
              <Input disabled={true} />
            </Form.Item>
          )}
          <Form.Item
            name="licensePlates"
            label="Biển số"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="typeId" label="Loại xe" rules={[{ required: true }]}>
            <Select placeholder="Vui lòng chọn loại xe" allowClear>
              <Select value={1}>Giường nằm</Select>
              <Select value={2}>Limousine</Select>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select placeholder="Vui lòng chọn loại xe" allowClear>
              <Select value={0}>Dừng hoạt động</Select>
              <Select value={1}>Đang hoạt động</Select>
              <Select value={2}>Đang bảo dưỡng</Select>
            </Select>
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
        onOk={deleteBus}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={deleteBus}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn xóa</p>
      </Modal>
    </>
  );
};

export default Bus;
