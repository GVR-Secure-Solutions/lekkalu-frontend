import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import {
  optionsPrincipal,
  optionsInterest,
  optionsMonth,
} from "components/EMI_Components/constant";
import {
  parseQueryString,
  handleShare,
  calculateEmiOutputs,
  calculateLoanPrincipalAndInterestPayable,
  isObjectEmpty,
} from "components/EMI_Components/utils";
import FormInput from "components/EMI_Components/FormInput";
import DisplayResult from "components/EMI_Components/DisplayResult";
import RepaymentTable from "components/EMI_Components/RepaymentTable";
import { AssetsLiabilitiesChart } from "../../components/Charts/AssetsLiabilitiesChart";

import "./EmiCalculator.css";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const defaultData = {
  loan_principal: 300000,
  loan_interest: 11,
  loan_tenure: 36,
  emi_day:5,
  disbursement_date: formattedDate,
};

const defaultResults = {
  loan_emi: "0",
  total_interest_payable: "0",
  total_payment: "0",
  repayment_table: [],
};

const EmiCalculator = () => {
  const location = useLocation();
  const parsedObject = parseQueryString(location.search);

  const [data, setData] = useState(
    !isObjectEmpty(parsedObject) ? parsedObject : defaultData
  );

  const [results, setResults] = useState(defaultResults);
  const [assets, setAssets] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = async () => {
    console.log("data", data);
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API}expenses/`, data, {
        auth: {
          username: process.env.REACT_APP_USER,
          password: process.env.REACT_APP_PASSWORD,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred during API call.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setResults(calculateEmiOutputs(data));
  }, [data]);

  useEffect(() => {
    setAssets(
      calculateLoanPrincipalAndInterestPayable(
        data?.loan_principal,
        results?.total_interest_payable
      )
    );
  }, [data, results]);

  const handleCopy = (data) => {
    setIsCopied(true);
    handleShare(data);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="container">
      <div className="buttons">
        <button className="save" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button className="save" onClick={() => handleCopy(data)}>
          {isCopied ? "Copied!" : "Share"}
        </button>
      </div>
      <div>
        <FormInput
          handleChange={handleChange}
          value={data.loan_principal}
          options={optionsPrincipal}
          name="loan_principal"
          type="number"
          label="Loan Principal"
          symbol="amount"
          min="0"
          max={"10000000"}
          step="100"
          tooltip="input the loan principal, amount you want to borrow"
          showSlider
        />
        <FormInput
          handleChange={handleChange}
          value={data.loan_interest}
          options={optionsInterest}
          name="loan_interest"
          type="number"
          label="Loan Interest"
          symbol="%"
          min="0"
          max={"100"}
          step="1"
          tooltip="input per cent interest per annum"
          showSlider
        />
      </div>
      <FormInput
        handleChange={handleChange}
        value={data.loan_tenure}
        options={optionsMonth}
        name="loan_tenure"
        type="number"
        label="Loan Tenure"
        symbol="Month"
        min="0"
        max={"240"}
        step="5"
        tooltip="how long do you want the loan for?"
        showSlider
      />

      <div>
        <FormInput
          handleChange={handleChange}
          value={data.disbursement_date}
          label="Disbursement Date"
          name="disbursement_date"
          type="date"
          symbol="Date"
          tooltip="input the Disbursement date for your loan"
        />
        <FormInput
          handleChange={handleChange}
          value={data.emi_day}
          name="emi_day"
          type="number"
          tooltip="input the EMI Day Number"
          symbol="EMI Day"
        />
      </div>
      <div className="output">
        <div className="output-text">
          <DisplayResult value={results?.loan_emi} label="Loan EMI" />
          <DisplayResult
            value={results?.total_interest_payable}
            label="Total Interest Payable"
          />
          <DisplayResult value={results?.total_payment} label="Total Payment" />
        </div>
        <div className="output-chart">
          {assets &&
            data.loan_principal &&
            data.loan_interest &&
            data.loan_tenure && (
              <AssetsLiabilitiesChart data={assets} type={"assets"} />
            )}
        </div>
      </div>

      <div className="table-container mb-10">
        {results?.repayment_table && results.repayment_table.length > 0 && (
          <RepaymentTable repaymentTable={results.repayment_table} />
        )}
      </div>
    </div>
  );
};

export default EmiCalculator;
