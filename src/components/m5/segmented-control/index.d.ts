import { InferProps } from 'prop-types';
import React from 'react';
import { AtSegmentedControlProps } from '../types/segmented-control';
export default class AtSegmentedControl extends React.Component<AtSegmentedControlProps> {
    static defaultProps: AtSegmentedControlProps;
    static propTypes: InferProps<AtSegmentedControlProps>;
    private handleClick;
    render(): JSX.Element;
}
