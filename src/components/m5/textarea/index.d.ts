import { InferProps } from 'prop-types';
import React from 'react';
import { AtTextareaProps } from '../types/textarea';
export default class AtTextarea extends React.Component<AtTextareaProps> {
    static defaultProps: AtTextareaProps;
    static propTypes: InferProps<AtTextareaProps>;
    private handleInput;
    private handleFocus;
    private handleBlur;
    private handleConfirm;
    private handleLinechange;
    render(): JSX.Element;
}
