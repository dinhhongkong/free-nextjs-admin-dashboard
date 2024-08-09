"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { useNotification } from "@/context/NotificationContext";
import apiClient from "@/api/apiClient";
import Password from "antd/es/input/Password";
const { Option } = Select;
type OnChange = NonNullable<TableProps<EmployeeApi>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface EmployeeApi {
  id: number;
  fullName: string;
  cccd: string;
  phoneNumber: string;
  gender: string;
  address: string;
  email: string;
  user: {
    id: number;
    username: string;
    roleId: number;
    roleName: string;
    enable: boolean;
  };
}

interface Account {
  employeeId: number;
  username: string;
  password: string;
  roleId: number;
  enable: boolean;
}

const Employee: React.FC = () => {
  const [form] = Form.useForm();
  const [formAccount] = Form.useForm();
  const { setNotification } = useNotification();
  const [employeeList, setEmployeeList] = useState<EmployeeApi[]>();
  const [updateFeature, setUpdateFeature] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);
  const [openFormAccount, setOpenFormAccount] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<number>();
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

  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };

  const columns: TableColumnsType<EmployeeApi> = [
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
      title: "Địa chỉ",
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
      title: "Role",
      dataIndex: "user",
      key: "role",
      render: (value) => <div>{value ? value.roleName : " "}</div>,
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <div>
          <Button onClick={() => onClickUpdate(value)}>Sửa</Button>
          <Button onClick={() => onClickDelete(value.id)}>Xóa</Button>
          <Button onClick={() => onClickAccountBtn(value)}>Tài khoản</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadEmployeeList();
  }, []);

  const loadEmployeeList = async () => {
    try {
      const data: EmployeeApi[] = await apiClient.get("/manage/employees");
      setEmployeeList(data);
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
    setDeleteEmployeeId(id);
  };
  const createEmployee = async (body: any) => {
    console.log(body);
    try {
      const data = await apiClient.post("/manage/employee", body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadEmployeeList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const updateEmployee = async (body: any) => {
    try {
      const data = await apiClient.put("/manage/employee/" + body.id, body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadEmployeeList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const saveAccount = async (body: Account) => {
    try {
      const data = await apiClient.post("/auth/admin/account", body);
      setOpenFormAccount(false);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      // await loadEmployeeList();
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
      updateEmployee(values);
    } else {
      createEmployee(values);
    }
  };

  const onFinishFormAccount = (values: any) => {
    console.log(values);
    saveAccount(values);
  };

  const deleteDriver = async () => {
    try {
      const data = await apiClient.delete(
        "/manage/employee/" + deleteEmployeeId,
      );
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadEmployeeList();
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
  const onClickAccountBtn = (values: EmployeeApi) => {
    console.log(values);
    const accountData: Account = {
      employeeId: values.id,
      username: values.email,
      password: values.cccd,
      roleId: values.user?.roleId ?? 0,
      enable: values.user?.enable ?? false,
    };
    console.log(accountData);
    formAccount.setFieldsValue(accountData);
    setOpenFormAccount(true);
  };

  const onClickAdd = () => {
    form.setFieldsValue({});
    setOpenForm(true);
    setUpdateFeature(false);
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm nhân viên</Button>
        <Button onClick={loadEmployeeList}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={employeeList}
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

      <Modal
        open={openFormAccount}
        title="Tài khoản"
        onCancel={() => setOpenFormAccount(false)}
        footer={[]}
      >
        <Form
          form={formAccount}
          name="create-account"
          onFinish={onFinishFormAccount}
        >
          <Form.Item name="employeeId" label="Id" rules={[{ required: true }]}>
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu mặc định:"
            rules={[{ required: true }]}
          >
            <Password />
          </Form.Item>

          <Form.Item
            name="enable"
            label="Trạng thái kích hoạt:"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Trạng thái"
              allowClear
            >
              <Option value={true}>Kích hoạt</Option>
              <Option value={false}>Đóng tài khoản</Option>
            </Select>
          </Form.Item>

          <Form.Item name="roleId" label="Quyền:" rules={[{ required: false }]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Role"
              allowClear
            >
              <Option value={2}>ADMIN</Option>
              <Option value={3}>MANAGER</Option>
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
    </>
  );
};

export default Employee;
