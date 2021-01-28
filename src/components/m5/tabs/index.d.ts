import { InferProps } from 'prop-types';
import React from 'react';
import { AtTabsProps, AtTabsState } from '../types/tabs';
export default class AtTabs extends React.Component<AtTabsProps, AtTabsState> {
    static defaultProps: AtTabsProps;
    static propTypes: InferProps<AtTabsProps>;
    private _tabId;
    private _touchDot;
    private _timer;
    private _interval;
    private _isMoving;
    private tabHeaderRef;
    constructor(props: AtTabsProps);
    private updateState;
    private handleClick;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private getTabHeaderRef;
    UNSAFE_componentWillReceiveProps(nextProps: AtTabsProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
