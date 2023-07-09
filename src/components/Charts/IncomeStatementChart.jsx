import Colors from "constants/colors";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols,
} from "recharts";
import styles from "./IncomeStatementChart.module.css";
import useWindowDimensions from "hooks/useWindowDimensions";
export const IncomeStatementChart = (props) => {
  const size = useWindowDimensions();
  let totalValue = props.totalVal;
  let pieData;
  if (props.type == "income") {
    pieData = props.data.income;
  } else if (props.type == "expenses") {
    pieData = props.data.expenses;
  } else if (props.type == "income-overview") {
    pieData = props.incomeOverviewData;
  } else if (props.type == "expense-overview") {
    pieData = props.expenseOverviewData;
  }
  // const pieData = [
  //    {
  //       name: 'Thar',
  //       value: 1093719,
  //    },
  //    {
  //       name: 'Home Security',
  //       value: 55000,
  //    },
  //    {
  //       name: 'PF',
  //       value: 1000454,
  //    },
  //    {
  //       name: 'Pension',
  //       value: 45000,
  //    },
  //    {
  //       name: 'ELSS',
  //       value: 233000,
  //    },
  //    {
  //       name: 'Equity',
  //       value: 15000,
  //    },
  //    {
  //       name: 'Cash',
  //       value: 106000,
  //    },
  //    {
  //       name: 'Gold',
  //       value: 286664,
  //    },
  //    {
  //       name: 'Liquid Funds',
  //       value: 10000,
  //    },
  //    {
  //       name: 'Lent',
  //       value: 1105013,
  //    },
  // ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent * 100 > 3)
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      );
    return null;
  };

  const numDifferentiation = (val) => {
    if (val >= 10000000) val = (val / 10000000).toFixed(2) + " Cr";
    else if (val >= 100000) val = (val / 100000).toFixed(2) + " Lac";
    else if (val >= 1000) val = (val / 1000).toFixed(2) + " K";
    return val;
  };

  const CustomTooltip = ({ active, payload, percent }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "0.5px solid #cccc",
            borderRadius: 5 + "px",
          }}
        >
          {(props.type == "income-overview") & props?.details ? (
            <div className={styles.mainTooltip}>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      Colors.PIE[
                        pieData.map((e) => e.name).indexOf(payload[0].name)
                      ].end,
                  }}
                >
                  {`${payload[0].name} : `}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#fa4646",
                  }}
                >{`\u20B9 ${numDifferentiation(payload[0].value)} `}</span>
              </label>
              <div className={styles.detailsContainer}>
                {props.data.income
                  ?.filter((each) => each?.type === payload[0].name)
                  ?.map((each) => {
                    return (
                      <div style={{ width: "100%" }}>
                        <p style={{ width: "100%", lineHeight: "0.5rem" }}>
                          <span style={{ fontWeight: 600 }}>
                            {each?.name} :
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            {`\u20B9 ${numDifferentiation(each.value)} `}
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (props.type == "expense-overview") & props?.details ? (
            <div className={styles.mainTooltip}>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      Colors.PIE[
                        pieData.map((e) => e.name).indexOf(payload[0].name)
                      ].end,
                  }}
                >
                  {`${payload[0].name} : `}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#fa4646",
                  }}
                >{`\u20B9 ${numDifferentiation(payload[0].value)} `}</span>
              </label>
              <div className={styles.detailsContainer}>
                {props.data.expenses
                  ?.filter((each) => each?.type === payload[0].name)
                  ?.map((each) => {
                    return (
                      <div style={{ width: "100%" }}>
                        <p style={{ width: "100%", lineHeight: "0.5rem" }}>
                          <span style={{ fontWeight: 600 }}>
                            {each?.name} :
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            {`\u20B9 ${numDifferentiation(each.value)} `}
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <label>
              {`${payload[0].name} : ` +
                ((`${payload[0].value}` * 100) / totalValue).toFixed(2) +
                "%"}
              <br />
              {`\u20B9 ${numDifferentiation(payload[0].value)} `}
            </label>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {pieData && pieData.length !== 0 ? (
        <div className="section-outer-wrapper col-md-9 mx-auto">
          <ResponsiveContainer width="100%" aspect={size.width <= 1024 ? 2 : 3}>
            <PieChart>
              <defs>
                {pieData.map((entry, index) => (
                  <linearGradient
                    id={`myGradient${index}`}
                    key={`myGradient${index}`}
                  >
                    <stop
                      offset="0%"
                      stopColor={Colors.PIE[index % Colors.PIE.length].start}
                    />
                    <stop
                      offset="100%"
                      stopColor={Colors.PIE[index % Colors.PIE.length].end}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                color="#000000"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                fill="#8884d8"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {/* {pieData.map((entry, index) => (
                  <Cell
                     key={`cell-${index}`}
                     fill={COLORS[index % COLORS.length]}
                  />
               ))} */}

                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#myGradient${index})`}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout={size.width <= 1024 ? "horizontal" : "vertical"}
                verticalAlign="top"
                align={size.width <= 1024 ? "center" : "right"}
                payload={pieData.map((item, index) => ({
                  id: item.name,
                  type: "square",
                  value:
                    item.name +
                    ` : ` +
                    ((item.value * 100) / totalValue).toFixed(2) +
                    `%`,
                  color: `url(#myGradient${index})`,
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <h4>No data for {props.type} chart</h4>
      )}
    </>
  );
};
