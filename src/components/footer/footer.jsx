import { useState } from "react";
import "./footer.css";
import footerImg from "../../assets/images/footer-wine.png";
import facebookIcon from "../../assets/images/facebook.png";
import instagramIcon from "../../assets/images/instagram.png";
import telegramIcon from "../../assets/images/telegram.png";
import { addAdminSubscriber } from "../../utils/adminStorage";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    addAdminSubscriber(trimmed);
    setEmail("");

    alert("Subscribed successfully!");
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-subscribe">
          <h3>SUBSCRIBE TO OUR EMAIL NEWSLETTER</h3>

          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SEND</button>
          </form>

          <div className="socials">
            <a href="#">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="#">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="#">
              <img src={telegramIcon} alt="Telegram" />
            </a>
          </div>
        </div>

        <div className="footer-image">
          <img src={footerImg} alt="wine" />
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <p>History</p>
            <p>Michel</p>
            <p>Vineyards</p>
          </div>

          <div>
            <h4>Shop</h4>
            <p>All Wines</p>
            <p>Single vineyard selection</p>
          </div>

          <div>
            <h4>The Wines</h4>
            <p>Hermitage in 3D</p>
            <p>The soul of M. CHAPOUTIER</p>
          </div>

          <div>
            <h4>Wine Tourism</h4>
            <p>Wine tasting services and visits</p>
            <p>Bike ride</p>
          </div>
        </div>

        <div className="footer-copy">
          <p>2021 winemill</p>
          <p>Privacy police</p>
        </div>
      </div>
    </footer>
  );
}
