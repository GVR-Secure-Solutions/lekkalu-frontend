import React from "react";
import { IncomeStatementChart } from "../../Charts/IncomeStatementChart";
import styles from "./IncomeStatementSummary.module.css";
import StatsCard from "../stats-card/StatsCard";
import SourceCard from "../sources-card/SourceCard";

import Heading from "../../shared/heading/Heading";
import Add from "../add-card/AddCard";
import StatsAccordion from "../stats-accordion/StatsAccordion";
import { numDifferentiation } from "../../../utils/AppUtils";
const IncomeStatementSummary = ({
  incomeStatement,
  totalIncome,
  totalExpense,
  difference,
}) => {
  console.log({ totalIncome, totalExpense });
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let incomeOverviewData = [];
  const typesOfIncome = [
    ...new Set(
      incomeStatement.income
        .filter((each) => each.type)
        .map((each) => each.type)
    ),
  ];
  console.log({ typesOfIncome });
  typesOfIncome.map((eachType) => {
    let sumOfType = incomeStatement.income
      .filter((each) => each.type === eachType)
      .reduce((sum, each) => sum + each.value, 0);
    incomeOverviewData.push({ name: eachType, value: sumOfType });
  });

  let expenseOverviewData = [];
  const typesOfExpense = [
    ...new Set(
      incomeStatement.expenses
        .filter((each) => each.type)
        .map((each) => each.type)
    ),
  ];
  console.log({ typesOfExpense });
  typesOfExpense.map((eachType) => {
    let sumOfType = incomeStatement.expenses
      .filter((each) => each.type === eachType)
      .reduce((sum, each) => sum + each.value, 0);
    expenseOverviewData.push({ name: eachType, value: sumOfType });
  });

  return (
    <div className={styles.container}>
      <div className={styles.statsContainer}>
        <StatsAccordion
          label="Income Overview"
          expanded={expanded}
          handleChange={handleChange}
        >
          <div className={styles.statsBar}>
            <div style={{ width: "100%" }}>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Total Income{" : "}
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#00b208",
                }}
              >
                {numDifferentiation(totalIncome)}₹
              </span>
            </div>
            <div style={{ width: "100%" }}>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Sources{" : "}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <Add label="Add Source" />
                <div className={styles.horizontalScroll}>
                  {incomeOverviewData.map((each, idx) => {
                    return (
                      <SourceCard
                        key={each.name + each.value + idx}
                        label={each.name}
                        value={`${numDifferentiation(each.value)}₹`}
                        bg="#00b208"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </StatsAccordion>
        <StatsAccordion
          label="Expense Overview"
          expanded={expanded}
          handleChange={handleChange}
        >
          <div className={styles.statsBar}>
            <div>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Total Expense{" : "}
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#fa4646",
                }}
              >
                {numDifferentiation(totalExpense)}₹
              </span>
            </div>
            <div>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                Sources{" : "}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <Add label="Add Source" />
                <div className={styles.horizontalScroll}>
                  {expenseOverviewData.map((each) => {
                    return (
                      <SourceCard
                        label={each.name}
                        value={`${numDifferentiation(each.value)}₹`}
                        bg="#fa4646"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </StatsAccordion>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartWrapper}>
          <IncomeStatementChart
            type="income-overview"
            data={incomeStatement}
            totalVal={totalIncome}
            incomeOverviewData={incomeOverviewData}
            details={true}
          />
        </div>
        <div className={styles.chartWrapper}>
          <IncomeStatementChart
            type="expense-overview"
            data={incomeStatement}
            totalVal={totalExpense}
            expenseOverviewData={expenseOverviewData}
            details={true}
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeStatementSummary;
