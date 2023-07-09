import { LineChart, Line, Brush, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from "recharts"
import Colors from "constants/colors"
import { useEffect, useRef } from "react"
import { BarLoader } from "react-spinners"

export default function AssetsdepreciationChart({data}){
    const brushRef = useRef(undefined)

    if( !data || data.length===0 || data[0] === undefined){
        return(
            <h4>No data for depreciation chart</h4>
        )
    }

    const { depreciation_frequency, depreciation_percent, sell_date, sell_value, name, purchase_value, purchase_date } = data[0]
    let dataToShow = calculateDeprecationData(purchase_value, depreciation_frequency, depreciation_percent, sell_date, purchase_date, name, sell_value)

    const handlerTicketFormatter = (date)=>{

        let newDate
        if (brushRef.current && brushRef.current.props) {
            const { startIndex, endIndex } = brushRef.current.props;
            if (endIndex-startIndex>15) {
                newDate = date.slice(0, 4);
            }else if( endIndex-startIndex>6 ){
                 const getMonth = (dateNum)=>{
                    const months = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ];

                    const year = dateNum.slice(2,4)
                    const month = dateNum.slice(5,7)
                     
                    const num = parseInt(month)-1

                    return `${months[num]}/${year} `
                    
                }
                newDate = getMonth(date)
            }
          }
          return newDate || date;
    }

    return(
        <div className='section-outer-wrapper col-md-8  bg-red-400'  style={{ backgroundColor: Colors.graphBG }}>
            <h3 className='section-title text-white text-center'>Assets depreciation</h3>
            <ResponsiveContainer width='100%' aspect={2}>
                <LineChart  margin={{ top: 5, right: 0, bottom: 25, left: 10 }}  data={dataToShow} >
                    <Line dataKey='value' type='monotone'  name={`${name} value`}/>

                
                    <XAxis tickMargin={10} dataKey="data"  tick={{ fill: Colors.white }} tickFormatter={handlerTicketFormatter} />

                    <YAxis tickMargin={10} dataKey={"value"} type='category'  tickFormatter={(tick) => {
                        return `\u20B9${tick}`;
                     }} tick={{ fill: Colors.white }} reversed={true} />

                    <Legend
                     layout='horizontal'
                     verticalAlign='top'
                     align='center'
                  />
                    <Tooltip />
                    <Brush data='data' height={30} ref={brushRef}/>

                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}

const calculateDeprecationData = (purchaseValue, depreciation_frequency, deprecationPercent, sellDate, purchasedDate, active, sellValue) =>{
    const initalVal = parseFloat(purchaseValue)
    const sellVal = parseFloat(sellValue)

    const startDay = new Date(purchasedDate).getTime()
    const sellDay = new Date(sellDate).getTime()
    const usefulLifeoftheAssets = ( sellDay -startDay)/(1000*60*60*24)

    const daysOfDeprecation = Math.round(depreciation_frequency / 86400)

    const usefulLifePeriods = Math.round(usefulLifeoftheAssets/daysOfDeprecation)

    const depreciationPerPeriods = Math.round((initalVal - sellVal) / usefulLifePeriods)

    //Get points 
    let depreciationData = []

    let currentDate = new Date(startDay)
    let currentValue = initalVal
    for (let i = 0 ; i<=usefulLifePeriods ; i++){
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;

        depreciationData.push({data:shortDate(formattedDate), value:shortNumbers(currentValue)})

        currentValue -=depreciationPerPeriods
        currentDate.setDate(currentDate.getDate() + daysOfDeprecation);
    }
    console.log(depreciationData)
    return depreciationData
}

function shortNumbers(n){
    let x=(''+n).length;
    const p=Math.pow;
    const d=p(10,true);
    x-=x%3;
    return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3];
}
function shortDate (date){
    return date.replace('-', '/').replace('-', '/')
}
