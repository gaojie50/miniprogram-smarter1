import { InferProps } from 'prop-types';
import React from 'react';
import { AtGridProps } from '../types/grid';
export default class AtGrid extends React.Component<AtGridProps> {
    static defaultProps: AtGridProps;
    static propTypes: InferProps<AtGridProps>;
    private handleClick;
    render(): JSX.Element | null;
}
