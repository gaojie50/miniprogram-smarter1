import { InferProps } from 'prop-types';
import React from 'react';
import { AtLoadMoreProps } from '../types/load-more';
export default class AtLoadMore extends React.Component<AtLoadMoreProps> {
    static defaultProps: AtLoadMoreProps;
    static propTypes: InferProps<AtLoadMoreProps>;
    private onClick;
    render(): JSX.Element;
}
