import { InferProps } from 'prop-types';
import React from 'react';
import { AtRadioProps } from '../types/radio';
export default class AtRadio extends React.Component<AtRadioProps<any>> {
    static defaultProps: AtRadioProps<any>;
    static propTypes: InferProps<AtRadioProps<any>>;
    private handleClick;
    render(): JSX.Element;
}
