import { useState } from "react";

const useNumberField = ({ type, defValue = 0 }: any) => {
  const [value, setValue] = useState(defValue);

  const onChange = (val: number) => {
    setValue(val);
  };

  return {
    type,
    value,
    onChange,
  };
};

export default useNumberField;
