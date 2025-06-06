// to consistent the timestamp format
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export function formatTime(dateString) {
  const date = dayjs(dateString);
  if (date.isToday()) {
    return `Today ${date.format("h:mm A")}`;
  } else if (date.isYesterday()) {
    return `Yesterday ${date.format("h:mm A")}`;
  } else {
    return date.format("MMMM D, YYYY h:mm A");
  }
}