// ak: Handy little technique I learned from https://www.smashingmagazine.com/2020/07/custom-react-hook-fetch-cache-data/
import {useState, useEffect} from 'react';
export function useFetch  (url, change?) {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!url) return;
        const fetchData = async () => {
            setStatus('fetching');
            const response = await fetch(url);
            const data =  await response.json();
            setData(data);
            setStatus('fetched');
        };

        fetchData();
    }, [url,change]);

    return { status, data };
};