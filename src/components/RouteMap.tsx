import axios from "axios";
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css";

type RouteMapProps = {
    userId:string,
    userName:string,
    token:string
}

const RouteMap: React.FC<RouteMapProps> = ({
    userId, 
    userName,
    token 
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [originLatitude, setOriginLatitude] = useState('');
    const [originLongitude, setOriginLongitude] = useState('');
    const [destinationLatitude, setDestinationLatitude] = useState('');
    const [destinationLongitude, setDestinationLongitude] = useState('');

    
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    async function getDriverLocation(token:string, userName:string, userId:string){

        try {
            const response = await axios.get(`${apiUrl}/mapRoute/driverLocation`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            const coordinates = response.data;
            setOriginLatitude(coordinates.driverLocation.latitude);
            setOriginLongitude(coordinates.driverLocation.longitude);
            setIsLoading(false);
        }catch(error){
            console.error(error)
            setIsLoading(false);
        }
    }

    
    useEffect(() => {
        
        getDriverLocation(token, userName, userId);

    },[token, userId, userName]);

    const mapsApiUrl = `https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${originLatitude},${originLongitude}&destination=place_id:ChIJV0AwM30rDogR2sd-X0cgErU`;
    
    if(isLoading) {
        return <p>...Loading Best Route</p>
    }

    return (
        <>
            <iframe width="600" height="450" loading="lazy" 
                src={mapsApiUrl} >
            </iframe>
        </>
    )
};

export default RouteMap;