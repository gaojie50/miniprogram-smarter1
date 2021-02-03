import { InferProps } from 'prop-types';
import React from 'react';
import { AtPaginationProps, AtPaginationState } from '../types/pagination';
export default class AtPagination extends React.Component<AtPaginationProps, AtPaginationState> {
    static defaultProps: AtPaginationProps;
    static propTypes: InferProps<AtPaginationProps>;
    constructor(props: AtPaginationProps);
    private onPrev;
    private onNext;
    UNSAFE_componentWillReceiveProps(props: AtPaginationProps): void;
    render(): JSX.Element;
}
