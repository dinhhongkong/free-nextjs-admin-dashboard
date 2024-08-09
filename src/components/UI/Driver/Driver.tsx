"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { useNotification } from "@/context/NotificationContext";
import Office from "@/components/UI/Office/Office";
import apiClient from "@/api/apiClient";
const { Option } = Select;
type OnChange = NonNullable<TableProps<DriverApi>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DriverApi {
  id: number;
  fullName: string;
  cccd: string;
  phoneNumber: string;
  gender: string;
  address: string;
  email: string;
  licence: string;
}

const Driver: React.FC = () => {
  const [form] = Form.useForm();
  const { setNotification } = useNotification();
  const [driverList, setDriverList] = useState<DriverApi[]>();
  const [updateFeature, setUpdateFeature] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState<number>();
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

  const columns: TableColumnsType<DriverApi> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "50px",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "name",

      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "CCCD/CMND",
      dataIndex: "cccd",
      key: "cccd",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "90px",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Loại bằng lái",
      dataIndex: "license",
      key: "license",
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <div>
          <Button onClick={() => onClickUpdate(value)}>Sửa</Button>
          <Button onClick={() => onClickDelete(value.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadDriverList();
  }, []);

  const loadDriverList = async () => {
    try {
      const data: DriverApi[] = await apiClient.get("/manage/drivers");
      setDriverList(data);
      setNotification({
        show: true,
        message: "Load thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách tài xế",
        type: "error",
      });
    }
  };

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteDriverId(id);
  };
  const createDriver = async (body: any) => {
    console.log(body);
    try {
      const data = await apiClient.post("/manage/driver", body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadDriverList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const updateDriver = async (body: any) => {
    try {
      const data = await apiClient.put("/manage/driver/" + body.id, body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadDriverList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
    if (updateFeature) {
      updateDriver(values);
    } else {
      createDriver(values);
    }
  };

  const deleteDriver = async () => {
    try {
      const data = await apiClient.delete("/manage/driver/" + deleteDriverId);
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadDriverList();
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
    setOpenForm(true);
    setUpdateFeature(true);
  };

  const onClickAdd = () => {
    form.setFieldsValue({});
    setOpenForm(true);
    setUpdateFeature(false);
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm tài xế</Button>
        <Button onClick={loadDriverList}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={driverList}
        onChange={handleChange}
      />
      <Modal
        open={openForm}
        title={updateFeature ? "Cập nhật thông tin tài xế" : "Thêm tài xế"}
        onCancel={() => setOpenForm(false)}
        footer={[<></>]}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          {updateFeature && (
            <Form.Item name="id" label="Id" rules={[{ required: true }]}>
              <Input disabled={true} />
            </Form.Item>
          )}
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="cccd" label="CCCD/CMND" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Giới tính"
              allowClear
            >
              <Option value={"Nam"}>Nam</Option>
              <Option value={"Nữ"}>Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email:" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="license"
            label="Loại bằng lái"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Loại bằng lái"
              allowClear
            >
              <Option value="Hạng B1 số tự động">Hạng B1 số tự động</Option>
              <Option value="hạng B1">hạng B1</Option>
              <Option value="hạng B2">hạng B2</Option>
              <Option value="hạng C">hạng C</Option>
              <Option value="hạng D">hạng D</Option>
              <Option value="hạng E">hạng E</Option>
              <Option value="hạng F">hạng F</Option>
              <Option value="hạng FB2">hạng FB2</Option>
              <Option value="hạng FC">hạng FC</Option>
              <Option value="hạng FE">hạng FE</Option>
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
        onOk={deleteDriver}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={deleteDriver}
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

export default Driver;
