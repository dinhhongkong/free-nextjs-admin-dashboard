"use client";
import React, { useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Space, Table } from "antd";

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  key: string;
  time: string;
  age: string;
  status: string;
  journey: string;
}

const data: DataType[] = [
  {
    key: "1",
    time: "9h30",
    age: "8h",
    status: "Hoạt động",
    journey: "Hồ Chí Minh - Đắk Lắk",
  },
  {
    key: "2",
    time: "20h30",
    age: "10h",
    status: "Hoạt động",
    journey: "Đắk Lắk - Hồ Chí Minh",
  },
];

const Journey: React.FC = () => {
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "id",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Thời gian chạy",
      dataIndex: "age",
      key: "address",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chuyến",
      dataIndex: "journey",
      key: "journey",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "address",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chức năng",
      ellipsis: true,
      render: () => (
        <div>
          <Button>Sửa</Button>
          <Button className={"mx-2"}>Xóa</Button>
          <Button>Xem chuyến đi</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Thêm hành trình</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Journey;
