import Image from "next/image";
import { SeatProps } from "./SeatProps";

export default function SleepingSeat({disabledSeats, selectedSeats, setSelectedSeats} : SeatProps) {

  const handleSeatClick = (seatNumber: string) => {
    if (disabledSeats.includes(seatNumber)) return;

    setSelectedSeats((prevSelectedSeats : string[]) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((seat) => seat !== seatNumber);
      }
      else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };



  const getSeatStatus = (seatNumber: string) => {
    if (disabledSeats.includes(seatNumber)) return "disabled";
    if (selectedSeats.includes(seatNumber)) return "selecting";
    return "active";
  };

  const renderSeat = (seatNumber: string, status:string) => {
    const seatStyles : Record<string, string> = {
      disabled: "cursor-not-allowed",
      active: "cursor-pointer",
      selecting: "cursor-pointer",
    };

    const textColors :Record<string, string> = {
      disabled: "text-[#A2ABB3]",
      active: "text-[#339AF4]",
      selecting: "text-[#EF5222]",
    };

    const seatImages: Record<string, string> = {
      disabled: "/assets/seat_disabled.svg",
      active: "/assets/seat_active.svg",
      selecting: "/assets/seat_selecting.svg",
    };

    return (
      <td
        key={seatNumber}
        className={`relative mt-1 flex justify-center text-center ${seatStyles[status]}`}
        onClick={() => handleSeatClick(seatNumber)}
      >
        <Image width={32} height={32} src={seatImages[status]} alt="seat icon" />
        <span className={`absolute text-sm font-semibold lg:text-[10px] ${textColors[status]} top-1`}>
          {seatNumber}
        </span>
      </td>
    );
  };

  const renderSeats = (title: string, seatName:string, rows = 7, cols = 5) => {
    const seats = [];
    let seatCount = 1;

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        if (i === 5 && (j === 1 || j === 2 || j === 3)) {
          row.push(<td key={`empty-${i}-${j}`} className="relative w-6"></td>);
        } else if (i !== 6 && (j === 1 || j === 3)) {
          row.push(<td key={`empty-${i}-${j}`} className="relative w-6"></td>);
        } else {
          const seatNumber = `${seatName}${seatCount.toString().padStart(2, '0')}`;
          const status = getSeatStatus(seatNumber);
          row.push(renderSeat(seatNumber, status));
          seatCount++;
        }
      }
      seats.push(
        <tr key={`row-${i}`} className="flex items-center gap-1 justify-between">
          {row}
        </tr>
      );
    }

    return (
      <div className={"flex min-w-[50%] flex-col md:min-w-[153px]"}>
        <div className="icon-gray flex w-full justify-center p-2 text-sm ">
          <span>{title}</span>
        </div>
        <table>
          <tbody>{seats}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={"min-w-sm mx-auto flex w-[100%] max-w-2xl flex-col px-3 py-1 sm:px-6 2lg:mx-0 2lg:w-auto"}>
      <div className="flex mx-auto max-w-xs pt-5 text-xl font-medium text-black">
        <p className="flex flex-col">
          Chọn ghế
          <span className="text-sm">Chuyến về - Thứ 5, 18/07</span>
        </p>
      </div>

      <div className={"my-4 flex flex-row text-center font-medium gap-4 sm:gap-6 justify-center"}>
        {renderSeats("Tầng dưới", "A", 7, 5)}
        <div className={"max-w-2"}></div>
        {renderSeats("Tầng trên", "B", 7, 5)}
      </div>
    </div>
  );
}