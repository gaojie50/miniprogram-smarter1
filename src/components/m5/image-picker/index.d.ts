import { InferProps } from 'prop-types';
import React from 'react';
import { AtImagePickerProps } from '../types/image-picker';
export default class AtImagePicker extends React.Component<AtImagePickerProps> {
    static defaultProps: AtImagePickerProps;
    static propTypes: InferProps<AtImagePickerProps>;
    private chooseFile;
    private handleImageClick;
    private handleRemoveImg;
    render(): JSX.Element;
}
