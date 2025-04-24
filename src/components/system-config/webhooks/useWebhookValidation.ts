
import { useState } from "react";

export const useWebhookValidation = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);

  const validateURL = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validateURL(newValue));
  };

  return {
    value,
    isValid,
    handleChange,
  };
};
