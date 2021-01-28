import { InferProps } from 'prop-types';
import React from 'react';
import { AtInputProps } from '../types/input';
export default class AtInput extends React.Component<AtInputProps> {
    static defaultProps: AtInputProps;
    static propTypes: InferProps<AtInputProps>;
    private inputClearing;
    private handleInput;
    private handleFocus;
    private handleBlur;
    private handleConfirm;
    private handleClick;
    private handleClearValue;
    private handleKeyboardHeightChange;
    private handleErrorClick;
    render(): JSX.Element;
}
