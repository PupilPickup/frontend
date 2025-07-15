import React from 'react'
import Button from './common/Button'

type SubmitRolePermissionProps = {
    buttonLabel: string,
    promptLabel: string,
    clickHandler: () => void

};

export default function SubmitRolePermission( {buttonLabel, promptLabel, clickHandler}: SubmitRolePermissionProps ){

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <p className="text-center mt-4">{promptLabel}</p>
                <Button label={buttonLabel} variant='primary' onClick={clickHandler} />
            </div>
        </div>
    )
}