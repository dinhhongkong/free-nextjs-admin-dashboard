import Image from "next/image";
import {formatCurrency} from "@/utils/formatCurrency";

export default function PriceDetail( {departurePrice = 0,
                                       destinationPrice = 0,
                                       departureSeats = [""],
                                       destinationSeats = [""],
                                       isRoundTrip = false}) {
  return (
    <div className="w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3 text-[15px]">
      <div className="icon-orange flex gap-2 text-xl font-medium text-black">
        Chi tiết giá
        <Image className="w-6 cursor-pointer orange-500" width={15} height={15} src={"/assets/info_white.svg"} alt={"open filter"}/>
        </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-gray-500">Giá vé lượt đi</span>
        <span className="text-orange-500">{formatCurrency(departurePrice * departureSeats.length)}</span>
      </div>
      { isRoundTrip && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-gray-500">Giá vé lượt về</span>
          <span className="text-orange-500">{formatCurrency(destinationPrice * destinationSeats.length)}</span>
        </div>
      )
      }

      <div className="mt-1 flex items-center justify-between">
        <span className="text-gray-500">Phí thanh toán</span>
        <span className="text-black">0đ</span>
      </div>
      <div className="divide my-3"></div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Tổng tiền</span>
        {isRoundTrip && (
          <span className="text-orange-500">{formatCurrency(departurePrice * departureSeats.length + destinationPrice * destinationSeats.length )}</span>
        )}
        {!isRoundTrip && (
          <span className="text-orange-500">{formatCurrency(departurePrice * departureSeats.length)}</span>
        )}

      </div>
    </div>
)
}