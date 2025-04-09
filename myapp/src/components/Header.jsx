import './Header.css';
import logo from '../imgs/logo.png';

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="MVP Burgers Logo" className="logo" />
      <nav className="nav">
        <ul className="nav-list">
          {
            // <li><a href="#home">HOME</a></li>
            // <li><a href="#menu">MENU</a></li>
            // <li><a href="#contact">CONTACT</a></li>
          }
        </ul>
        { /* <button className="order-button">ORDER NOW</button> */}
      </nav>
    </header>
  );
};

export default Header;
