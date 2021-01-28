import { InferProps } from 'prop-types';
import React from 'react';
import { AtToastProps, AtToastState } from '../types/toast';
export default class AtToast extends React.Component<AtToastProps, AtToastState> {
    static defaultProps: AtToastProps;
    static propTypes: InferProps<AtToastProps>;
    private _timer;
    constructor(props: AtToastProps);
    private clearTimmer;
    private makeTimer;
    private close;
    private handleClose;
    private handleClick;
    UNSAFE_componentWillReceiveProps(nextProps: AtToastProps): void;
    render(): JSX.Element | null;
}
