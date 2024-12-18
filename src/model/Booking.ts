export type CreateOrderRequest = {
  userId: number|null;
  trip: DetailTrip;
  returnTrip?: DetailTrip | null;
  name: string;
  phoneNumber: string;
  email: string;
  paymentMethod: string;
  amount: number;
}

export type DetailTrip = {
  id: number;
  tickets: string[];
  pickupId: number;
  dropOffId: number;
}


export type BookingInfoResponse = {
  invoiceId: number | null;
  status: string;
  dateTime: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  trip: DetailBooking[];
}

export type DetailBooking = {
  tripId: number;
  tickets: string[];
  departureTime: string;
  amount: number;
}

export type PaymentRequest = {
  invoiceId: number | null;
  total: number | null;
  paymentMethod: string;
}
