import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {
   ResponsiveContainer,
   ComposedChart,
   Line,
   Bar,
   CartesianGrid,
   XAxis,
   YAxis,
   Tooltip,
   Legend,
} from 'recharts';
import Colors from 'constants/colors';

const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
      return (
         <div
            className='sb-tooltip'
            style={{ backgroundColor: Colors.white, padding: 10 }}
         >
            <p className='sb-tooltip-month'>{`${label}`}</p>
            <p
               className='sb-tooltip-spent'
               style={{ color: Colors.orange }}
            >{`${payload[0].name} : \u20B9 ${payload[0].value}`}</p>
            <p
               className='sb-tooltip-balance'
               style={{ color: Colors.blue }}
            >{`${payload[2].name} : \u20B9 ${payload[2].value}`}</p>
         </div>
      );
   }

   return null;
};

export const SpentBalanceChart = (spentBalance) => {
   return (
      <div
         className='section-outer-wrapper col-md-8 mx-auto'
         style={{ backgroundColor: Colors.graphBG }}
      >
         <h3 className='section-title text-white text-center'>Monthly</h3>
         <div className='section-inner-wrapper'>
            <ResponsiveContainer width='100%' aspect={2}>
               <ComposedChart
                  width={500}
                  height={400}
                  data={spentBalance.data}
                  margin={{
                     top: 20,
                     right: 20,
                     bottom: 25,
                     left: 20,
                  }}
               >
                  <CartesianGrid
                     stroke={Colors.cartesianStroke}
                     strokeDasharray='0 0'
                     fill={Colors.graphBG}
                     vertical={false}
                  />
                  <XAxis dataKey='name' dy={10} tick={{ fill: Colors.white }} />
                  <YAxis
                     tickFormatter={(tick) => {
                        return `\u20B9${tick}`;
                     }}
                     tick={{ fill: Colors.white }}
                  />
                  <Tooltip
                     content={<CustomTooltip />}
                     cursor={{ fill: Colors.white }}
                  />
                  <Legend
                     layout='horizontal'
                     align='center'
                     wrapperStyle={{
                        position: 'relative',
                     }}
                  />
                  <Bar dataKey='Spent' barSize={150} fill={Colors.orange} />
                  <Line
                     type='monotone'
                     dataKey='Spent'
                     stroke={Colors.orange}
                     strokeWidth={2}
                  />
                  <Bar dataKey='Balance' barSize={150} fill={Colors.blue} />
                  <Line
                     type='monotone'
                     dataKey='Balance'
                     stroke={Colors.blue}
                     strokeWidth={2}
                  />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
};
