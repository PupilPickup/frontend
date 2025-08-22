import { CarpoolListData } from '../schema/types';

type DriverRowProps = {
    carpool: CarpoolListData
    onClick?: () => void
    translations: any;
};

const DriverRow = ( {carpool, onClick, translations}: DriverRowProps) => {

    const adminRole:number  = Number(process.env.ROLE_ADMIN) || 1;
    const parentRole:number  = Number(process.env.ROLE_PARENT) || 2;
    const pendingParentRole: number = Number(process.env.ROLE_PENDING_PARENT) || 4;
    const driverRole: number = Number(process.env.ROLE_DRIVER) || 3;
    const pendingDriverRole: number = Number(process.env.ROLE_PENDING_DRIVER) || 5;
    // const noRole: number = Number(process.env.ROLE_ROLELESS_USER) || 6;
    const rejectedParentRole: number = Number(process.env.ROLE_REJECTED_PARENT) || 7;
    const rejectedDriverRole: number = Number(process.env.ROLE_REJECTED_DRIVER) || 8;

    function driverStatus(roles: number[]): string {
        if (roles.includes(driverRole)) {
            return translations.roles_and_statuses.approved;
        }else if (roles.includes(adminRole)) {
            return translations.roles_and_statuses.approved;
        }else if (roles.includes(pendingDriverRole)) {
            return translations.roles_and_statuses.pending;
        }else if (roles.includes(rejectedDriverRole)) {
            return translations.roles_and_statuses.rejected;
        }else {
            return translations.roles_and_statuses.not_applicable;
        }
    }

    function parentStatus(roles: number[]): string {
        if (roles.includes(parentRole)) {
            return translations.roles_and_statuses.approved;
        }else if (roles.includes(adminRole)) {
            return translations.roles_and_statuses.approved;
        }else if (roles.includes(pendingParentRole)) {
            return translations.roles_and_statuses.pending;
        }else if (roles.includes(rejectedParentRole)) {
            return translations.roles_and_statuses.rejected;
        }else {
            return translations.roles_and_statuses.not_applicable;
        }
    }

    return (
        <div onClick={onClick} className='flex flex-row w-full max-w-6xl pb-1 hover:bg-[#2C3E50] dark:hover:bg-[#3498DB] hover:text-white cursor-pointer'>
            <div className='w-[14%] px-4 py-1'>
                {/* <p className="text-left truncate"> {user.username}</p> */}
            </div>
            <div className='w-[30%] px-4 py-1'>
                {/* <p className="text-left truncate">{user.email}</p> */}
            </div>
            <div className='w-[20%] px-4 py-1'>
                {/* <p className="text-left truncate ">{user.firstName} {user.lastName}</p> */}
            </div>
            <div className='w-[12%] px-4 py-1'>
                {/* <p className="text-left  truncate">{user.contactNumber}</p> */}
            </div>
            <div className='w-[12%] px-4 py-1'>
                {/* <p className="text-left  truncate">{parentStatus(user.roles)}</p> */}
            </div>
            <div className='w-[12%] px-4 py-1'>
                {/* <p className="text-left  truncate">{driverStatus(user.roles)}</p> */}
            </div>
        </div>
    )
}

export default DriverRow