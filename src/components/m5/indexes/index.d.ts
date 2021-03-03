import { InferProps } from 'prop-types';
import React from 'react';
import { AtIndexesProps, AtIndexesState } from '../types/indexes';
export default class AtIndexes extends React.Component<AtIndexesProps, AtIndexesState> {
    static defaultProps: AtIndexesProps;
    static propTypes: InferProps<AtIndexesProps>;
    private menuHeight;
    private startTop;
    private itemHeight;
    private currentIndex;
    private listId;
    private timeoutTimer;
    private listRef;
    constructor(props: AtIndexesProps);
    private handleClick;
    private handleTouchMove;
    private handleTouchEnd;
    private jumpTarget;
    private __jumpTarget;
    private updateState;
    private initData;
    private handleScroll;
    UNSAFE_componentWillReceiveProps(nextProps: AtIndexesProps): void;
    componentDidMount(): void;
    UNSAFE_componentWillMount(): void;
    render(): JSX.Element;
}
