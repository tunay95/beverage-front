import React, { useState, useEffect } from "react";
import "./cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, newQty) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const delivery = 100;
  const total = subtotal + delivery;

  return (
    <div className="cart-page">
      <h1 className="cart-title">МОЯ КОРЗИНА</h1>

      <div className="cart-container">
        <div className="cart-table">

          <div className="cart-header">
            <div className="col-product header-label">ТОВАР</div>
            <div className="col-price header-label">ЦЕНА</div>
            <div className="col-qty header-label">КОЛИЧЕСТВО</div>
            <div className="col-total header-label">ВСЕГО</div>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty">Корзина пуста...</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-row">

                <div className="col-product">
                  <div className="cart-product-info">

                    <div className="cart-product-img">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>

                    <div className="cart-product-text">
                      <h3>{item.name}</h3>
                      <p>
                        {item.year} / {item.volume || "0.75 L"} •{" "}
                        {item.country || "ФРАНЦИЯ"}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="col-price">
                  {item.price.toLocaleString("ru-RU")} Р
                </div>

                <div className="col-qty">
                  <div className="quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="col-total">
                  {(item.price * item.quantity).toLocaleString("ru-RU")} Р
                  <button className="remove" onClick={() => removeItem(item.id)}>
                    ✖
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sağ tərəf */}
        <div className="cart-summary">
          <h3>ПРОДОЛЖИТЬ ПОКУПКИ</h3>

          <div className="summary-line">
            <span>Сумма</span>
            <span>{subtotal.toLocaleString("ru-RU")} Р</span>
          </div>

          <div className="summary-line">
            <span>Скидка</span>
            <span>0 Р</span>
          </div>

          <div className="summary-line">
            <span>Доставка</span>
            <span>{delivery.toLocaleString("ru-RU")} Р</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>К оплате</span>
            <span>{total.toLocaleString("ru-RU")} Р</span>
          </div>

          <button className="checkout-btn">ОФОРМИТЬ ЗАКАЗ</button>
        </div>
      </div>
    </div>
  );
}
