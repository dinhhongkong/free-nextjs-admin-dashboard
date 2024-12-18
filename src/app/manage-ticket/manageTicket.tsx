"use client";
import { useNotification } from "@/context/NotificationContext";
import { useTicketInfo } from "@/hooks/TicketInfoHook";
import { formatDate } from "@/utils/TimeUtils";
import { Button, Form, Input } from "antd";

export default function ManageTicket() {
  const { tickets, fetchTicketInfo, cancelTicket, confirmPayment } = useTicketInfo();

  const onFinish = (values: any) => {
    if (values.ticketId === undefined) {
      console.log("ticketId is empty");
      fetchTicketInfo(0, values.phoneNumber);
    } else {
      console.log("ticketId is not empty");
      fetchTicketInfo(values.ticketId, values.phoneNumber);
    }
  };

  const printTicket = (id: number) => {
    var printContents = document.getElementById(
      "ticket" + id.toString(),
    ).innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload(); // Reload lại trang sau khi in
  };

  const renderTicket = () => {
    if (tickets.length === 0) {
      return <p className="text-red-500">Không tìm thấy thống tin vé</p>;
    }

    return tickets.map((ticket) => (
      <div
        key={ticket.ticketId}
        className="bg-gray-100 mb-24 mt-6 rounded-lg p-6 shadow-md"
      >
        <div id={"ticket" + ticket.ticketId.toString()}>
          <h2 className="text-gray-700 mb-4 text-lg font-bold">Thông Tin Vé</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Mã vé:</span> {ticket.ticketId}
            </li>
            <li>
              <span className="font-semibold">Họ tên:</span> {ticket.fullName}
            </li>
            <li>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {ticket.phoneNumber}
            </li>
            <li>
              <span className="font-semibold">Email:</span> {ticket.email}
            </li>
            <li>
              <span className="font-semibold">Mã xe: {ticket.busId} </span>
              <span className="font-semibold">
                {" "}
                - Biển số: {ticket.licensePlates}
              </span>
            </li>

            <li>
              <span className="font-semibold">Chuyến:</span>{" "}
              {ticket.pickupProvince} - {ticket.dropoffProvince}
            </li>
            <li>
              <span className="font-semibold">Điểm đón:</span>{" "}
              {ticket.pickupPoint} - {ticket.pickupAddress}
            </li>
            <li>
              <span className="font-semibold">Điểm trả:</span>{" "}
              {ticket.dropOffPoint} - {ticket.dropOffAddress}
            </li>
            <li>
              <span className="font-semibold">Ngày khởi hành:</span>{" "}
              {formatDate(ticket.departureDay)}
            </li>
            <li>
              <span className="font-semibold">Giờ khởi hành:</span>{" "}
              {ticket.departureTime}
            </li>
            <li>
              <span className="font-semibold">Ghế:</span> {ticket.seatName}
            </li>
            <li>
              <span className="font-semibold">Tổng số ghế:</span>{" "}
              {ticket.totalSeat}
            </li>
            <li>
              <span className="font-semibold">Giá vé:</span>{" "}
              {(ticket.price * ticket.totalSeat).toLocaleString()} VND
            </li>
            <li>
              <span
                className={`font-semibold ${ticket.isCancel ? "text-red-500" : "text-green-500"}`}
              >
                Trạng thái: {ticket.isCancel ? "Đã hủy" : "Đã đặt"}
              </span>
            </li>
            <li>
              <span className="font-semibold">Phương thức thanh toán:</span>{" "}
              {ticket.paymentMethod}
            </li>
          </ul>
        </div>

        <div className="mt-2 flex">
          <button className="mx-4 rounded bg-orange-700 px-4 py-2 text-white hover:bg-orange-400"
          onClick={() => cancelTicket(ticket.ticketId)}
          >
            Hủy vé
          </button>
          {ticket.paymentMethod === "Đặt trước" && (
            <button className="mx-4 rounded bg-green-700 px-4 py-2 text-white hover:bg-green-500"
              onClick={() => confirmPayment(ticket.ticketId)}
            >
              Thanh toán
            </button>
          )}

          {ticket.paymentMethod !== "Đặt trước" && (
            <button
              className="mx-4 rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-500"
              onClick={() => printTicket(ticket.ticketId)}
            >
              In vé
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="px-64">
      <div className="m-4 text-center text-xl font-bold text-green-700 ">
        TÌM KIẾM THÔNG TIN ĐẶT VÉ
      </div>
      <Form onFinish={onFinish}>
        <Form.Item name={"phoneNumber"}>
          <Input placeholder="Vui lòng nhập số điện thoại" />
        </Form.Item>

        <Form.Item name={"ticketId"}>
          <Input placeholder="Vui lòng nhập mã vé" />
        </Form.Item>

        <Form.Item>
          <Button
            className="mx-auto bg-orange-400 font-semibold text-white"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      {renderTicket()}
    </div>
  );
}
