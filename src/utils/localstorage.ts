export const getData = (name: string) => {
    const data = localStorage.getItem(name)
    return data
}

export const setData = (name: string, value: string) => {
    localStorage.setItem(name, value)
}

export const deleteData = (name: string) => {
    localStorage.removeItem(name)
}

export const clearData = () => {
    localStorage.clear()
}
