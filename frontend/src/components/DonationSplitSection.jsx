import DonationForm from "./DonationForm";
import "../styles/donate.css";

const DONATION_IMAGE = "/uploads/donations/pool.png";

export default function DonationSplitSection({
  className = "",
  heading = "Your support matters",
}) {
  return (
    <section className={`donate-main-grid donation-split-section ${className}`.trim()}>
      <div className="donate-impact-image" aria-label="Donation impact photo">
        <img
          src={DONATION_IMAGE}
          alt="ViVe donation impact"
          onError={(event) => {
            event.currentTarget.removeAttribute("src");
          }}
        />
        <section className="donate-intro">
          <h1>{heading}</h1>
        </section>
      </div>

      <div className="donate-giving-panel">
        <p className="donate-callout">
          Any amount, big or small goes a long way in this organization.
        </p>
        <div className="donate-giving-content">
          <p className="donate-support-copy">
            We provide children and their families opportunities to engage in
            physical activities, wellness education, sports and Youth Workforce
            that would otherwise be inaccessible to them.
          </p>
          <DonationForm />
          <div className="donate-tax-lines">
            <p>All contributions are tax deductible.</p>
            <p>VIVE 501 (c)(3) charitable organization.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
