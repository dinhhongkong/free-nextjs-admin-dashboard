export type SeatProps = {
  disabledSeats: string[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
};