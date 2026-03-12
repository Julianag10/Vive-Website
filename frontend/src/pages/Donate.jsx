import DonationForm from "../components/DonationForm";
import "../styles/donate.css";

// TODO CHANEG NAEM TO PAGE

export default function Donate() {
  return (
    <div className="donate-page">
      <h1>Donate</h1>
      <DonationForm />
    </div>
  );
}
