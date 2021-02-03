import { InferProps } from 'prop-types';
import React from 'react';
import { AtListItemProps } from '../../types/list';
export default class AtListItem extends React.Component<AtListItemProps> {
    static defaultProps: AtListItemProps;
    static propTypes: InferProps<AtListItemProps>;
    private handleClick;
    private handleSwitchClick;
    private handleSwitchChange;
    render(): JSX.Element;
}
