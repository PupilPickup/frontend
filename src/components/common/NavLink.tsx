import { Link } from 'react-router-dom';

// Define the props for the NavLink component
// btnText: string; // The text to display on the button
// navTo: string; // The URL to navigate to when the button is clicked
interface NavHeaderLinkProps {
  btnText: string;
  navTo: string;
}

const NavHeaderLink: React.FC<NavHeaderLinkProps> = ( {btnText, navTo} ) => {
  return (
    <Link className="" to={navTo}>
        <button className="">{btnText}</button>
    </Link>
  );
}

export default NavHeaderLink;