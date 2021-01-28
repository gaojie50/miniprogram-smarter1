import { InferProps } from 'prop-types';
import React from 'react';
import { AtModalProps, AtModalState } from '../types/modal';
export default class AtModal extends React.Component<AtModalProps, AtModalState> {
    static defaultProps: AtModalProps;
    static propTypes: InferProps<AtModalProps>;
    constructor(props: AtModalProps);
    UNSAFE_componentWillReceiveProps(nextProps: AtModalProps): void;
    private handleClickOverlay;
    private handleClose;
    private handleCancel;
    private handleConfirm;
    private handleTouchMove;
    render(): JSX.Element;
}
