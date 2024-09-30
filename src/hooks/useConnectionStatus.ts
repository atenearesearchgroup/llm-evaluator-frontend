import { useToast } from "@design/ui/use-toast";
import { useCallback, useEffect, useState} from "react";

// http://localhost:8080/actuator/health
const API_URL = import.meta.env.BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL
const URL = API_URL + '/actuator/health';


export const useConnectionStatus = () => {
   //const connection = useContext(ConnectionContext);
    const [wasConnected, setWasConnected] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    const { toast} = useToast();
    const checkConnection = useCallback(async () => {
        try {
            const response = await fetch(URL);
            const data = await response.json();
            setIsConnected(data.status === 'UP');
        } catch (error) {
            setIsConnected(false);
        }
    },[]);

    useEffect(() => {
        if(isConnected == wasConnected) return;

        let dismiss : () => void;

        if(isConnected) {
            dismiss =toast({
                title: 'Backend connection restored',
                variant: 'default',
                className: 'bg-green-500'
            }).dismiss
        } else {
            dismiss =toast({
                title: 'Backend connection lost',
                variant: 'destructive'
            }).dismiss
        }

        setWasConnected(isConnected);
        const clear = setTimeout(dismiss, 5000);

        return () => {
            if(dismiss) dismiss();
            clearTimeout(clear)
        };
    }, [isConnected]);

    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 5000);
        return () => clearInterval(interval);
    },[])

    return { isConnected};
}