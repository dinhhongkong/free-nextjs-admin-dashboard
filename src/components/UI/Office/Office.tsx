"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { useNotification } from "@/context/NotificationContext";
import apiClient from "@/api/apiClient";

type OnChange = NonNullable<TableProps<Office>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Option } = Select;

interface Office {
  id: number;
  officeName: string;
  address: string;
  provinceId: number;
  provinceName: string;
}

interface Province {
  id: number;
  provinceName: string;
}

const Office: React.FC = () => {
  const [form] = Form.useForm();
  const { setNotification } = useNotification();
  const [officeList, setOfficeList] = useState<Office[]>();
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [updateFeature, setUpdateFeature] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);
  const [deleteOfficeId, setDeleteOfficeId] = useState<number>();
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

  const columns: TableColumnsType<Office> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Tên văn phòng",
      dataIndex: "officeName",
      key: "officeName",
      sorter: (a, b) => a.officeName.length - b.officeName.length,
      sortOrder:
        sortedInfo.columnKey === "officeName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      filteredValue: filteredInfo.address || null,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Địa phận",
      dataIndex: "provinceName",
      key: "provinceName",
      filteredValue: filteredInfo.address || null,
      sorter: (a, b) => a.provinceName.length - b.provinceName.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
      width: "160px",
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

  useEffect(() => {
    loadOffice();
    loadProvince();
  }, []);

  const loadProvince = async () => {
    try {
      const data: Province[] = await apiClient.get("/booking/provinces");
      setProvinceList(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách tỉnh thành",
        type: "error",
      });
    }
  };

  const renderProvince = () => {
    return (
      <>
        {provinceList.map((item: Province) => (
          <Option key={item.id} value={item.id} label={item.provinceName}>
            {item.provinceName}
          </Option>
        ))}
      </>
    );
  };

  const loadOffice = async () => {
    try {
      const data: Office[] = await apiClient.get("/manage/offices");
      setOfficeList(data);
      setNotification({
        show: true,
        message: "Load thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách văn phòng",
        type: "error",
      });
    }
  };

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteOfficeId(id);
  };

  const onFinish = (values: any) => {
    console.log(values);
    const createBus = async (body: any) => {
      console.log(body);
      try {
        const data = await apiClient.post("/manage/office", body);
        setNotification({
          show: true,
          message: "Lưu thành công",
          type: "success",
        });
        setOpenForm(false);
        await loadOffice();
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
        const data = await apiClient.put("/manage/office/" + body.id, body);
        setNotification({
          show: true,
          message: "Lưu thành công",
          type: "success",
        });
        setOpenForm(false);
        await loadOffice();
      } catch (error) {
        setNotification({
          show: true,
          message: "Lỗi khi lưu",
          type: "error",
        });
      }
    };
    if (updateFeature) {
      updateBus(values);
    } else {
      createBus(values);
    }
  };

  const deleteBus = async () => {
    try {
      const data = await apiClient.delete("/manage/office/" + deleteOfficeId);
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadOffice();
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
        <Button onClick={onClickAdd}>Thêm văn phòng</Button>
        <Button onClick={loadOffice}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={officeList}
        onChange={handleChange}
      />

      <Modal
        open={openForm}
        title={
          updateFeature
            ? "Cập nhật thông tin trạm xe/văn phòng"
            : "Thêm trạm xe/văn phòng"
        }
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
            name="officeName"
            label="Tên văn phòng/trạm xe"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ:"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinceId"
            label="Tỉnh thành"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Vui lòng chọn tỉnh"
              allowClear
            >
              {renderProvince()}
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

export default Office;
