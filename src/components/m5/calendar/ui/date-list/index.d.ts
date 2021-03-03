import React from 'react';
import { Calendar } from '../../../types/calendar';
export interface Props {
    list: Calendar.List<Calendar.Item>;
    onClick?: (item: Calendar.Item) => void;
    onLongClick?: (item: Calendar.Item) => void;
}
export default class AtCalendarList extends React.Component<Props> {
    private handleClick;
    private handleLongClick;
    render(): JSX.Element | null;
}
