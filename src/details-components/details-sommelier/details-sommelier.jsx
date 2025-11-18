import "./details-sommelier.css";
import image1 from "../../assets/images/detailsSommelier1.png";
import image2 from "../../assets/images/detailsSommelier2.png";

export default function DetailsSommelier() {
  const features = [
    {
      id: 1,
      image: image1,
      title: "ЧТО ДЕЛАЕТ НАС ОСОБЕННЫМИ?",
      subtitle: "БЕСЕДА С СОМЕЛЬЕ",
    },
    {
      id: 2,
      image: image2,
      title: "ДЛЯ КОРПОРАТИВНЫХ КЛИЕНТОВ",
      subtitle: "СПЕЦИАЛЬНЫЕ ЦЕНЫ",
    },
  ];

  return (
    <section className="details-features-section">
      <div className="details-features-container">
        {features.map((feature) => (
          <div key={feature.id} className="details-feature-item">
            <img src={feature.image} alt={feature.title} />

            <div className="details-overlay">
              <p className="details-feature-title">{feature.title}</p>
              <h3 className="details-feature-subtitle">{feature.subtitle}</h3>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}
