import { InferProps } from 'prop-types';
import React from 'react';
import { AtInputNumberProps } from '../types/input-number';
export default class AtInputNumber extends React.Component<AtInputNumberProps> {
    static defaultProps: AtInputNumberProps;
    static propTypes: InferProps<AtInputNumberProps>;
    private handleClick;
    private handleValue;
    private handleInput;
    private handleBlur;
    private handleError;
    render(): JSX.Element;
}
