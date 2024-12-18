import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate, formatTime } from "@/utils/TimeUtils";

export default function TripDetailCard({title ='',provinceStart = '', provinceEnd='' , time ='', date ='', seats =[""], price = 0}) {
  return (
    <div className="w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3 text-[15px]">
      <p className="icon-orange flex gap-4 text-xl font-medium text-black">Thông tin {title}</p>
      <div className="mt-4 flex justify-between">
        <span className="text-gray-500 w-20">Tuyến xe</span>
        <span className="text-right text-black">{provinceStart} - {provinceEnd}</span>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-gray-500 w-30">Thời gian xuất bến</span>
        <span className="text-[#00613D]">{formatTime(time)} {formatDate(date)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-gray-500 w-28">Số lượng ghế</span>
        <span className="text-black">{seats.length} Ghế</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-gray-500 w-28">Số ghế</span>
        <span className="text-[#00613D]">{seats.join(' ')}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-gray-500">Tổng tiền {title}</span>
        <span className="text-[#00613D]">{formatCurrency(seats.length * price)}</span>
      </div>
    </div>

  )
}