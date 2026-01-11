import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";
import logo from "../../assets/images/Logo.png";
import { Search, ShoppingBasket, Heart } from "lucide-react";
import * as wishlistApi from "../../data/wishlistApi";
import * as orderApi from "../../data/orderApi";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, userSummary, logout } = useAuth();

  useEffect(() => {
    const calcCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }
      try {
        const cart = await orderApi.getCart();
        const count = (cart.items || []).reduce(
          (acc, item) => acc + (Number(item?.quantity) || 0),
          0
        );
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    const calcWishlistCount = async () => {
      if (!isAuthenticated) {
        setWishlistCount(0);
        return;
      }
      try {
        const count = await wishlistApi.getWishlistCount();
        setWishlistCount(count);
      } catch {
        setWishlistCount(0);
      }
    };

    calcCartCount();
    calcWishlistCount();

    window.addEventListener("cartUpdated", calcCartCount);
    window.addEventListener("wishlistUpdated", calcWishlistCount);

    return () => {
      window.removeEventListener("cartUpdated", calcCartCount);
      window.removeEventListener("wishlistUpdated", calcWishlistCount);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropDown = () => setDropDown(!dropDown);
  const toggleMobileSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  const handleLogout = () => {
    logout(true);
    setDropDown(false);
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
          <button className="mobile-search-toggle" onClick={toggleMobileSearch}>
            <Search />
          </button>

          {isAuthenticated && (
            <Link to="/cart" className="navbar-cart">
              <ShoppingBasket />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/favourite" className="navbar-heart">
              <Heart className="heart-icon" />
              {wishlistCount > 0 && <span className="wishlist-badge"></span>}
            </Link>
          )}

          {isAuthenticated && userSummary && userSummary.role === 'Admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active admin-panel-link" : "nav-link admin-panel-link"
              }
            >
              Admin Panel
            </NavLink>
          )}

          {!isAuthenticated && (
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          )}


          {isAuthenticated && userSummary && (
            <div className="avatar-container" onClick={toggleDropDown}>
              {userSummary.imageUrl ? (
                <img 
                  src={userSummary.imageUrl} 
                  alt={userSummary.username} 
                  className="avatar-image"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div className="avatar">
                  {(userSummary.username || userSummary.fullName)?.charAt(0).toUpperCase()}
                </div>
              )}

              {dropDown && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    {userSummary.fullName || userSummary.username}
                  </div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* <div className="burger" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </div> */}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="mobile-search-overlay" onClick={toggleMobileSearch}>
          <div className="mobile-search-container" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-search-box">
              <input
                type="text"
                placeholder="Search..."
                className="mobile-search-input"
                value={query}
                onChange={handleChange}
                autoFocus
              />
              <button className="mobile-search-btn" onClick={toggleMobileSearch}>
                <Search />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <nav className={`navbar-menu ${menuOpen ? "open" : ""}`}>
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
      </nav> */}
    </header>
  );
}
