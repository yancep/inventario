import { Checkbox } from '@nextui-org/react';
import { FormikValues } from 'formik';
import React from 'react';

interface CustomCheckboxProps {
  form: FormikValues;
  fieldKey: string;
  label: string;
  isRequired: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  form,
  fieldKey,
  label,
  isRequired,
}) => {
  return (
    <div className="flex w-full flex-col">
      <label htmlFor={fieldKey} className="flex flex-row text-small text-foreground opacity-70">
        <Checkbox
          id={fieldKey}
          checked={form.values[fieldKey]}
          onChange={(e) => {
            form.setFieldValue(fieldKey, e.target.checked);
          }}
        />
        {label}
        {isRequired && <div className="text-danger">*</div>}
      </label>
    </div>
  );
};

export default CustomCheckbox;
