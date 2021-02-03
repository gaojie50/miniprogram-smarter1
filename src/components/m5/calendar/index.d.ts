import React from 'react';
import { AtCalendarDefaultProps, AtCalendarProps, AtCalendarState } from '../types/calendar';
export default class AtCalendar extends React.Component<AtCalendarProps, Readonly<AtCalendarState>> {
    static defaultProps: AtCalendarDefaultProps;
    constructor(props: AtCalendarProps);
    UNSAFE_componentWillReceiveProps(nextProps: AtCalendarProps): void;
    private getSingleSelectdState;
    private getMultiSelectedState;
    private getSelectedDate;
    private getInitializeState;
    private triggerChangeDate;
    private setMonth;
    private handleClickPreMonth;
    private handleClickNextMonth;
    private handleSelectDate;
    private handleDayClick;
    private handleSelectedDate;
    private handleDayLongClick;
    render(): JSX.Element;
}
