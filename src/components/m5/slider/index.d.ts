import { InferProps } from 'prop-types';
import React from 'react';
import { AtSliderProps, AtSliderState } from '../types/slider';
export default class AtSlider extends React.Component<AtSliderProps, AtSliderState> {
    static defaultProps: AtSliderProps;
    static propTypes: InferProps<AtSliderProps>;
    constructor(props: AtSliderProps);
    protected static clampNumber(value: number, lower: number, upper: number): number;
    private handleChanging;
    private handleChange;
    UNSAFE_componentWillReceiveProps(props: AtSliderProps): void;
    render(): JSX.Element;
}
