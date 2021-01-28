import { InferProps } from 'prop-types';
import React from 'react';
import { AtSwitchProps } from '../types/switch';
export default class AtSwitch extends React.Component<AtSwitchProps> {
    static defaultProps: AtSwitchProps;
    static propTypes: InferProps<AtSwitchProps>;
    private handleChange;
    render(): JSX.Element;
}
