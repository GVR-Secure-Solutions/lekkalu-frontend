import React from "react";

interface DisplayResultProps {
  value: string | number;
  label: string;
}

const DisplayResult: React.FC<DisplayResultProps> = ({ value, label }) => {
  const formatNumberWithCommas = (x: string | number) =>
    x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <section className="block font-light py-[1rem]">
      <h4 className="text-[14px] text-center">{label}</h4>
      <p className="text-[30px] text-center">
        {value ? `${formatNumberWithCommas(value)}` : "0"}
      </p>
    </section>
  );
};

export default DisplayResult;
