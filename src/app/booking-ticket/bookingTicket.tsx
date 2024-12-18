"use client"

import { Form, Input } from "antd"
import LimousineSeat from "../../components/trip/LimousineSeat"
import SleepingSeat from "../../components/trip/SleepingSeat"
import { formatCurrency } from "@/utils/formatCurrency"
import { useRouter, useSearchParams } from "next/navigation"
import Station from "../../components/trip/Station"
import TripDetailCard from "@/components/trip/TripDetailsCard"
import PriceDetailCard from "@/components/trip/PriceDetailCard"
import { use, useEffect } from "react"
import { useBooking } from "@/hooks/BookingHook"
import { useOrder } from "@/hooks/OrderHook"
import { useAuth } from "@/context/AuthContext"

export default function BookingTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRoundTrip = searchParams.get("isRoundTrip") === "true";
  const tripId = searchParams.get("tripId");
  const returnTripId = searchParams.get("returnTripId");

  const { selectedSeatsDepart, setSelectedSeatsDepart, selectedSeatsReturn, setSelectedSeatsReturn, departureTrip, roundTrip  } = useBooking(tripId, returnTripId, isRoundTrip);

  const {orderRequest, setOrderRequest, createOrder} = useOrder(tripId, returnTripId, isRoundTrip)
  const { isAuthenticated, user} = useAuth()

  const onChangeValueOrder = (name: string, value: any) => {
    setOrderRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleNestedTripChange = (name : string, field: string, value: any) => {
    setOrderRequest((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState.trip,
        [field]: value, 
      },
    }));
  };

  const handleNestedReturnTripChange = (name : string, field: string, value: any) => {
    setOrderRequest((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState.returnTrip,
        [field]: value, 
      },
    }));
  };

  useEffect(() => {
  
    setOrderRequest((prevState) => ({
      ...prevState,
      "paymentMethod": "Đặt trước"
    }));
    
    handleNestedTripChange('trip', 'id' , tripId)
    if (isRoundTrip) {
      handleNestedReturnTripChange('returnTrip', 'id', returnTripId)
    }
  }, []);


  useEffect(() => {
    onChangeValueOrder('userId', user?.id)
  }, [user]);

  useEffect(() => {
    handleNestedTripChange('trip', 'tickets' , selectedSeatsDepart)
  }, [selectedSeatsDepart]);

  useEffect(() => {
    handleNestedReturnTripChange('returnTrip', 'tickets' , selectedSeatsReturn)
  }, [selectedSeatsReturn]);


 

  const onSubmitOrder = () => {
    setOrderRequest(prevState => ({
      ...prevState,
      "userId": user.userId
    }));
    createOrder();
  }


  return (
    <div className={"w-full bg-[#f3f3f5]"}>
      <div className={" max-w-[1128px] ml-auto mr-auto pb-2 md:pb-8 lg:block"}>
        <div className={"flex w-full flex-col gap-6 pt-0 lg:flex-row lg:pt-8"}>

          <div className={"flex w-full flex-col"}>
            <div className={"flex w-full flex-col rounded-xl border bg-white divide-x"}>
              {/*select seat*/}
              <div className={"my-4 flex flex-row text-center font-medium gap-4 sm:gap-6"}>

                {departureTrip?.busType === "Giường" && (
                  <SleepingSeat disabledSeats={departureTrip.disableSeat}
                                selectedSeats={selectedSeatsDepart}
                                setSelectedSeats={setSelectedSeatsDepart}/>
                )}

                {departureTrip?.busType === "Limousine" && (
                  <LimousineSeat disabledSeats={departureTrip.disableSeat}
                                 selectedSeats={selectedSeatsDepart}
                                 setSelectedSeats={setSelectedSeatsDepart}/>
                )}

                {isRoundTrip && roundTrip?.busType === "Giường" && (
                  <SleepingSeat disabledSeats={roundTrip.disableSeat}
                                selectedSeats={selectedSeatsReturn}
                                setSelectedSeats={setSelectedSeatsReturn}/>
                )}

                {isRoundTrip && roundTrip?.busType === "Limousine" && (
                  <LimousineSeat disabledSeats={roundTrip.disableSeat}
                                 selectedSeats={selectedSeatsReturn}
                                 setSelectedSeats={setSelectedSeatsReturn}/>
                )}


              </div>
              <div className="mb-4 flex justify-center gap-4 text-[13px] font-normal">
                  <span className="mr-8 flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-[#D5D9DD] border-[#C0C6CC]"></div>
                    Đã bán
                  </span>
                <span className="mr-8 flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-[#DEF3FF] border-[#96C5E7]"></div>
                    Còn trống
                  </span>
                <span className=" flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-[#FDEDE8] border-[#F8BEAB]"></div>
                    Đang chọn</span>
              </div>

              <div className="h-1 bg-[#f3f3f5] w-full"></div>

              {/*user detail*/}
              <div className={"flex w-full flex-col gap-6 px-6 py-4 text-[15px] sm:flex-row"}>
                <div className={"flex flex-1 flex-col"}>
                  <p className="text-xl font-medium text-black">Thông tin khách hàng</p>
                  <Form className={"mt-6"} name="validateOnly" layout="vertical" autoComplete="off">
                    <Form.Item name="fullname" label="Họ và tên"
                               rules={[{required: true, type: "string", message: "Vui lòng điền họ và tên"}]}>
                      <Input onChange={(e) => onChangeValueOrder('name', e.target.value)}/>
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại"
                               rules={[{required: true, message: "Vui lòng điền số điện thoại"}]}>
                      <Input onChange={(e) => onChangeValueOrder('phoneNumber', e.target.value)}/>
                    </Form.Item>

                    <Form.Item name="email" label="Email"
                               rules={[{required: false, type: "email", message: "Vui lòng điền Email"}]}>
                      <Input onChange={(e) => onChangeValueOrder('email', e.target.value)}/>
                    </Form.Item>
                  </Form>
                </div>
                <div className="content-editor flex h-full flex-1 flex-col text-justify text-sm">
                  <p className="mb-6 text-center text-base font-medium text-orange-600">ĐIỀU KHOẢN &amp; LƯU Ý</p>
                  <div><p>(*) <span>Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán vé thành công có chứa mã vé được gửi từ hệ thống FUTA BUS LINE. </span>Vui
                    lòng liên hệ Trung tâm tổng đài <a target="_self" rel="" className="text-orange-600"
                                                       href="tel:19006067"><span
                    >1900 6067</span></a><a target="_blank" rel="" className="text-orange-600"
                                            href="tel:1900 6067"> </a>để được hỗ trợ.</p>
                    <p className={"mt-5"}>(*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ Tổng đài trung
                      chuyển <a target="_self" rel="" className="text-orange-600" href="tel:19006067"><span
                      >1900 6918</span></a> trước khi đặt vé. Chúng tôi không đón/trung chuyển tại
                      những điểm xe trung chuyển không thể tới được.</p></div>
                </div>

              </div>
              <div className="h-1 bg-[#f3f3f5] w-full"></div>

              <Station title={"chuyến đi"}
                       pickup={departureTrip?.pickup}
                       dropOff={departureTrip?.dropOff}
                       day={departureTrip?.departureDay}
                       onChangeDropOff={(e:number)=>{handleNestedTripChange('trip', 'dropOffId', e)}}
                       onChangePickup={(e:number)=>{handleNestedTripChange('trip', 'pickupId', e)}}
              />

              <div className="h-1 bg-[#f3f3f5] w-full"></div>

              {
                isRoundTrip && (
                  <Station
                    title={"chuyến về"}
                    pickup={roundTrip?.pickup}
                    dropOff={roundTrip?.dropOff}
                    day={roundTrip?.departureDay}
                    onChangeDropOff={(e:number)=>{handleNestedReturnTripChange('returnTrip', 'dropOffId', e)}}
                    onChangePickup={(e:number)=>{handleNestedReturnTripChange('returnTrip', 'pickupId', e)}}
                  />
                )
              }

              <div className="h-1 bg-[#f3f3f5] w-full"></div>

              <div className="flex items-center p-6">
                <div className="flex flex-col">
                  <span className=" px-2 rounded-xl bg-[#00613D] py-2 text-center text-xs text-white">Tổng cộng</span>
                  <span className="mt-2 text-2xl font-medium text-black">{
                    formatCurrency(departureTrip?.price * selectedSeatsDepart.length
                      + roundTrip?.price * selectedSeatsReturn.length)}</span>
                </div>
                <div className="flex flex-auto items-center justify-end">
                  <button type="button"
                          className="w-28 h-10 bg-white border-2 text-orange-600 rounded-full mr-7 hover:bg-orange-500 hover:text-white ">
                    <span>Hủy</span>
                  </button>
                  <button type="button" className="w-28 h-10 bg-orange-500 text-white  rounded-full"
                          onClick={onSubmitOrder}
                  >
                    <span>Thanh toán</span>
                  </button>
                </div>
              </div>

            </div>


          </div>

          <div className={"mx-auto flex min-w-[345px] flex-col gap-6"}>
            {departureTrip && (
              <>
                <TripDetailCard title={"lượt đi"}
                            date={departureTrip?.departureDay}
                            time={departureTrip?.departureTime}
                            price={departureTrip?.price}
                            seats={selectedSeatsDepart}
                            provinceStart={departureTrip?.departureProvince}
                            provinceEnd={departureTrip?.destProvince}
                />

                {isRoundTrip && (
                  <TripDetailCard title={"lượt về"}
                              date={roundTrip?.departureDay}
                              time={roundTrip?.departureTime}
                              price={roundTrip?.price}
                              seats={selectedSeatsReturn}
                              provinceStart={roundTrip?.departureProvince}
                              provinceEnd={roundTrip?.destProvince}
                  />
                )}

                <PriceDetailCard departurePrice={departureTrip?.price}
                             departureSeats={selectedSeatsDepart}
                             destinationSeats={selectedSeatsReturn}
                             destinationPrice={roundTrip?.price}
                             isRoundTrip={isRoundTrip}
                />
              </>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}