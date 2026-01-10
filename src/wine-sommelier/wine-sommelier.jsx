import "./wine-sommelier.css";
import sommelier from "../assets/images/sommelier2.jpg";
import overlayShape from "../assets/images/Vector 6.png";

export default function WineSommelier() {
  return (
    <section className="wine-sommelier-section">
      <div className="wine-sommelier-container">
        <div className="wine-sommelier-image">
          <img src={sommelier} alt="Wine-Sommelier" className="wine-main-img" />
        </div>

        <div className="wine-sommelier-overlay">
          <img src={overlayShape} alt="overlay" className="wine-overlay-img" />
          <div className="wine-sommelier-text">
            <h4>Sommelier Choice</h4>
            <h2>SPECIAL PRICES FOR CORPORATE CLIENTS</h2>
            <p>LEARN MORE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
