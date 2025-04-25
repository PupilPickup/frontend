interface CardLabelProps {
    label: string;
    data: string | number;
    className?: string;
}

const CardLabel: React.FC<CardLabelProps> = ( { label, data, className } ) => {

    return (
        <div className={`flex flex-row text-sm sm:text-base text-black m-1 p-2 space-x-2 ${className}`}>
            <p className="font-bold">{label}: </p>
            <p className="">{data}</p>
        </div>
    );
};

export default CardLabel;