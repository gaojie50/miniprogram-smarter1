import { InferProps } from 'prop-types';
import React from 'react';
import { AtActionSheetProps, AtActionSheetState } from '../types/action-sheet';
export default class AtActionSheet extends React.Component<AtActionSheetProps, AtActionSheetState> {
    static defaultProps: AtActionSheetProps;
    static propTypes: InferProps<AtActionSheetProps>;
    constructor(props: AtActionSheetProps);
    UNSAFE_componentWillReceiveProps(nextProps: AtActionSheetProps): void;
    private handleClose;
    private handleCancel;
    private close;
    private handleTouchMove;
    render(): JSX.Element;
}
