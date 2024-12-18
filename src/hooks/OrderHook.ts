import apiClient from "@/api/apiClient";
import { useNotification } from "@/context/NotificationContext";
import { CreateOrderRequest } from "@/model/Booking";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const useOrder = (tripId: string| null, returnTripId: string | null, isRoundTrip: boolean) => {
  const [orderRequest, setOrderRequest] = useState<CreateOrderRequest>({
    userId: null,
    trip: {
      id: 0,
      tickets: [],
      pickupId: 0,
      dropOffId: 0,
    },
    returnTrip: null,
    name: '',
    phoneNumber: '',
    email: '',
    paymentMethod: '',
    amount: 0,
  });

  const { setNotification } = useNotification();
  const router = useRouter()
  


  const createOrder = async () => {
    try {
      const response: number = await apiClient.post(`/payment/manage/invoice`, orderRequest);
      console.log(orderRequest);

      // if (response > 0) {
      //   router.push(`/payment?invoiceId=${response}&tripId=${tripId}&isRoundTrip=${isRoundTrip}&returnTripId=${returnTripId}`);
      // }
      if (response > 0) {
        router.push(`/booking-trip`);
        setNotification({
          show: true,
          message: "Đặt giúp vé khách hàng thành công",
          type: "success",
        });
      }

    } catch (error:any) {
      setNotification({
        show: true,
        message: error.response.data.message,
        type: "success",
      });
    }
    
  };

  return { orderRequest, setOrderRequest, createOrder };

}





