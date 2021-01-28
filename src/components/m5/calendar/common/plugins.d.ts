import { Calendar } from '../../types/calendar';
interface PluginArg {
    options: Calendar.GroupOptions;
    selectedDate: Calendar.SelectedDate;
}
export declare function handleActive(args: PluginArg, item: Calendar.Item): Calendar.Item;
export declare function handleMarks(args: PluginArg, item: Calendar.Item): Calendar.Item;
export declare function handleDisabled(args: PluginArg, item: Calendar.Item): Calendar.Item;
export declare function handleValid(args: PluginArg, item: Calendar.Item): Calendar.Item;
declare const _default: (typeof handleActive)[];
export default _default;
