export const goalsData = [
    createData(0, '', 'Get Gross Debt Free', 0, -2665931, -2665931, undefined, 0.0, undefined, undefined, undefined,'higher'),
    createData(1, '', 'Reach Equity of 6 months of your current total income', 1333800, 2665931, -1332131, -13, -1.1, undefined, undefined, undefined,'higher'),
    createData(2, '', 'Investment should be >25%', '25.0%', '12.7%', '12.3%', undefined, undefined, '2022-05-05', '2022-12-01', '2022-05-05','higher'),
    createData(3, '', 'Net cash reserve of 3 months of your current total income', 666900, 672127, -5227, 0, 0.0, '2021-11-01', undefined, '2022-05-01','higher'),
    createData(4, 'Met/Criterion', '+', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,'higher'),
    createData(5, '1', 'Lent to be < 25% of Total Assets', '25.0%', '25.7%', '0.7%', 31, 2.6, '2022-05-02', undefined, '2022-05-02','higher'),
    createData(6, '2', 'Net cash reserve of 6 months of your current total income', 1333800, 672127, 661673, 26, 2.2, '2021-11-01', undefined, '2022-05-01','higher'),
    createData(7, 'Short Term', '+', undefined, undefined, undefined, undefined, 0.0, undefined, undefined, undefined,'higher'),
    createData(8, '1', 'NPA to be < 25% of Total Assets', '25.0%', '54.9%', '29.9%', undefined, 0.0, '2022-05-02', undefined, '2022-05-02','higher'),
    createData(9, '2', 'Alpha to be >2.5%', '2.5%', '-7.2%', '9.7%', undefined, 0.0, '2022-06-01', undefined, '2022-06-01','higher'),
    createData(10, '3', 'Ultimate Goal (Live 3 yrs without income)', 8002800, 2665931, 5336869, 55, 4.6, '2022-11-01', undefined, '2022-05-01','higher'),
    createData(11, '4', 'Get Net Debt Free', 0, 1675463, -1675463, 34, 2.8, '2021-11-01', undefined, '2022-05-01','higher'),
    createData(12, '5', 'Charity to be~25% of Income', '25%', undefined, '25%', undefined, 0.0, undefined, undefined, undefined,'higher'),
    createData(13, 'Long Term', '+', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,'higher'),
  
  ]
  
  function createData(id, goal, subGoal, targetMetric, current, balance, reachablitiyInMonths, reachabilityInYears, started, finished, plannedStart,preferredQuantity) {
    return { id, goal, subGoal, targetMetric, current, balance, reachablitiyInMonths, reachabilityInYears, started, finished, plannedStart,preferredQuantity };
  }
  