import { InferProps } from 'prop-types';
import React from 'react';
import { AtFabProps } from '../types/fab';
export default class AtFab extends React.Component<AtFabProps> {
    static defaultProps: AtFabProps;
    static propTypes: InferProps<AtFabProps>;
    private onClick;
    render(): JSX.Element;
}
