interface CardLabelProps {
    label: string,
    data: string | number
}

const CardLabel: React.FC<CardLabelProps> = ( { label, data } ) => {

    return (
        <div>
            <p className="text-sm text-gray-600 font-bold">{label}: </p>
            <p className="text-sm text-gray-600">{data}</p>
        </div>
    );
};

export default CardLabel;