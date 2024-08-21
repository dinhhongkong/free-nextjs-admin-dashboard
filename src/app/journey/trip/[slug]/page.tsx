"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  TimePicker,
} from "antd";

import { useNotification } from "@/context/NotificationContext";
import apiClient from "@/api/apiClient";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  addTimes,
  formatDate,
  formatYYYYMMDD,
  subtractTimes,
} from "@/utils/TimeUtils";
import dayjs, { Dayjs } from "dayjs";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Option } = Select;

type OnChange = NonNullable<TableProps<Journey>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
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

interface PriceApi {
  id: number;
  dateStart: string;
  price: number;
}

interface BusApi {
  id: number;
  licensePlates: string;
  status: number;
  typeId: number;
  typeName: string;
}

const TripPage: React.FC<TripProps> = ({ params }) => {
  const { slug } = params;
  const [form] = Form.useForm();
  const router = useRouter();
  const { setNotification } = useNotification();
  const [tripList, setTripList] = useState<Trip[]>();
  const [journey, setjourney] = useState<Journey>();
  const [driverList, setDriverList] = useState<DriverApi[]>([]);
  const [busList, setBusList] = useState<BusApi[]>([]);
  const [priceList, setPriceList] = useState<PriceApi[]>([]);
  const [updateFeature, setUpdateFeature] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState(false);
  const [deleteTripId, setDeleteTripId] = useState<number>();
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
      width: "100px",
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
      render: (value, record, index) => (
        <div>
          <div>
            {value.driver &&
              value.driver.map(
                (item: any) =>
                  item && (
                    <div
                      className={"ml-2 font-medium text-orange-600"}
                      key={item.driverId}
                    >
                      {item.driverId} {item.driverFullName}
                    </div>
                  ),
              )}
          </div>
        </div>
      ),
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
          <Button onClick={() => onClickTicketInfo(value.id)}>Xem ds vé</Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadJourneyInfo();
    loadTripList();
    loadPriceList();
  }, []);

  const onClickTicketInfo = (id: number) => {
    router.push("/ticket/" + id);
  };

  const loadJourneyInfo = async () => {
    try {
      const data: Journey = await apiClient.get("/manage/journey/" + slug);
      setjourney(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải thông tin hành trình",
        type: "error",
      });
    }
  };

  const loadTripList = async () => {
    try {
      const data: Trip[] = await apiClient.get("/manage/journey/trips/" + slug);
      setTripList(data);
      setNotification({
        show: true,
        message: "Tải ds thành công",
        type: "success",
      });
    } catch (error) {}
  };

  const loadPriceList = async () => {
    try {
      const data: PriceApi[] = await apiClient.get("/manage/price");
      setPriceList(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách giá cả",
        type: "error",
      });
    }
  };

  const onClickDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteTripId(id);
  };

  const createTrip = async (body: any) => {
    try {
      const data = await apiClient.post("/manage/journey/trip", body);
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadTripList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const updateTrip = async (body: any) => {
    try {
      const data = await apiClient.put(
        "/manage/journey/trip/" + body.tripId,
        body,
      );
      setNotification({
        show: true,
        message: "Lưu thành công",
        type: "success",
      });
      setOpenForm(false);
      await loadTripList();
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi lưu",
        type: "error",
      });
    }
  };

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      journeyId: slug,
    };
    console.log(formattedValues);

    if (updateFeature) {
      updateTrip(formattedValues);
    } else {
      createTrip(formattedValues);
    }
  };

  const deleteTrip = async () => {
    try {
      const data = await apiClient.delete(
        "/manage/journey/trip/" + deleteTripId,
      );
      setNotification({
        show: true,
        message: "Xóa thành công",
        type: "success",
      });
      await loadTripList();
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
    const formattedValues = {
      ...values,
      tripId: values.id,
    };
    form.setFieldsValue(formattedValues);
    setOpenForm(true);
    setUpdateFeature(true);
    getDriverAvailable(values.departureDay);
    getBusAvailable(values.departureDay);
  };

  const onClickAdd = () => {
    form.setFieldsValue({});
    setOpenForm(true);
    setUpdateFeature(false);
  };

  const getDriverAvailable = async (date: any) => {
    try {
      console.log(date);
      const data: DriverApi[] = await apiClient.get(
        "/manage/journey/trip/driver/" + date,
      );
      setDriverList(data);
      console.log(data);
    } catch (error) {
      setDriverList([]);
      return [];
    }
  };

  const getBusAvailable = async (date: any) => {
    try {
      console.log(date + "bus");
      const data: BusApi[] = await apiClient.get(
        "/manage/journey/trip/bus/" + date,
      );
      setBusList(data);
      console.log(data);
    } catch (error) {
      setBusList([]);
      return [];
    }
  };

  const onChangeDepartureDay: DatePickerProps["onChange"] = (
    date,
    dateString,
  ) => {
    console.log("oke ne");
    form.setFieldsValue({
      departureDay: dateString,
    });
    getDriverAvailable(dateString);
    getBusAvailable(dateString);
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
            <Button onClick={loadTripList}>Reload</Button>

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
          <Modal
            open={openForm}
            title={updateFeature ? "Cập nhật thông tin chuyến" : "Thêm chuyến"}
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
                <Form.Item
                  name="tripId"
                  label="Id"
                  rules={[{ required: true }]}
                >
                  <Input disabled={true} />
                </Form.Item>
              )}
              <Form.Item
                name="departureDay"
                label="Ngày đi:"
                rules={[{ required: true }]}
                getValueProps={(value: any) => ({
                  value: value ? dayjs(value, "YYYY-MM-DD") : undefined,
                })}
                getValueFromEvent={(date) => date?.format("YYYY-MM-DD")}
              >
                <DatePicker onChange={onChangeDepartureDay} />
              </Form.Item>
              <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                <InputNumber />
                {/*<Select*/}
                {/*  showSearch*/}
                {/*  optionFilterProp="label"*/}
                {/*  placeholder="Vui lòng chọn"*/}
                {/*  allowClear*/}
                {/*>*/}
                {/*  {priceList.length && (*/}
                {/*    <>*/}
                {/*      {priceList.map((item: PriceApi) => (*/}
                {/*        <Option*/}
                {/*          key={item.id}*/}
                {/*          value={item.id}*/}
                {/*          label={item.price}*/}
                {/*        >*/}
                {/*          {formatCurrency(item.price)} -{" "}*/}
                {/*          {formatDate(item.dateStart)}*/}
                {/*        </Option>*/}
                {/*      ))}*/}
                {/*    </>*/}
                {/*  )}*/}
                {/*</Select>*/}
              </Form.Item>

              <Form.Item name="busId" label="Xe:" rules={[{ required: true }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Vui lòng chọn"
                  allowClear
                >
                  {busList.length && (
                    <>
                      {busList.map((item: BusApi) => (
                        <Option
                          key={item.id}
                          value={item.id}
                          label={item.licensePlates}
                        >
                          {item.licensePlates} - {item.typeName}
                        </Option>
                      ))}
                    </>
                  )}
                </Select>
              </Form.Item>

              <div className="rounded p-4 shadow">
                <div className="mb-3">Tài xế</div>
                <Form.List name="driverIdList">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space
                          key={field.key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            label="Tài xế"
                            name={[field.name]}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                            noStyle
                          >
                            <Select
                              showSearch
                              optionFilterProp="label"
                              placeholder="Vui lòng chọn"
                              allowClear
                              style={{ width: "300px" }}
                            >
                              {driverList.length &&
                                driverList.map((item: DriverApi) => (
                                  <Option
                                    key={item.id}
                                    value={item.id}
                                    label={item.fullName}
                                  >
                                    {item.id} - {item.fullName}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: "60%" }}
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>

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
            onOk={deleteTrip}
            onCancel={() => setConfirmDelete(false)}
            footer={[
              <Button key="back" onClick={() => setConfirmDelete(false)}>
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                className={"bg-blue-500"}
                onClick={deleteTrip}
              >
                Xóa
              </Button>,
            ]}
          >
            <p>Bạn có chắc muốn xóa</p>
          </Modal>
        </>
      </div>
    </DefaultLayout>
  );
};

export default TripPage;
