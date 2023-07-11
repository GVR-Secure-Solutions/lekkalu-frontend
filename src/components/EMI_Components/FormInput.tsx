import React from "react";

interface FormInputProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  type: string;
  label: string;
  symbol: string;
  min?: string;
  max?: string;
  step?: string;
  showSlider?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  handleChange,
  value,
  name,
  type,
  label,
  symbol,
  min,
  max,
  step,
  showSlider,
}) => {
  return (
    <div className="w-full relative flex flex-col md:mr-[20px]">
      <div className="flex flex-col relative">
        {label && (
          <label htmlFor={name} className="whitespace-nowrap my-2">
            {label}
          </label>
        )}
        <div className="flex w-full relative border-[1px] border-solid border-[#ddd] mb-[1rem] border-r-0 p-0">
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            id={name}
            className="w-[80%] p-2 indent-2 focus:outline-none"
          />
          <span className="w-[20%] bg-[#ddd] text-center text-capitalize py-[9px]">
            {symbol}
          </span>
        </div>
        {showSlider && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            list={name}
            value={value}
            name={name}
            onChange={handleChange}
            className="cursor-pointer m-o p-0 h-[50px] bg-[#ccc] outline-none "
          />
        )}
      </div>
    </div>
  );
};

export default FormInput;
