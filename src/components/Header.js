import spacexLogo from '../assets/image.png';

const Header = () => (
  <header className="py-4 bg-white border-b shadow text-center">
    <img src={spacexLogo} alt="SpaceX Logo" className="h-8 mx-auto" />
  </header>
);

export default Header;
