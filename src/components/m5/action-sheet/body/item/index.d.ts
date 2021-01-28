import { InferProps } from 'prop-types';
import React from 'react';
import { AtActionSheetItemProps } from '../../../types/action-sheet';
export default class AtActionSheetItem extends React.Component<AtActionSheetItemProps> {
    static defaultProps: AtActionSheetItemProps;
    static propTypes: InferProps<AtActionSheetItemProps>;
    private handleClick;
    render(): JSX.Element;
}
