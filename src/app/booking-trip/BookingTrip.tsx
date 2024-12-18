"use client";
import Loading from "@/components/trip/Loading";
import TripCard from "@/components/trip/TripCard";
import { useProvince } from "@/hooks/ProvinceHook";
import { useSearchTrip } from "@/hooks/SearchTripHook";
import { Trip } from "@/model/Trip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProvincePicker from "@/components/trip/ProvincePicker";
import { Province } from "@/model/Province";
import { DatePicker, Tabs } from "antd";
import dayjs from "dayjs";


const dateFormat = "DD-MM-YYYY";

export default function BookingTrip() {
  const router = useRouter();
  const [activeSearch, setActiveSearch] = useState(false)
  const { provinces } = useProvince();
  const [ isRoundTrip, setIsRoundTrip ] = useState<boolean>(false);
  const { departureTrip, roundTrip, fetchSearchTrip, fetchSearchRoundTrip, searchParams ,setSearchParams, isLoading, selectedDeparture, setSelectedDeparture, selectedRoundTrip, setSelectedRoundTrip } = useSearchTrip();


  const onChangeValueSearch = (name: string, value: any) => {
    setSearchParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const onSubmitSearch = () => {
    if (isRoundTrip) {
      fetchSearchRoundTrip();
    } else {
      fetchSearchTrip();
    }
    setActiveSearch(true)
  }

  const redirectToBookingSeat = () => {
    if (isRoundTrip && selectedDeparture && selectedRoundTrip) {
      router.push(`/booking-ticket?tripId=${selectedDeparture?.id}&isRoundTrip=${isRoundTrip}&returnTripId=${selectedRoundTrip?.id}`)
    }
    else if (!isRoundTrip && selectedDeparture) {
      router.push(`/booking-ticket?tripId=${selectedDeparture?.id}&isRoundTrip=${isRoundTrip}&returnTripId=0`)
    }
  }

  const addDeparture = (trip: Trip) => {
    setSelectedDeparture(trip);
    
  }

  const addReturn = (trip: Trip) => {
    setSelectedRoundTrip(trip);
  }

  useEffect(() => {
    redirectToBookingSeat();
  }, [selectedDeparture, selectedRoundTrip]);




  const setItemTab = () =>{
    if (isRoundTrip) {
      return[{
        key: '1',
        label: "CHUYẾN ĐI: " + searchParams.departure?.provinceName + ' - ' + searchParams.destination?.provinceName,
        children: isLoading ? (
          <Loading/>
        ) : departureTrip.length > 0 ? (
          departureTrip.map((trip) => (
            <TripCard key={trip.id} tripProps={trip} onClickTrip={()=> addDeparture(trip)} />
          ))
        ) : (
          <p>Không có chuyến đi nào được tìm thấy.</p>
        ),
      },
        {
          key: '2',
          label: "CHUYẾN VỀ: " + searchParams.destination?.provinceName + ' - '+ searchParams.departure?.provinceName,
          children: isLoading ? (
            <Loading/>
          ) : roundTrip.length > 0 ? (
            roundTrip.map((trip) => (
              <TripCard key={trip.id} tripProps={trip} onClickTrip={()=> addReturn(trip)} />
            ))
          ) : (
            <p>Không có chuyến đi nào được tìm thấy.</p>
          ),
        }]

    }

    return [{
      key: '1',
      label: "CHUYẾN ĐI: " + searchParams.departure?.provinceName + ' - ' + searchParams.destination?.provinceName,
      children: isLoading ? (
        <Loading/>
      ) : departureTrip.length > 0 ? (
        departureTrip.map((trip) => (
          <TripCard key={trip.id} tripProps={trip} onClickTrip={()=> addDeparture(trip)} />
        ))
      ) : (
        <p>Không có chuyến đi nào được tìm thấy.</p>
      ),
    }]
  }

  return (
    <div className={" "}>
      <div className={`layout pb-2 md:pb-8 lg:block`}>
        {/*search trips*/}
        <section
          className={`layout relative flex flex-col`}
          style={{ top: "10px" }}
        >
          <div className={`relative left-0 right-0 z-30`}>


            <div
              className={`p-6 m-2 font-medium lg:m-auto xl:w-[1128px] shadow-md border-2 rounded-xl`}
            >
              {/*select ticket type*/}
              <div className={"flex items-center justify-between text-[15px]"}>
                <div>
                  <label>
                    <span>
                      <input
                        name={"isRoundTrip"}
                        value={0}
                        className={"align-middle mx-1"}
                        type={"radio"}
                        defaultChecked
                        onClick={() => setIsRoundTrip(false)}
                      />
                    </span>
                    <span
                      className={
                        "font-medium " + (true ? "" : "text-orange-600")
                      }
                    >
                      Một chiều
                    </span>
                  </label>

                  {/* <label className={"ml-4"}>
                    <span>
                      <input
                        name={"isRoundTrip"}
                        value={1}
                        className={"align-middle mx-1 "}
                        type={"radio"}
                        onClick={() => setIsRoundTrip(true)}

                      />
                    </span>
                    <span
                      className={
                        "font-medium " + (true ? "text-orange-600" : "")
                      }
                    >
                      Khứ hồi
                    </span>
                  </label> */}
                </div>

                <span className="cursor-pointer font-medium text-orange-600 lg:contents">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="/huong-dan-dat-ve-tren-web"
                  >
                    Hướng dẫn mua vé
                  </a>
                </span>
              </div>

              <div
                className={"grid grid-cols-1 pb-4 pt-4 lg:grid-cols-2 lg:gap-4"}
              >
                <div className={"relative flex justify-center lg:gap-4"}>
                  <div className="flex-1">
                    <label>Điểm đi</label>
                    <div
                      className={` item-start mt-1 flex w-full cursor-pointer font-medium lg:items-center text-base lg:text-lg`}
                    >
                      <ProvincePicker
                        title={"Điểm đi"}
                        provinces={provinces}
                        onSelectProvince={(province: Province) =>
                          onChangeValueSearch("departure",province)
                        }
                      />
                    </div>
                  </div>

                  <Image
                    className={`absolute top-7 z-10 cursor-pointer object-contain transition-transform duration-300 transform rotate-0 bottom-6 h-8 w-8 lg:bottom-5 lg:h-10 lg:w-10`}
                    width={50}
                    height={50}
                    src={"/assets/switch_location.svg"}
                    alt="switch location icon"
                  />

                  <div className="flex-1 text-right lg:text-left">
                    <label>Điểm đến</label>
                    <div
                      className={` item-start mt-1 flex w-full cursor-pointer font-medium lg:items-center justify-end lg:justify-start text-base lg:text-lg `}
                    >
                      <ProvincePicker
                        title={"Điểm đi"}
                        provinces={provinces}
                        onSelectProvince={(province: Province) =>
                          onChangeValueSearch("destination",province)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={"flex"}>
                  {/*Chọn ngày đi*/}
                  <div className="mr-4 flex flex-1 flex-col">
                    <label>Ngày đi</label>
                    <div
                      className={`item-start mt-1 flex w-full cursor-pointer font-medium lg:items-center text-base lg:text-lg `}
                    >
                      <span className="max-w-[140px] lg:max-w-[220px] z-20 focus:outline-none">
                        <DatePicker
                          placeholder="Nhập ngày đi"
                          size="large"
                          format={dateFormat}
                          minDate={dayjs()}
                          onChange={(date) => {
                              console.log(date.format("YYYY-MM-DD"));
                              onChangeValueSearch("startDate", date.format("YYYY-MM-DD"))
                            }
                          }
                        />
                      </span>
                    </div>
                  </div>

                  {/*Chọn ngày về*/}
                  {isRoundTrip && (
                    <div className="mr-4 flex flex-1 flex-col">
                      <label>Ngày về</label>
                      <div
                        className={`item-start mt-1 flex w-full cursor-pointer font-medium lg:items-center text-base lg:text-lg `}
                      >
                        <span className="max-w-[140px] lg:max-w-[220px] z-20 focus:outline-none">
                          <DatePicker
                            placeholder="Nhập ngày về"
                            color="orange"
                            size="large"
                            format={dateFormat}
                            minDate={dayjs()}
                            onChange={(date) => {
                              onChangeValueSearch("endDate", date.format("YYYY-MM-DD"))
                              }
                            }
                          />
                    
                        </span>
                      </div>
                    </div>
                  )}

                  {/*Chọn số vé*/}
                  
                </div>

                <div className="divide my-3 lg:hidden"></div>
              </div>
              <div className="relative z-10 flex w-full justify-center">
                <button className="absolute h-12 rounded-full bg-orange-600 px-20 text-base text-white transition duration-200" onClick={ onSubmitSearch}>
                  Tìm chuyến xe
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className={"xl:w-[1128px] mx-auto mt-12"}>
          <div className={"flex justify-between gap-10 "}>
  
            {/*trip*/}

            <div className={"w-full"}>
              {activeSearch && (
                <Tabs defaultActiveKey="1" items={setItemTab()}/>
              )}
            </div>
        

            {/*filter*/}
          </div>
        </div>

      </div>

  
    </div>
  );
}
