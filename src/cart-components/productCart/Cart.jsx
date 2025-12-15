import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getUserCart, setUserCart } from "../../utils/userStorage";

import PaymentModal from "../payment/PaymentModal";

import "./cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getUserCart());
  }, []);

  useEffect(() => {
    const listener = () => setCartItems(getUserCart());
    window.addEventListener("cartUpdated", listener);
    return () => window.removeEventListener("cartUpdated", listener);
  }, []);

  const updateQuantity = (id, qty) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    );
    setCartItems(updated);
    setUserCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    setUserCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discountedSubtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.discountPrice ?? item.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount = originalSubtotal - discountedSubtotal;
  const delivery = 100;
  const total = discountedSubtotal + delivery;

  const openCheckout = () => {
    if (cartItems.length === 0) return;
    setIsPayOpen(true);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">MY CART</h1>

      <div className="cart-container">
        <div className="cart-table">
          <div className="cart-header">
            <div className="col-product header-label">PRODUCT</div>
            <div className="col-price header-label">PRICE</div>
            <div className="col-qty header-label">QUANTITY</div>
            <div className="col-total header-label">TOTAL</div>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty">The cart is empty...</p>
          ) : (
            cartItems.map((item) => {
              const unitPrice = item.discountPrice ?? item.price;
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={item.id} className="cart-row">
                  <div className="col-product">
                    <div
                      className="cart-product-info"
                      onClick={() => navigate(`/${item.category}/${item.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="cart-product-img">
                        <img src={item.imageUrl} alt={item.name} />
                      </div>

                      <div className="cart-product-text">
                        <h3>{item.name}</h3>
                        <p>
                          {item.year} / {item.volume || "0.75 L"} •{" "}
                          {item.country || "FRANCE"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-price">
                    {typeof item.discountPrice === "number" &&
                    item.discountPrice < item.price ? (
                      <>
                        <span className="old-price">
                          {item.price.toLocaleString("ru-RU")} Р
                        </span>
                        <span className="discount-price">
                          {item.discountPrice.toLocaleString("ru-RU")} Р
                        </span>
                      </>
                    ) : (
                      <span>{item.price.toLocaleString("ru-RU")} Р</span>
                    )}
                  </div>

                  <div className="col-qty">
                    <div className="quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-total">
                    {lineTotal.toLocaleString("ru-RU")} Р
                    <button
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-summary">
          <h3>CONTINUE SHOPPING</h3>

          <div className="summary-line">
            <span>Sum</span>
            <span>{originalSubtotal.toLocaleString("ru-RU")} Р</span>
          </div>

          <div className="summary-line">
            <span>Discount</span>
            <span>
              {discountAmount > 0
                ? `- ${discountAmount.toLocaleString("ru-RU")} Р`
                : "0 Р"}
            </span>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <span>{delivery.toLocaleString("ru-RU")} Р</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>For payment</span>
            <span>{total.toLocaleString("ru-RU")} Р</span>
          </div>

          <button className="checkout-btn" onClick={openCheckout}>
            PLACE AN ORDER
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        cartItems={cartItems}
        subtotal={originalSubtotal}
        delivery={delivery}
        total={total}
        onSuccess={() => {
          setCartItems([]);
          setUserCart([]);
          window.dispatchEvent(new Event("cartUpdated"));
        }}
      />
    </div>
  );
}
