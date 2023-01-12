import { isToday, format, formatDistanceToNowStrict } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export default (date: Date) => {
  try {
    const formattedDate = zonedTimeToUtc(
      date,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    if (isToday(formattedDate)) {
      return format(formattedDate, "h:mm aa s");
    } else {
      return format(formattedDate, "MMM d, h:mm aa");
    }
  } catch (err) {
    return "";
  }
};
