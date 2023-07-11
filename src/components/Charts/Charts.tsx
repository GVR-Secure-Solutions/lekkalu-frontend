/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState, useEffect } from 'react';
import swal from 'sweetalert';

import { WeeklyChart } from './WeeklyChart';
import BeatLoader from 'react-spinners/BeatLoader';
import Colors from '../../constants/colors';
import { SpentBalanceChart } from './SpentBalanceChart';
import { CumSumChart } from './CumSumChart';
import { AssetsLiabilitiesChart } from './AssetsLiabilitiesChart';
import {
  useGetMonthlyExpense,
  useGetAssets,
  useGetWeeklyExpense,
  useGetLiabilities,
} from '../../utils/hooks';
import { MONTH_NAMES } from '../../utils/constant';

interface MonthlyExpenseProps {
  name: string;
  Spent: number;
  Balance: number;
  CumSum: number;
}
interface AssetsProps {
  name: string;
  value: number;
}

interface WeeklyExpenseProps {
  time: string;
  amount: number;
  roll_avg?: number;
}

interface LiabilitiesProps {
  name: string;
  value: string | number;
}

interface LiabilitiesResponseData {
  balance: string;
  closure_charges: string;
  disbursement_date: string;
  emi: string;
  emi_day: number;
  id: number;
  interest_rate: string;
  name: string;
  principal: string;
  tenure: number;
  user: number;
}

const Charts = () => {
  // monthly expense
  const [finalMonthlyExp, setFinalMonthlyExp] = useState<MonthlyExpenseProps[]>(
    [],
  );
  // weekly expense
  const [finalWeeklyExp, setFinalWeeklyExp] = useState<WeeklyExpenseProps[]>(
    [],
  );
  // assets
  const [finalAssets, setFinalAssets] = useState<AssetsProps[]>([]);
  const [totalValue, setTotalValue] = useState<number>();

  //liabilities
  const [finalLiabilities, setFinalLiabilities] = useState<LiabilitiesProps[]>(
    [],
  );
  const [totalLiabilitiesValue, setTotalLiabilitiesValue] = useState<number>();

  // Dedicated hooks
  const {
    monthlyExpense,
    loading: loadingMonthlyExpense,
    error: errorMonthlyExpense,
  } = useGetMonthlyExpense();
  const { assets, loading: loadingAssets, error: errorAssets } = useGetAssets();
  const {
    weeklyExpense,
    loading: loadingWeeklyExpense,
    error: errorWeeklyExpense,
  } = useGetWeeklyExpense();
  const {
    liabilities,
    loading: loadingLiabilities,
    error: errorLiabilities,
  } = useGetLiabilities();

  // handles manipulation on monthly expenses data
  useEffect(() => {
    const finalData: MonthlyExpenseProps[] = [];
    if (monthlyExpense) {
      monthlyExpense.map(
        (data: {
          year: number;
          spent: number;
          month: number;
          budget: number;
          balance: number;
          cum_sum: number;
        }) => {
          return finalData.push({
            name: MONTH_NAMES[data.month - 1],
            Spent: data.spent,
            Balance: data.balance,
            CumSum: data.cum_sum,
          });
        },
      );
    }

    setFinalMonthlyExp([...finalMonthlyExp, ...finalData]);
  }, [monthlyExpense]);

  // handles manipulation on assets data
  useEffect(() => {
    const finalData: AssetsProps[] = [];
    let totalData: number = 0;
    if (assets) {
      totalData = assets.reduce(
        (acc: number, data: { name: string; market_value: number }) => {
          finalData.push({
            name: data.name,
            value: data.market_value,
          });
          return acc + data.market_value;
        },
        0.000000001,
      );
    }
    setFinalAssets([...finalAssets, ...finalData]);
    setTotalValue(totalData);
  }, [assets]);

  // handles manipulation on weekly data
  useEffect(() => {
    const finalData: WeeklyExpenseProps[] = [];
    let totalAmount: number = 0;
    if (weeklyExpense) {
      weeklyExpense.map(
        (
          data: { year: number; week: number; total_amount: number },
          _idx: number,
        ) => {
          totalAmount += weeklyExpense[_idx].total_amount;
          if (finalData.length >= 4) {
            finalData.push({
              time: data.week.toString() + '_' + data.year.toString(),
              amount: data.total_amount,
              roll_avg: parseFloat((totalAmount / 5).toFixed(2)),
            });
            totalAmount = totalAmount - weeklyExpense[_idx - 4].total_amount;
          } else {
            finalData.push({
              time: data.week.toString() + '_' + data.year.toString(),
              amount: data.total_amount,
            });
          }
        },
        0,
      );
    }

    setFinalWeeklyExp([...finalWeeklyExp, ...finalData]);
    console.log('total amount', totalAmount);
  }, [weeklyExpense]);

  // handles manipulation on liabilities data
  useEffect(() => {
    const finalData: LiabilitiesProps[] = [];
    let totalData: number = 0;
    if (liabilities) {
      totalData = liabilities.reduce(
        (acc: number, data: LiabilitiesResponseData) => {
          finalData.push({
            name: data.name,
            value: parseFloat(data.balance),
          });
          return acc + Number(data.balance);
        },
        0.000000001,
      );
    }
    setFinalLiabilities([...finalLiabilities, ...finalData]);
    setTotalLiabilitiesValue(totalData);
  }, [liabilities]);

  console.log('final Monthly expense', finalMonthlyExp);
  console.log('final weekly expense', finalWeeklyExp);
  console.log('assets', finalAssets);
  console.log('liabilities', finalLiabilities);

  if (
    errorAssets ||
    errorLiabilities ||
    errorMonthlyExpense ||
    errorWeeklyExpense
  ) {
    swal({
      title: 'Error',
      text: 'Failed to log in',
      icon: 'error',
    });
    return <></>;
  } else {
    return (
      <div className="w-full flex justify-center items-center flex-col relative">
        {/* weeklyExpense */}
        {loadingWeeklyExpense ? (
          <div className="w-1/2 bg-black mx-auto py-8 my-4 flex justify-center">
            <BeatLoader color={Colors.loaderColor} />
          </div>
        ) : (
          <WeeklyChart data={finalWeeklyExp} />
        )}
        {/* monthlyExpense */}
        {loadingMonthlyExpense ? (
          <div className="w-1/2 bg-black mx-auto py-8 my-4 flex justify-center">
            <BeatLoader color={Colors.loaderColor} />
          </div>
        ) : (
          <>
            <SpentBalanceChart data={finalMonthlyExp} />
            <CumSumChart data={finalMonthlyExp} />
          </>
        )}
        {/* Assets */}
        {loadingAssets ? (
          <div className="w-1/2 bg-black mx-auto py-8 my-4 flex justify-center">
            <BeatLoader color={Colors.loaderColor} />
          </div>
        ) : (
          <AssetsLiabilitiesChart
            data={{ totalVal: totalValue, finalAssets: finalAssets }}
            type={'assets'}
          />
        )}
        {/* Liabilities */}
        {loadingLiabilities ? (
          <div className="w-1/2 bg-black mx-auto py-8 my-4 flex justify-center">
            <BeatLoader color={Colors.loaderColor} />
          </div>
        ) : (
          <AssetsLiabilitiesChart
            data={{
              totalVal: totalLiabilitiesValue,
              finalLiabilities: finalLiabilities,
            }}
            type={'liabilities'}
          />
        )}
      </div>
    );
  }
};

export default Charts;
