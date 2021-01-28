import { InferProps } from 'prop-types';
import React from 'react';
import { AtActionSheetFooterProps } from '../../types/action-sheet';
export default class AtActionSheetFooter extends React.Component<AtActionSheetFooterProps> {
    static defaultProps: AtActionSheetFooterProps;
    static propTypes: InferProps<AtActionSheetFooterProps>;
    private handleClick;
    render(): JSX.Element;
}
