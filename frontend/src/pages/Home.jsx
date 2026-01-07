import DonationForm from "../components/DonationForm";

export default function Home() {
  return (
    <div>
      <h1>Welcome to ViVe</h1>
      <DonationForm />

      <p>
        <a href="/admin">Admin Dashboard (dev)</a>
      </p>
    </div>
  );
}
