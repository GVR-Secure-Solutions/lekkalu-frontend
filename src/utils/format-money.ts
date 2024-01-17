export const formatIndianMoneyNotation = (num = 0, fixed = 2): string => {
  const absNum = Math.abs(num)

  if (absNum >= 10000000) {
    const crValue = absNum / 10000000
    const formattedValue = `${crValue.toFixed(fixed)} Cr`
    return num < 0 ? `-${formattedValue}` : formattedValue
  } else if (absNum >= 100000) {
    const lacsValue = absNum / 100000
    const formattedValue = `${lacsValue.toFixed(fixed)} Lacs`
    return num < 0 ? `-${formattedValue}` : formattedValue
  } else if (absNum >= 1000) {
    const kValue = absNum / 1000
    const formattedValue = `${kValue.toFixed(fixed)} K`
    return num < 0 ? `-${formattedValue}` : formattedValue
  } else {
    return num.toString()
  }
}
