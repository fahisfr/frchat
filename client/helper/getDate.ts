import { isToday, format, formatDistanceToNowStrict } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export default (date: string) => {
  try {
    const formattedDate = zonedTimeToUtc(
      date,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    if (isToday(formattedDate)) {
      return format(formattedDate, "h:mm aa");
    } else {
      return format(formattedDate, "MMM d, h:mm aa");
    }
  } catch (err) {
    return ""
  }
};
