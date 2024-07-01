import { useState, useEffect } from "react"

const useAppwrite = (fn) => {
    const [Data, setData] = useState([])
    const [isLoading, setisLoading] = useState(true)

    const fetchData = async () => {
        setisLoading(true)

        try {
            const response = await fn()
        } catch (error) {
            Alert.alert('Error', error.message)
        }
        finally {
            setisLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refetch = () => fetchData()

    return { Data, isLoading, refetch }
}

export default useAppwrite