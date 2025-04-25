interface CardLabelProps {
    label: string,
    data: string | number
}

const CardLabel: React.FC<CardLabelProps> = ( { label, data } ) => {

    return (
        <div className="flex flex-row text-sm sm:text-base text-black m-1 p-2 space-x-2">
            <p className="font-bold">{label}: </p>
            <p className="">{data}</p>
        </div>
    );
};

export default CardLabel;