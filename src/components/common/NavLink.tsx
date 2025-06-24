import { Link } from 'react-router-dom';

// Define the props for the NavLink component
// btnText: string; // The text to display on the button
// navTo: string; // The URL to navigate to when the button is clicked
interface NavHeaderLinkProps {
  btnText: string;
  navTo: string;
  className?: string; // Optional className for additional styling
}

const NavHeaderLink: React.FC<NavHeaderLinkProps> = ( {btnText, navTo, className} ) => {
  return (
    <Link className={className} to={navTo}>
        <button className={className}>{btnText}</button>
    </Link>
  );
}

export default NavHeaderLink;