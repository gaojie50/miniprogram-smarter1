import { InferProps } from 'prop-types';
import React from 'react';
import { AtSwipeActionProps, AtSwipeActionState } from '../types/swipe-action';
export default class AtSwipeAction extends React.Component<AtSwipeActionProps, AtSwipeActionState> {
    static defaultProps: AtSwipeActionProps;
    static propTypes: InferProps<AtSwipeActionProps>;
    private endValue;
    private startX;
    private startY;
    private maxOffsetSize;
    private domInfo;
    private isMoving;
    private isTouching;
    constructor(props: AtSwipeActionProps);
    private getDomInfo;
    UNSAFE_componentWillReceiveProps(nextProps: AtSwipeActionProps): void;
    private _reset;
    private computeTransform;
    private handleOpened;
    private handleClosed;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private handleDomInfo;
    private handleClick;
    render(): JSX.Element;
}
