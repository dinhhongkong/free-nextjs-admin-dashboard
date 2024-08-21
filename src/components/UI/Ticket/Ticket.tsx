"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import { Button, Form, Modal, Space, Table } from "antd";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import apiClient from "@/api/apiClient";

type OnChange = NonNullable<TableProps<TicketApi>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface TicketApi {
  id: number;
  pickup: string;
  dropOff: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  invoiceCreationDate: string;
  paymentMethod: string;
  invoiceStatus: number;
  ticketDetailSeatNames: string[];
}

interface TripProps {
  params: {
    slug: number;
  };
}

const Ticket: React.FC<TripProps> = ({ params }) => {
  const { slug } = params;
  const [form] = Form.useForm();
  const router = useRouter();
  const { setNotification } = useNotification();
  const [ticketList, setTicketList] = useState<TicketApi[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [deleteTicketId, setDeleteTicketId] = useState<number>();

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

  const columns: TableColumnsType<TicketApi> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      width: "65px",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Điểm đón",
      dataIndex: "pickup",
      key: "pickup",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Điểm trả",
      dataIndex: "dropOff",
      key: "dropOff",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Cổng thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Ghế",
      ellipsis: true,
      render: (value, record, index) => (
        <div>
          <div>
            {value.ticketDetailSeatNames &&
              value.ticketDetailSeatNames.map(
                (item: any) =>
                  item && (
                    <div
                      className={"ml-2 font-medium text-orange-600"}
                      key={item}
                    >
                      {item}
                    </div>
                  ),
              )}
          </div>
        </div>
      ),
      width: "70px",
    },
    {
      title: "Chức năng",
      ellipsis: true,
      render: (value) => (
        <div>
          <Button onClick={() => onClickDelete(value.id)}>Hủy vé</Button>
        </div>
      ),
      width: "100px",
    },
  ];

  useEffect(() => {
    loadTicketInfo();
  }, []);

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteTicketId(id);
  };

  const loadTicketInfo = async () => {
    try {
      const data: TicketApi[] = await apiClient.get("/manage/tickets/" + slug);
      setTicketList(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải ds vé",
        type: "error",
      });
    }
  };

  const deleteTicket = async () => {
    try {
      const data = await apiClient.delete("/manage/ticket/" + deleteTicketId);
      setNotification({
        show: true,
        message: "Hủy vé thành công",
        type: "success",
      });
      await loadTicketInfo();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi xóa vì khóa ngoại",
        type: "error",
      });
    }
    setConfirmDelete(false);
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={loadTicketInfo}>Reload</Button>
        <Button onClick={clearFilters}>Xóa filters</Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <div>Chuyến đi số: {slug}</div>
      <Table
        columns={columns}
        dataSource={ticketList}
        onChange={handleChange}
      />
      <Modal
        open={confirmDelete}
        title="Xác nhận hủy vé"
        onOk={deleteTicket}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={deleteTicket}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc muốn hủy vé</p>
      </Modal>
    </>
  );
};

export default Ticket;
