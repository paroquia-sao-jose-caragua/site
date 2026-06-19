import { create } from "zustand";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type State = {
  lang: string;
  timezone: string;
  timezoneOffset: string;
};

const useLocaleConfigStore = create<State>()(() => ({
  lang: "pt-BR",
  timezone: dayjs.tz.guess(),
  timezoneOffset: dayjs().tz(dayjs.tz.guess()).format("Z"),
}));

export default useLocaleConfigStore;
