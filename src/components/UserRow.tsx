import { PartialProfileData } from '../schema/types';

type UserRowProps = {
    user: PartialProfileData
    onClick?: () => void
};

const UserRow = ( {user, onClick}: UserRowProps) => {

    return (
        <div onClick={onClick} className='flex flex-row w-full max-w-6xl pb-1 hover:bg-[#2C3E50] dark:hover:bg-[#3498DB] hover:text-white cursor-pointer'>
            <div className='w-[20%] px-4 py-1'>
                <p className="text-left whitespace-nowrap"> {user.username}</p>
            </div>
            <div className='w-[30%] px-4 py-1'>
                <p className="text-leftwhitespace-nowrap">{user.email}</p>
            </div>
            <div className='w-[30%] px-4 py-1'>
                <p className="text-left whitespace-nowrap">{user.firstName} {user.lastName}</p>
            </div>
            <div className='w-[20%] px-4 py-1'>
                <p className="text-left whitespace-nowrap">{user.contactNumber}</p>
            </div>
        </div>
    )
}

export default UserRow