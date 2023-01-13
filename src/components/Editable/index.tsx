import React from "react";
import "./Editable.scss"

type EditableProps = {
    label?: string,
    value?: string,
    fieldType?: 'text' | 'textarea',
    showLabel?: boolean,
    isEditable?: boolean,
    type?: 'text' | 'number',
    onChange?: (value: string) => void,
}
// This might be extended to support ImageComponent and may be some more components
const Editable = ({
    label,
    value,
    fieldType = 'text',
    isEditable = false,
    showLabel = false,
    onChange = () => {},
    type = 'text'
}: EditableProps) => {
    const onChangeText = (event: any) => onChange(event.target.value)
    const getInputByType = (fieldType: any) => {
        if (fieldType === 'text') {
            return (
                <input
                    className="text-field"
                    type={type}
                    placeholder={label}
                    readOnly={!isEditable}
                    value={value}
                    onChange={onChangeText}
                />
            )
        }
        if (fieldType === 'textarea'){
            return (
                <textarea
                    className="textarea-field"
                    placeholder={label}
                    readOnly={!isEditable}
                    rows={5}
                    value={value}
                    onChange={onChangeText}
                />
            )
        }
        return null;
    }
    return (
        <div className="wrapper">
            {showLabel && <span className="label">{label}</span>}
            {getInputByType(fieldType)}
        </div>
    )
}

export default Editable
