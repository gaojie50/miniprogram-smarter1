import { Dayjs } from 'dayjs';
import { Calendar } from '../../types/calendar';
export default function generateCalendarGroup(options: Calendar.GroupOptions): (generateDate: number, selectedDate: Calendar.SelectedDate, isShowStatus?: boolean) => Calendar.ListInfo<Calendar.Item>;
export declare function getGenerateDate(date: Calendar.DateArg | undefined): Dayjs;
