import Help from "../../assets/icons/info.svg";
import Tooltip from "./Tooltip";

interface HelpTipProps {
    content: string;
    position?: "top" | "bottom" | "left" | "right";
    altText: string;
}

const HelpTip: React.FC<HelpTipProps> = ({ content, altText, position = "right" }) => {


  return (
        <div className="flex items-start justify-start w-full">
            <Tooltip content={content} position={position}>
                <span className="inline-block cursor-pointer">
                    <img src={Help} alt={altText} className="w-6 h-6" />
                </span>
            </Tooltip>
        </div>
  );
};

export default HelpTip;