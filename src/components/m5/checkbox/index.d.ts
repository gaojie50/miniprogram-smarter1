import { InferProps } from 'prop-types';
import React from 'react';
import { AtCheckboxProps } from '../types/checkbox';
export default class AtCheckbox extends React.Component<AtCheckboxProps<any>> {
    static defaultProps: AtCheckboxProps<any>;
    static propTypes: InferProps<AtCheckboxProps<any>>;
    private handleClick;
    render(): JSX.Element;
}
