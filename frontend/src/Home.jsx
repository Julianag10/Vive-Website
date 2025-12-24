import { DONATION_TIERS } from "./donations";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Support ViVe</h1>

      {DONATION_TIERS.map((tier) => (
        <button
          key={tier.priceID}
          onClick={() =>
            navigate("/checkout", {
              state: { priceID: tier.priceID },
            })
          }
        >
          Donate {tier.label}
        </button>
      ))}
    </div>
  );
}
