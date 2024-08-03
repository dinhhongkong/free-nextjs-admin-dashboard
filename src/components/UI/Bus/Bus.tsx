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
  bienso: string;
  loaixe: string;
}

const data: DataType[] = [
  {
    key: "1",
    bienso: "37a-3434",
    loaixe: "Limousine",
  },
  {
    key: "2",
    bienso: "47a-23434",
    loaixe: "Giường nằm",
  },
];

const Bus: React.FC = () => {
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
      key: "key",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Biển số",
      dataIndex: "bienso",
      key: "bienso",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Loại xe",
      dataIndex: "loaixe",
      key: "loaixe",
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
          <Button>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>Thêm xe khách</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Bus;
