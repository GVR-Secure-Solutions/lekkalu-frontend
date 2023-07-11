import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import {
  parseQueryString,
  handleShare,
  calculateEmiOutputs,
  calculateLoanPrincipalAndInterestPayable,
  isObjectEmpty,
} from '../../components/EMI_Components/utils';
import FormInput from '../../components/EMI_Components/FormInput';
import DisplayResult from '../../components/EMI_Components/DisplayResult';
import RepaymentTable from '../../components/EMI_Components/RepaymentTable';
import { AssetsLiabilitiesChart } from '../../components/Charts/AssetsLiabilitiesChart';

import { useLogin } from '../../utils/hooks/useLoginUser';

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

interface DefaultDataProps {
  loan_principal: string;
  loan_interest: string;
  loan_tenure: string;
  emi_day: string;
  disbursement_date: string;
}

interface DefaultResultsProps {
  loan_emi: string | number;
  total_interest_payable: string | number;
  total_payment: string | number;
  repayment_table: any;
}

const defaultData = {
  loan_principal: 300000,
  loan_interest: 11,
  loan_tenure: 36,
  emi_day: 5,
  disbursement_date: formattedDate,
};

const defaultResults = {
  loan_emi: '0',
  total_interest_payable: '0',
  total_payment: '0',
  repayment_table: [],
};

const EmiCalculator = () => {
  const { handleSubmit } = useLogin();
  const location = useLocation();
  const parsedObject = parseQueryString(location.search);

  const [data, setData] = useState<DefaultDataProps>(
    !isObjectEmpty(parsedObject) ? parsedObject : defaultData,
  );

  const [results, setResults] = useState<DefaultResultsProps>(defaultResults);
  const [assets, setAssets] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = async () => {
    // setIsLoading(true);
    // try {
    //   await axios.post(`${process.env.REACT_APP_API}expenses/`, data, {
    //     auth: {
    //       username: process.env.REACT_APP_USER as string,
    //       password: process.env.REACT_APP_PASSWORD as string,
    //     },
    //   });
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Error occurred during API call.');
    // } finally {
    //   setIsLoading(false);
    // }

    const auth = {
      username: 'reacter',
      password: 'p2dFqnu3@',
    };
    handleSubmit(auth);
  };

  useEffect(() => {
    let results = calculateEmiOutputs(data);
    setResults(results !== undefined ? results : defaultResults);
  }, [data]);

  useEffect(() => {
    setAssets(
      calculateLoanPrincipalAndInterestPayable(
        data?.loan_principal,
        results?.total_interest_payable,
      ),
    );
  }, [data, results]);

  const handleCopy = (data: any) => {
    setIsCopied(true);
    handleShare(data);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="w-full relative">
      <div className="w-[90%] mx-auto relative">
        <div className="w-full relative flex justify-between items-center">
          <button
            className="my-[1rem] py-[0.5rem] px-[2.5rem] outline-none border-none bg-blue-500 text-white font-bold"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            className="my-[1rem] py-[0.5rem] px-[2.5rem] outline-none border-none bg-blue-500 text-white font-bold"
            onClick={() => handleCopy(data)}
          >
            {isCopied ? 'Copied!' : 'Share'}
          </button>
        </div>
        <div className="w-full relative flex flex-col justify-between items-center md:flex-row ">
          <FormInput
            handleChange={handleChange}
            value={data.loan_principal}
            name="loan_principal"
            type="number"
            label="Loan Principal"
            symbol="amount"
            min="0"
            max={'10000000'}
            step="100"
            showSlider
          />
          <FormInput
            handleChange={handleChange}
            value={data.loan_interest}
            name="loan_interest"
            type="number"
            label="Loan Interest"
            symbol="%"
            min="0"
            max={'100'}
            step="1"
            showSlider
          />
        </div>
        <FormInput
          handleChange={handleChange}
          value={data.loan_tenure}
          name="loan_tenure"
          type="number"
          label="Loan Tenure"
          symbol="Month"
          min="0"
          max={'240'}
          step="5"
          showSlider
        />

        <div className="w-full relative flex flex-col justify-between items-center md:flex-row ">
          <FormInput
            handleChange={handleChange}
            value={data.disbursement_date}
            label="Disbursement Date"
            name="disbursement_date"
            type="date"
            symbol="Date"
          />
          <FormInput
            handleChange={handleChange}
            value={data.emi_day}
            label="EMI Day"
            name="emi_day"
            type="number"
            symbol="EMI Day"
          />
        </div>
        <div className="w-full flex justify-between items-center relative flex-col mt-[2rem] mb-[4rem] md:flex-row">
          <div className="w-full flex flex-col justify-center items-center md:w-1/2">
            <DisplayResult value={results?.loan_emi} label="Loan EMI" />
            <DisplayResult
              value={results?.total_interest_payable}
              label="Total Interest Payable"
            />
            <DisplayResult
              value={results?.total_payment}
              label="Total Payment"
            />
          </div>
          <div className="w-full relative m-auto md:w-2/5">
            {assets &&
              data.loan_principal &&
              data.loan_interest &&
              data.loan_tenure && (
                <AssetsLiabilitiesChart data={assets} type={'assets'} />
              )}
          </div>
        </div>

        <section className="w-full relative mb-[2rem]">
          {results?.repayment_table && results.repayment_table.length > 0 && (
            <RepaymentTable repaymentTable={results.repayment_table} />
          )}
        </section>
      </div>
    </div>
  );
};

export default EmiCalculator;
