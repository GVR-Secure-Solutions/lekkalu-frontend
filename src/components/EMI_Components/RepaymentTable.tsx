import React from "react";

export interface RepaymentTableProps {
  month: number;
  principal: number;
  interest: number;
  total_payment: number;
  outstandingPrincipal: number;
}

export interface Repayment {
  repaymentTable: RepaymentTableProps[];
}

const RepaymentTable: React.FC<Repayment> = ({ repaymentTable }) => {
  return (
    <table className="w-full text-center gap-2">
      <thead>
        <tr>
          <th className="py-[1rem] bg-[#ccc] border-[1px] border-solid border-[#ddd]">
            Month
          </th>
          <th className="py-[1rem] bg-[#ccc] border-[1px] border-solid border-[#ddd]">
            Principal
          </th>
          <th className="py-[1rem] bg-[#ccc] border-[1px] border-solid border-[#ddd]">
            Interest
          </th>
          <th className="py-[1rem] bg-[#ccc] border-[1px] border-solid border-[#ddd]">
            Total Payment
          </th>
          <th className="py-[1rem] bg-[#ccc] border-[1px] border-solid border-[#ddd]">
            Outstanding Principal
          </th>
        </tr>
      </thead>
      <tbody>
        {repaymentTable.map((record) => (
          <tr key={record.month}>
            <td className="py-[0.5rem] border-[1px] border-solid border-[#ddd]">
              {Math.abs(record.month)}
            </td>
            <td className="py-[0.5rem] border-[1px] border-solid border-[#ddd]">
              {Math.abs(record.principal)}
            </td>
            <td className="py-[0.5rem] border-[1px] border-solid border-[#ddd]">
              {Math.abs(record.interest)}
            </td>
            <td className="py-[0.5rem] border-[1px] border-solid border-[#ddd]">
              {Math.abs(record.total_payment)}
            </td>
            <td className="py-[0.5rem] border-[1px] border-solid border-[#ddd]">
              {Math.abs(record.outstandingPrincipal)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RepaymentTable;
