import React from 'react';
import { AtCalendarBodyProps, AtCalendarBodyState } from '../../types/calendar';
export default class AtCalendarBody extends React.Component<AtCalendarBodyProps, Readonly<AtCalendarBodyState>> {
    static defaultProps: Partial<AtCalendarBodyProps>;
    constructor(props: AtCalendarBodyProps);
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: AtCalendarBodyProps): void;
    private changeCount;
    private currentSwiperIndex;
    private startX;
    private swipeStartPoint;
    private isPreMonth;
    private maxWidth;
    private isTouching;
    private generateFunc;
    private getGroups;
    private handleTouchStart;
    private handleTouchMove;
    private animateMoveSlide;
    private handleTouchEnd;
    private handleChange;
    private handleAnimateFinish;
    private handleSwipeTouchStart;
    private handleSwipeTouchEnd;
    render(): JSX.Element;
}
