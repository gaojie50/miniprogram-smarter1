import { InferProps } from 'prop-types';
import React from 'react';
import { AtNoticeBarProps, AtNoticeBarState } from '../types/noticebar';
export default class AtNoticebar extends React.Component<AtNoticeBarProps, AtNoticeBarState> {
    static defaultProps: AtNoticeBarProps;
    static propTypes: InferProps<AtNoticeBarProps>;
    private timeout;
    private interval;
    constructor(props: AtNoticeBarProps);
    private onClose;
    private onGotoMore;
    UNSAFE_componentWillReceiveProps(): void;
    componentDidMount(): void;
    private initAnimation;
    render(): JSX.Element | boolean;
}
