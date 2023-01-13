import React, { useState } from "react";
import "./ImageComponent.scss";
import { isNotEmpty } from "../../helpers";

type ImageComponentProps = {
    imageUrl?: string,
    isEditable: boolean,
    onChange: (value: string) => void,
}

const ImageComponent = ({ imageUrl, isEditable, onChange }: ImageComponentProps) => {
    const [_imageUrl, setImageUrl] = useState<string | undefined>(imageUrl);

    const onSubmitImageUrl = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);
    const onChangeImageUrl = (event: React.ChangeEvent<HTMLInputElement>) => setImageUrl(event.target.value);

    return (
        <div className="image-container">
            {isNotEmpty(_imageUrl) && <img className="image" src={imageUrl} alt="Is not available" />}
            {isEditable && (
                <input
                    className="image-input"
                    placeholder="Image URL"
                    type="text"
                    value={_imageUrl}
                    onChange={onChangeImageUrl}
                    onBlur={onSubmitImageUrl}
                />
            )}
        </div>
    )
}

export default ImageComponent;
