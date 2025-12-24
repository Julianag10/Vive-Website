// == donation-form.hbs
// Partial: donation amount buttons + form
import { useState } from "react";
import { DONATION_TIERS } from "../config/donations";
import CheckoutWrapper from "./CheckoutWrapper";

export default function DonationForm() {
  const [selectedPriceID, setSelectedPriceID] = useState(null);

  return (
    <section>
      <h2>Support ViVe</h2>

      {!selectedPriceID && (
        <div>
          {DONATION_TIERS.map((tier) => (
            <button
              key={tier.priceID}
              onClick={() => setSelectedPriceID(tier.priceID)}
            >
              Donate {tier.label}
            </button>
          ))}
        </div>
      )}

      {selectedPriceID && (
        <CheckoutWrapper priceID={selectedPriceID} />
      )}
    </section>
  );
}
