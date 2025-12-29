/*
== layouts/main.hbs
layout + routing 

Header
↓
Which page should render?
↓
Footer

*/
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useMemo } from "react";

import Home from "./pages/Home";
import CheckoutForm from "./components/DonationForm";
import Complete from "./pages/Complete";
import "./styles/App.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// Helper component so we can access route state before initalizing stripe checkout 
function CheckoutWrapper() {
    const location = useLocation();
    const priceID = location.state?.priceID;

    const clientSecretPromise = useMemo(() => {
        if (!priceID) return null;

        return fetch("/checkout/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceID }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.clientSecret) {
                    throw new Error(data.error || "No clientSecret returned");
                }
                return data.clientSecret;
            });
    }, [priceID]);

    if (!clientSecretPromise) {
        return <p>No donation selected.</p>;
    }

    return (
        <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
        >
            <CheckoutForm />
        </CheckoutProvider>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<CheckoutWrapper />} />
                <Route path="/complete" element={<Complete />} />
            </Routes>
        </BrowserRouter>
    );
}
