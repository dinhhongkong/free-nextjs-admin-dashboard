"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  TimePicker,
} from "antd";

import { useNotification } from "@/context/NotificationContext";
import apiClient from "@/api/apiClient";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/TimeUtils";

const { Option } = Select;
interface TripProps {
  params: {
    slug: number;
  };
}

interface Bus {
  id: number;
  licensePlates: string;
  status: number;
  typeId: number;
  typeName: string;
}

interface Office {
  id: number;
  deltaTime: string;
  officeId: number;
  officeName: string;
  officeAddress: string;
  provinceId: number;
  provinceName: string;
  type: number;
}

interface Trip {
  id: number;
  departureDay: string;
  departureTime: string;
  priceId: number;
  price: number;
  bus: Bus;
  driver: any[]; // Điều chỉnh nếu bạn biết kiểu dữ liệu chính xác của driver
  departureOffice: Office;
  destinationOffice: Office;
}

interface JourneyDetails {
  id: number;
  deltaTime: string;
  officeId: string;
  officeName: string;
  officeAddress: string;
  provinceId: number;
  provinceName: string;
  type: number;
}

interface Journey {
  id: number;
  departureTime: string;
  travelTime: string;
  status: number;
  departureOffice: JourneyDetails;
  destinationOffice: JourneyDetails;
  transferOffice: JourneyDetails[];
  stopStation: JourneyDetails[];
}

const TripPage: React.FC<TripProps> = ({ params }) => {
  const { slug } = params;
  const [form] = Form.useForm();

  const { setNotification } = useNotification();
  const [tripList, setTripList] = useState<Trip[]>();
  const [journey, setjourney] = useState<Journey>();
  const [updateFeature, setUpdateFeature] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);
  const [deleteJourneyId, setDeleteJourneyId] = useState<number>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [departureProvince, setDepartureProvince] = useState<number | null>(
    null,
  );
  const [destinationProvince, setDestinationProvince] = useState<number | null>(
    null,
  );

  const [departureOffice, setDepartureOffice] = useState<number | null>(null);
  const [destinationOffice, setDestinationOffice] = useState<number | null>(
    null,
  );
  const [selectedTransferOffices, setSelectedTransferOffices] = useState<
    number | null
  >(null);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

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

  const columns: TableColumnsType<Trip> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      width: "65px",
      ellipsis: true,
    },
    {
      title: "Ngày khởi hành",
      dataIndex: "departureDay",
      key: "departureDay",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      width: "180px",
      render: (value) => formatDate(value),
      ellipsis: true,
    },
    {
      title: "Giá",
      key: "id",
      dataIndex: "price",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
      render: (value) => formatCurrency(value),
      width: "180px",
    },

    {
      title: "Xe chạy",
      dataIndex: "bus",
      key: "travelTime",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      width: "13%",
      render: (value) => value.licensePlates,
      ellipsis: true,
    },
    {
      title: "Loại ghế",
      dataIndex: "bus",
      key: "travelTime",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      width: "13%",
      render: (value) => value.typeName,
      ellipsis: true,
    },
    {
      title: "Tài xế/phụ xe",
      ellipsis: true,
      render: (value, record, index) => <div>Tôi là tài xế</div>,
    },
    {
      title: "Chức năng",
      ellipsis: true,
      render: (value) => (
        <div>
          <Button onClick={() => onClickUpdate(value)}>Sửa</Button>
          <Button className={"mx-1"} onClick={() => onClickDelete(value.id)}>
            Xóa
          </Button>
          <Button>Xem chuyến đi</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadJourneyInfo();
    loadTripList();
  }, []);

  const loadJourneyInfo = async () => {
    try {
      const data: Journey = await apiClient.get("/manage/journey/" + slug);
      setjourney(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách tỉnh thành",
        type: "error",
      });
    }
  };

  const loadTripList = async () => {
    try {
      const data: Trip[] = await apiClient.get("/manage/journey/trips/" + slug);
      setTripList(data);
    } catch (error) {}
  };

  const loadJourney = async () => {
    try {
      const data: Journey[] = await apiClient.get("/manage/journeys");
      setJourneyList(data);
      console.log(data);
      setNotification({
        show: true,
        message: "Load thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách hành trình",
        type: "error",
      });
    }
  };

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteJourneyId(id);
  };

  const createJourney = async (body: any) => {
    try {
      const data = await apiClient.post("/manage/journey", body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadJourney();
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

    //
    // const updateBus = async (body: any) => {
    //   try {
    //     const data = await apiClient.put("/manage/office/" + body.id, body);
    //     setNotification({
    //       show: true,
    //       message: "Lưu thành công",
    //       type: "success",
    //     });
    //     setOpenForm(false);
    //     await loadOffice();
    //   } catch (error) {
    //     setNotification({
    //       show: true,
    //       message: "Lỗi khi lưu",
    //       type: "error",
    //     });
    //   }
    // };
    if (!updateFeature) {
      createJourney(values);
    }
    // else {
    //   createBus(values);
    // }
  };

  const deleteJourney = async () => {
    try {
      const data = await apiClient.delete("/manage/journey/" + deleteJourneyId);
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadJourney();
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

  const getOffice = async (id: number) => {
    try {
      const data: Office[] = await apiClient.get(
        "/manage/province/" + id + "/offices",
      );
      return data;
    } catch (error) {
      return [];
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý chuyến" />
      <div className="flex flex-col gap-10">
        <>
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={onClickAdd}>Thêm chuyến đi</Button>
            <Button onClick={onClickAdd}>Reload</Button>

            <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
          </Space>
          <div className={"flex"}>
            <div className={"text-xl font-bold text-blue-600"}>
              Thời gian khởi hành: {journey?.departureTime}
            </div>
            <div className={"ml-10  text-xl font-bold text-blue-600"}>
              Chuyến: {journey?.departureOffice.provinceName}-
              {journey?.destinationOffice.provinceName}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={tripList}
            rowKey="id" // Thêm rowKey để đảm bảo mỗi hàng trong bảng có key duy nhất
          />
        </>
      </div>
    </DefaultLayout>
  );
};

export default TripPage;
