"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TimePicker,
} from "antd";
import apiClient from "@/api/apiClient";
import { useNotification } from "@/context/NotificationContext";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { addTimes, subtractTimes } from "@/utils/TimeUtils";
import { useRouter } from "next/navigation";

const { Option } = Select;
type OnChange = NonNullable<TableProps<TripTrash>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

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

interface TripTrash {
  id: number;
  departureDay: string;
  departureTime: string;
  priceId: number;
  price: number;
  bus: {
    id: number;
    licensePlates: string;
    status: number;
    typeId: number;
    typeName: string;
  };
  departureOffice: JourneyDetails;
  destinationOffice: JourneyDetails;
}

interface Province {
  id: number;
  provinceName: string;
}

interface Office {
  id: number;
  officeName: string;
  address: string;
  provinceId: number;
  provinceName: string;
}

interface TripProps {
  params: {
    id: number;
  };
}

const Trip: React.FC<TripProps> = ({ params }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { setNotification } = useNotification();
  const [journeyList, setJourneyList] = useState<Journey[]>();
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [departureOffices, setDepartureOffices] = useState<Office[]>([]);
  const [destinationOffices, setDestinationOffices] = useState<Office[]>([]);
  const [allOffices, setOffices] = useState<Office[]>([]);
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

  const columns: TableColumnsType<TripTrash> = [
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
      title: "Giờ khởi hành",
      dataIndex: "departureTime",
      key: "departureTime",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      width: "10%",
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
      width: "180px",
    },

    {
      title: "Xe chạy",
      dataIndex: "bus.licensePlates",
      key: "travelTime",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      width: "13%",
      ellipsis: true,
    },
    {
      title: "Loại ghế",
      dataIndex: "bus.typeName",
      key: "travelTime",
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      width: "13%",
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
    loadJourney();
    loadProvince();
    loadOffice();
  }, []);

  const loadProvince = async () => {
    try {
      const data: Province[] = await apiClient.get("/manage/provinces");
      setProvinceList(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi tải danh sách tỉnh thành",
        type: "error",
      });
    }
  };

  const loadOffice = async () => {
    try {
      const data: Office[] = await apiClient.get("/manage/offices");
      setOffices(data);
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

  const renderProvince = (excludeId: number | null) => {
    return (
      <>
        {provinceList
          .filter((item) => item.id !== excludeId)
          .map((item: Province) => (
            <Option key={item.id} value={item.id} label={item.provinceName}>
              {item.provinceName}
            </Option>
          ))}
      </>
    );
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

  const onChangeDeparture = async (value: number) => {
    setDepartureProvince(value);
    const data = await getOffice(value);
    setDepartureOffices(data);
  };

  const onChangeDestination = async (value: number) => {
    setDestinationProvince(value);
    const data = await getOffice(value);
    setDestinationOffices(data);
  };

  const renderDepartureOffice = () => {
    return (
      <>
        {departureOffices.map((item: Office) => (
          <Option key={item.id} value={item.id} label={item.officeName}>
            {item.officeName}
          </Option>
        ))}
      </>
    );
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={onClickAdd}>Thêm hành trình</Button>
        <Button
          onClick={() => {
            console.log(departureOffices);
          }}
        >
          Xóa filters
        </Button>
        <Button onClick={clearAll}>Xóa filters và sắp xếp</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={journeyList}
        onChange={handleChange}
        rowKey="id" // Thêm rowKey để đảm bảo mỗi hàng trong bảng có key duy nhất
      />

      <Modal
        open={openForm}
        title={
          updateFeature
            ? "Cập nhật thông tin hành trình"
            : "Thêm hành trình mới"
        }
        onCancel={() => setOpenForm(false)}
        footer={null}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 2000 }}
        >
          {updateFeature && (
            <Form.Item name="id" label="Id" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          )}
          <div className="flex">
            <Form.Item
              name={["departureOffice", "provinceId"]}
              label="Tỉnh xuất phát"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Vui lòng chọn tỉnh"
                allowClear
                onChange={onChangeDeparture}
              >
                {renderProvince(destinationProvince)}
              </Select>
            </Form.Item>

            <Form.Item
              name={["destinationOffice", "provinceId"]}
              label="Tỉnh đến"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Vui lòng chọn tỉnh"
                allowClear
                onChange={onChangeDestination}
              >
                {renderProvince(departureProvince)}
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            name="departureTime"
            label="Giờ khởi hành"
            rules={[{ required: true }]}
            getValueProps={(value: string) => ({
              value: value ? dayjs(value, "HH:mm:ss") : undefined,
            })}
            getValueFromEvent={(value: Dayjs | null) =>
              value ? value.format("HH:mm:ss") : undefined
            }
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="travelTime"
            label="Thời gian chạy"
            rules={[{ required: true }]}
            getValueProps={(value: string) => ({
              value: value ? dayjs(value, "HH:mm:ss") : undefined,
            })}
            getValueFromEvent={(value: Dayjs | null) =>
              value ? value.format("HH:mm:ss") : undefined
            }
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Vui lòng chọn trạng thái hoạt động"
              allowClear
            >
              <Option value={0}>Dừng hoạt động</Option>
              <Option value={1}>Hoạt động</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["departureOffice", "officeId"]}
            label="Trạm xuất phát:"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Vui lòng chọn"
              allowClear
              onChange={(value) => setDepartureOffice(value)}
            >
              {departureOffices.length > 0 && (
                <>
                  {departureOffices.map((item: Office) => (
                    <Option
                      key={item.id}
                      value={item.id}
                      label={item.officeName}
                    >
                      {item.officeName}
                    </Option>
                  ))}
                </>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name={["destinationOffice", "officeId"]}
            label="Trạm dừng"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Vui lòng chọn tỉnh"
              allowClear
              onChange={(value) => setDestinationOffice(value)}
            >
              {destinationOffices.length > 0 && (
                <>
                  {destinationOffices.map((item: Office) => (
                    <Option
                      key={item.id}
                      value={item.id}
                      label={item.officeName}
                    >
                      {item.officeName}
                    </Option>
                  ))}
                </>
              )}
            </Select>
          </Form.Item>

          <div className="rounded p-4 shadow">
            <div className="mb-3">Trạm trung chuyển</div>
            <Form.List name="transferOffice">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        label="Tên trạm"
                        name={[field.name, "officeId"]}
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
                          {departureOffices.length > 0 &&
                            departureOffices
                              .filter(
                                (item: Office) => item.id != departureOffice,
                              )
                              .map((item: Office) => (
                                <Option
                                  key={item.id}
                                  value={item.id}
                                  label={item.officeName}
                                >
                                  {item.officeName}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "deltaTime"]}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        getValueProps={(value: string) => ({
                          value: value ? dayjs(value, "HH:mm:ss") : undefined,
                        })}
                        getValueFromEvent={(value: Dayjs | null) =>
                          value ? value.format("HH:mm:ss") : undefined
                        }
                      >
                        <TimePicker
                          format="HH:mm:ss"
                          placeholder="Thời gian đến sau"
                        />
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

          <div className="mt-3 rounded p-4 shadow">
            <div className="mb-3">Trạm nghỉ/dừng chân</div>
            <Form.List name="stopStation">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        label="Tên trạm"
                        name={[field.name, "officeId"]}
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
                          {allOffices.length > 0 &&
                            allOffices
                              .filter(
                                (item) =>
                                  item.id !== departureOffice &&
                                  item.id != destinationOffice,
                              )
                              .map((item: Office) => (
                                <Option
                                  key={item.id}
                                  value={item.id}
                                  label={`${item.officeName} (${item.provinceName})`}
                                >
                                  {`${item.officeName} (${item.provinceName})`}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "deltaTime"]}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        getValueProps={(value: string) => ({
                          value: value ? dayjs(value, "HH:mm:ss") : undefined,
                        })}
                        getValueFromEvent={(value: Dayjs | null) =>
                          value ? value.format("HH:mm:ss") : undefined
                        }
                      >
                        <TimePicker
                          format="HH:mm:ss"
                          placeholder="Thời gian đến sau"
                        />
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
              <Button className="bg-blue-500" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={confirmDelete}
        title="Xác nhận xóa"
        onOk={deleteJourney}
        onCancel={() => setConfirmDelete(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmDelete(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={"bg-blue-500"}
            onClick={deleteJourney}
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

export default Trip;
