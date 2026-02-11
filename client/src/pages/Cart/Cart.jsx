import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeCart, updateQuantity } from "../../redux/slice";
import { loadStripe } from "@stripe/stripe-js";
import Footer from "../../components/Footer";

function CartPage() {
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Calculate the total price of all items
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemove = (item) => {
    dispatch(removeCart(item));
  };

  const handleQuantityChange = (item, quantity) => {
    // Ensure quantity is not less than 1
    if (quantity < 1) return;
    dispatch(updateQuantity({ _id: item._id, quantity }));
  };

  const stripePromise = loadStripe(
    "pk_test_51R9irmRp8EKuZlqYGXVVbkJ8M7NaLhUTqOYd5xw0YpcYMSkrLXcyIr10Cha1su3I2d4Rg4PDd8wqJetzmIVx1Hzj00WM0Zr2m7"
  );

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/checkout`, {
        totalAmount,
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <>
      <div className="p-4 bg-[#fffbff]">
        {cartItems.length === 0 ? (
          <h2 className=" bg-cyan-100 flex justify-center items-center h-screen text-2xl font-semibold text-stone-800">
            Your cart is empty
          </h2>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border-b"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <p>{item.name}</p>
                  <p>Price: ${item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="py-1 px-3 bg-gray-200 text-gray-800 rounded"
                    >
                      -
                    </button>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="py-1 px-3 bg-gray-200 text-gray-800 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  className="ml-auto bg-red-600 text-white py-1 px-3 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-4 text-xl font-semibold">
              <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                className="bg-cyan-600 text-white py-2 px-4 rounded"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
