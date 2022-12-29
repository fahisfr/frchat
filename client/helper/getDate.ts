import { formatDistanceToNowStrict } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export default (date: string) => {
  try {
    return `${formatDistanceToNowStrict(
      zonedTimeToUtc(date, Intl.DateTimeFormat().resolvedOptions().timeZone)
    )} ago`;
  } catch (err) {
    return date;
  }
};
