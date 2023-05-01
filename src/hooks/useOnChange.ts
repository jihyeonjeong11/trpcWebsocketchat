import { useState } from 'react';
import type { ChangeEvent } from 'react';

export default function UseOnChange(initialValues: { [key: string]: string }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    values,
    setValues,
    handleChange,
  };
}
