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

//export const handleMouseOver = jest.fn();
//export const handleSyncMethod = jest.fn();

const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
      return (
         <div style={{ backgroundColor: Colors.white, padding: 8 }}>
            <p>{`${label}`}</p>
            <p
               style={{ color: Colors.cumSum, margin: 2 }}
            >{`${payload[0].name} : \u20B9 ${payload[0].value}`}</p>
         </div>
      );
   }

   return null;
};

export const CumSumChart = (cumSumData) => {
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
                  data={cumSumData.data}
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
                     data-testid='tooltip-1'
                  />{' '}
                  <Legend
                     layout='horizontal'
                     align='center'
                     wrapperStyle={{
                        position: 'relative',
                     }}
                  />
                  <Bar
                     dataKey='CumSum'
                     barSize={160}
                     fill={Colors.cumSum}
                     syncId='test'
                  />
                  <Line
                     type='monotone'
                     dataKey='CumSum'
                     stroke={Colors.cumSum}
                     strokeWidth={3}
                     syncId='test'
                  />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
};
