import { FullProfileData } from '../schema/types';

type UserRowProps = {
    user: FullProfileData
    onClick?: () => void
};

const UserRow = ( {user, onClick}: UserRowProps) => {

    return (
        <div onClick={onClick} className='flex flex-row items-start justify-between p-2 mb-2 w-full'>
            <div className='flex flex-col items-center gap-2'>
                <p>{user.username}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <p>{user.email}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <p>{user.contactNumber}</p>
            </div>
        </div>
    )
}

export default UserRow