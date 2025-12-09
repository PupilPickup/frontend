import axios from "axios";
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css";

//Props of user 
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
    const [isRetrievingLocations, setIsRetrievingLocations] = useState(true);
    const [childLocationsArray, setChildLocationsArray] = useState<MapCoordinate[]>([]);
    const [originLatitude, setOriginLatitude] = useState(0);
    const [originLongitude, setOriginLongitude] = useState(0);
    const [destinationLatitude, setDestinationLatitude] = useState(0);
    const [destinationLongitude, setDestinationLongitude] = useState(0);

    interface ServerLocation {
        user_id: string;
        latitude: number;
        longitude: number;
    }

    interface MapCoordinate {
        lat: number,
        lng: number,
        key: string
    }

    
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    //Google maps apiKey, collected from env file
    const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    //function to retrieve the location of the driver, set origin latitude and longitude to the drivers location
    //if the user is not a driver will not give location
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

    //TODO: Add function to retrieve children locations and set to destinationLatitude, destinationLongitude
    async function getChildLocation(token:string, userName:string, userId:string){

        try {
            const response = await axios.get(`${apiUrl}/mapRoute/childLocation`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            const locations: ServerLocation[] = response.data.accepted_child_locations || [];
            const coordinatesArray: MapCoordinate[] = locations.map((location: ServerLocation) => {
                return {
                    lat: location.latitude,
                    lng: location.longitude,
                    key: location.user_id
                }
            })
            setChildLocationsArray(coordinatesArray);
            setIsRetrievingLocations(true);
        }catch(error){
            console.error(error)
            setIsLoading(false);
        }
    }

    //function to add child location to the route map
    function handleAddLocationToRoute(locationSet: MapCoordinate){
        setDestinationLatitude(locationSet.lat);
        setDestinationLongitude(locationSet.lng);
        console.log(locationSet);
        setIsRetrievingLocations(false);
        setIsLoading(false);
    }

    
    useEffect(() => {
        
        getDriverLocation(token, userName, userId);
        getChildLocation(token, userName, userId);

    },[token, userId, userName]);

    //Google maps embed URL
    //need to add destinatinLatitude and destinationLongitude for destination instead of hardwired destination
    const mapsApiUrl = `https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${originLatitude},${originLongitude}&destination=${destinationLatitude},${destinationLongitude}`;
    
    if(isLoading) {
        return <p>...Loading Best Route</p>
    }

    if(isRetrievingLocations){
        return (
            <>
                {childLocationsArray.map((item, index) => (
                    <button onClick={() => handleAddLocationToRoute(item)}>Add child {item.key} to route</button>
                ))}
            </>
        )
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