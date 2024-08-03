"use client";
import React, { useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Space, Table } from "antd";

type OnChange = NonNullable<TableProps<DriverApi>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DriverApi {
  id: number;
  name: string;
  cccd: string;
  phoneNumber: string;
  gender: string;
  address: string;
  email: string;
  licence: string;
}

const data: DriverApi[] = [
  {
    id: 1,
    name: "Nguyễn Trang",
    cccd: "04354584951",
    phoneNumber: "0123743483",
    gender: "Nữ",
    address: "HCM",
    email: "trang@gmail.com",
    licence: "B1",
  },
  {
    id: 1,
    name: "Nguyễn Tuấn",
    cccd: "06634384332",
    phoneNumber: "092731873",
    gender: "Nam",
    address: "HCM",
    email: "tuanngguyen@gmail.com",
    licence: "B1",
  },
];

const Driver: React.FC = () => {
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

  const columns: TableColumnsType<DriverApi> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
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
      dataIndex: "licence",
      key: "licence",
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "x",
      render: () => (
        <div>
          <Button>Sửa</Button>
          <Button>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Thêm tài xế</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Driver;
