/**
 * Adds two time strings in the format HH:mm:ss.
 * @param time1 - The first time string.
 * @param time2 - The second time string.
 * @returns - The sum of the two time strings in HH:mm:ss format.
 */
export function addTimes(time1: string, time2: string): string {
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

  let totalSeconds = seconds1 + seconds2;
  let totalMinutes = minutes1 + minutes2 + Math.floor(totalSeconds / 60);
  const totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60);

  totalSeconds %= 60;
  totalMinutes %= 60;

  return `${String(totalHours).padStart(2, "0")}:${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds).padStart(2, "0")}`;
}

/**
 * Subtracts the second time string from the first time string in the format HH:mm:ss.
 * @param time1 - The first time string.
 * @param time2 - The second time string.
 * @returns - The difference of the two time strings in HH:mm:ss format.
 */
export function subtractTimes(time1: string, time2: string): string {
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

  let totalSeconds = seconds1 - seconds2;
  let totalMinutes = minutes1 - minutes2;
  let totalHours = hours1 - hours2;

  if (totalSeconds < 0) {
    totalSeconds += 60;
    totalMinutes -= 1;
  }

  if (totalMinutes < 0) {
    totalMinutes += 60;
    totalHours -= 1;
  }

  return `${String(totalHours).padStart(2, "0")}:${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds).padStart(2, "0")}`;
}

export function formatDate(dateString: string): string {
  // Kiểm tra xem chuỗi ngày có đúng định dạng không
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    throw new Error("Invalid date format. Expected yyyy-MM-dd");
  }

  // Tách chuỗi thành các phần
  const [year, month, day] = dateString.split("-");

  // Tạo chuỗi mới với định dạng dd-MM-yyyy
  return `${day}/${month}/${year}`;
}

export function formatYYYYMMDD(dateString: string | string[]): string {
  // Kiểm tra xem chuỗi ngày có đúng định dạng không

  // Tách chuỗi thành các phần
  const [day, month, year] = dateString.split("/");

  // Tạo chuỗi mới với định dạng dd-MM-yyyy
  return `${year}-${month}-${day}`;
}
