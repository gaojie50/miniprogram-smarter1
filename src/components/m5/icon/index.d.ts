import { InferProps } from 'prop-types';
import React from 'react';
import { AtIconProps } from '../types/icon';
export default class AtIcon extends React.Component<AtIconProps> {
    static defaultProps: AtIconProps;
    static propTypes: InferProps<AtIconProps>;
    private handleClick;
    render(): JSX.Element;
}
