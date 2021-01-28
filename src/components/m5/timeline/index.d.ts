import { InferProps } from 'prop-types';
import React from 'react';
import { AtTimelineProps } from '../types/timeline';
export default class AtTimeline extends React.Component<AtTimelineProps> {
    static defaultProps: AtTimelineProps;
    static propTypes: InferProps<AtTimelineProps>;
    render(): JSX.Element;
}
