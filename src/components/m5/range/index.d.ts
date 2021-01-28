import { InferProps } from 'prop-types';
import React from 'react';
import { AtRangeProps, AtRangeState } from '../types/range';
export default class AtRange extends React.Component<AtRangeProps, AtRangeState> {
    static defaultProps: AtRangeProps;
    static propTypes: InferProps<AtRangeProps>;
    private width;
    private left;
    private deltaValue;
    private currentSlider;
    constructor(props: AtRangeProps);
    private handleClick;
    private handleTouchMove;
    private handleTouchEnd;
    private setSliderValue;
    private setValue;
    private triggerEvent;
    private updatePos;
    UNSAFE_componentWillReceiveProps(nextProps: AtRangeProps): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
