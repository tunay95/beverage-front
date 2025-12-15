import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/Logo.png";
import { getUserCart } from "../../utils/userStorage";
import { Search, ShoppingBasket, Heart } from "lucide-react";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const calcCartCount = () => {
      try {
        const cart = getUserCart();
        const count = (cart || []).reduce(
          (acc, item) => acc + (Number(item?.quantity) || 1),
          0
        );
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    calcCartCount();

    window.addEventListener("cartUpdated", calcCartCount);
    window.addEventListener("storage", calcCartCount);

    return () => {
      window.removeEventListener("cartUpdated", calcCartCount);
      window.removeEventListener("storage", calcCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropDown = () => setDropDown(!dropDown);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUser(null);
    setDropDown(false);
    navigate("/auth/login");
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">

        <Link to="/" className="logo-link">
          <img src={logo} className="logo-img" />
          <span className="logo-text">Wine mill</span>
        </Link>

        <div className="navbar-center">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              className="navbar-search"
              value={query}
              onChange={handleChange}
            />
            <button className="search-btn">
              <Search />
            </button>
          </div>
        </div>

        <div className="navbar-right">
          {isLoggedIn && (
            <Link to="/cart" className="navbar-cart">
              <ShoppingBasket />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/favourite" className="navbar-heart">
              <Heart className="heart-icon" />
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/auth/register"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Register
              </NavLink>
            </>
          )}


          {isLoggedIn && (
            <div className="avatar-container" onClick={toggleDropDown}>
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {dropDown && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="burger" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <nav className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/wine"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Wine
        </NavLink>

        <NavLink
          to="/whiskey"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Whiskey
        </NavLink>

        <NavLink
          to="/cognac"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Cognac
        </NavLink>

        <NavLink
          to="/vodka"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Vodka
        </NavLink>
      </nav>
    </header>
  );
}
