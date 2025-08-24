import { CarpoolListData } from '../schema/types';

type DriverRowProps = {
    carpool: CarpoolListData
    onClick?: () => void
    userLatitude: number;
    userLongitude: number;
};

const DriverRow = ( {carpool, onClick, userLatitude, userLongitude}: DriverRowProps) => {

    // Function to calculate distance between two coordinates using Haversine formula
    function distance(lat1: number, lon1: number, lat2: number, lon2: number): string {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number(R * c).toFixed(1); // Distance in kilometers
    }

    return (
        <div onClick={onClick} className='flex flex-row w-full max-w-6xl pb-1 hover:bg-[#2C3E50] dark:hover:bg-[#3498DB] hover:text-white cursor-pointer'>
            <div className='w-[60%] px-4 py-1'>
                <p className="text-left truncate"> {carpool.firstName} {carpool.lastName}</p>
            </div>
            <div className='w-[20%] px-4 py-1'>
                <p className="text-left truncate">{carpool.seatsAvailable}</p>
            </div>
            <div className='w-[20%] px-4 py-1'>
                <p className="text-left truncate ">{distance(carpool.latitude, carpool.longitude, userLatitude, userLongitude)} </p>
            </div>
        </div>
    )
}

export default DriverRow