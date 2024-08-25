import { Input } from '@nextui-org/react';
import { FormikValues } from 'formik';
import React from 'react';

interface CustomTextInputProps {
  form: FormikValues;
  fieldKey: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  type?: InputType;
  startContent?: React.ReactNode | null;
  endContent?: React.ReactNode | null;
  maxLength?: number;
  disabled?: boolean;
}

type InputType =
  | 'text'
  | 'number'
  | 'search'
  | 'url'
  | 'tel'
  | 'email'
  | 'password'
  | 'date';

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  form,
  fieldKey,
  label,
  placeholder,
  isRequired,
  type = 'text',
  startContent,
  endContent,
  maxLength,
  disabled
}) => {
  return (
    <div className="flex w-full flex-col">
      <span className="flex flex-row text-small text-foreground opacity-70">
        {label}
        {isRequired && <div className="text-danger">*</div>}
      </span>
      <Input
        id={fieldKey}
        variant="bordered"
        size="sm"
        startContent={startContent ?? undefined}
        endContent={endContent ?? undefined}
        onBlur={form.handleBlur}
        color={form.errors[fieldKey] ? 'danger' : 'primary'}
        errorMessage={
          form.touched[fieldKey] && form.errors[fieldKey]
            ? form.errors[fieldKey]
            : null
        }
        maxLength={type === 'number' ? maxLength : 99999999}
        type={type}
        onChange={(e) => {
          form.handleChange(e);
          form.setFieldValue(fieldKey, e.target.value);
        }}
        value={form.values[fieldKey]}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomTextInput;
