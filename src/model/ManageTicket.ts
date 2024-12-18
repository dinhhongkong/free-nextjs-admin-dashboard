export interface TicketInfo {
  ticketId: number
  fullName: string
  phoneNumber: string
  email: string
  busId: number
  licensePlates: string
  pickupPoint: string
  pickupAddress: string
  dropOffPoint: string
  dropOffAddress: string
  pickupProvince: string
  dropoffProvince: string
  departureDay: string
  departureTime: string
  deltaTime: string
  seatName: string
  totalSeat: number
  price: number
  isCancel: any | boolean
  paymentMethod: string
  invoiceStatus: number
}
