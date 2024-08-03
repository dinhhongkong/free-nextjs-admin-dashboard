"use client";
import React, { useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Space, Table } from "antd";

type OnChange = NonNullable<TableProps<EmployeeApi>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface EmployeeApi {
  id: number;
  name: string;
  cccd: string;
  phoneNumber: string;
  gender: string;
  address: string;
  email: string;
  role: string;
}

const data: EmployeeApi[] = [
  {
    id: 1,
    name: "Gia Khánh",
    cccd: "063873432",
    phoneNumber: "0123743483",
    gender: "Nữ",
    address: "HCM",
    email: "khanh213@gmail.com",
    role: "ADMIN",
  },
  {
    id: 1,
    name: "Trần Tuấn Anh",
    cccd: "07626736272",
    phoneNumber: "06718232232",
    gender: "Nam",
    address: "HCM",
    email: "anhtran343@gmail.com",
    role: "ADMIN",
  },
];

const Employee: React.FC = () => {
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
      title: "Role",
      dataIndex: "role",
      key: "role",
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
        <Button onClick={setAgeSort}>Thêm nhân viên</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Employee;
