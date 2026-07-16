import DonationForm from "../components/DonationForm";
import "../styles/donate.css";

// TODO CHANEG NAEM TO PAGE

const DONATION_IMAGES = [
  "/uploads/donations/donation-1.jpg",
  "/uploads/donations/donation-2.jpg",
  "/uploads/donations/donation-3.jpg",
];

const KING_SOOPERS_LOGO = "/uploads/donations/king-soopers-logo.png";
const AMAZON_SMILE_LOGO = "/uploads/donations/amazon-smile-logo.png";
const COLORADO_GIVES_LOGO = "/uploads/donations/colorado-gives-logo.png";
const PAYPAL_LOGO = "/uploads/donations/paypal-logo.png";
const DIRECT_DONATION_LOGO = "/uploads/donations/logo_text.png";
const SUPPORTER_LOGOS = [
  {
    name: "Colorado Health Foundation",
    src: "/uploads/donations/supporters/colorado-health-foundation.svg",
  },
  {
    name: "Caring for Denver Foundation",
    src: "/uploads/donations/supporters/caring-for-denver-foundation.svg",
  },
  {
    name: "Great Outdoors Colorado",
    src: "/uploads/donations/supporters/great-outdoors-colorado.svg",
  },
  {
    name: "Healthy Food for Denver's Kids",
    src: "/uploads/donations/supporters/healthy-food-for-denvers-kids.svg",
  },
  {
    name: "Margulf Foundation",
    src: "/uploads/donations/supporters/margulf-foundation.svg",
  },
  {
    name: "Denver Children's Affairs",
    src: "/uploads/donations/supporters/denver-childrens-affairs.svg",
  },
  {
    name: "USA Triathlon Foundation",
    src: "/uploads/donations/supporters/usa-triathlon-foundation.svg",
  },
  {
    name: "Rose Foundation",
    src: "/uploads/donations/supporters/rose-foundation.svg",
  },
];

export default function Donate() {
  return (
    <div className="donate-page">
      <section className="donate-intro">
        <h1>Your support matters. Please consider making a donation.</h1>
        <p>
          We provide children and their families opportunities to engage in
          physical activities, wellness education, sports and Youth Workforce
          that would otherwise be inaccessible to them. Any amount, big or small
          goes a long way in this organization. All contributions are tax
          deductible. VIVE 501 (c)(3) charitable organization.
        </p>
      </section>

      <section className="donate-main-grid">
        <div className="donate-image-grid" aria-label="Donation impact photos">
          {DONATION_IMAGES.map((imageUrl, index) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`ViVe donation impact placeholder ${index + 1}`}
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
          ))}
        </div>

        <div className="donate-form-column">
          <DonationForm />
        </div>
      </section>

      <section className="donate-other-ways">
        <h1>Other Ways to Donate</h1>

        <article className="donation-rewards-card">
          <div className="donation-rewards-logo-card">
            <img
              src={KING_SOOPERS_LOGO}
              alt="King Soopers logo"
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
            <span>King Soopers</span>
          </div>

          <div className="donation-rewards-copy">
            <p>
              <strong>King Soopers Community Rewards</strong> donates a
              percentage of your bill to ViVe Wellness. All you have to do is
              shop at King Soopers and swipe your SooperCard (or enter Alt ID).
            </p>

            <p>
              How to Enroll: go to{" "}
              <a href="http://www.kingsoopers.com/" rel="noreferrer" target="_blank">
                www.kingsoopers.com
              </a>
              , sign in to your account, select Community Rewards, enter ViVe
              or YW779.
            </p>

            <a
              className="donation-rewards-button"
              href="https://www.kingsoopers.com/account/communityrewards"
              rel="noreferrer"
              target="_blank"
            >
              Donate with King Soopers
            </a>
          </div>
        </article>

        <article className="donation-rewards-card">
          <div className="donation-rewards-logo-card">
            <img
              src={AMAZON_SMILE_LOGO}
              alt="Amazon Smile logo"
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
            <span>Amazon Smile</span>
          </div>

          <div className="donation-rewards-copy">
            <p>
              <strong>Amazon Smile</strong> donates 0.5% of the price of your
              eligible purchases to the charity of your choice. The same Amazon
              you know with the same products, same prices, same services but to
              generate donations, you must always shop at www.smile.amazon.com
              instead.
            </p>

            <p>
              How to Enroll: go to www.smile.amazon.com, sign in or create an
              account, pick a charity, search ViVe, select ViVe (Youth
              Development).
            </p>

            <a
              className="donation-rewards-button"
              href="https://www.amazon.com/?q=vive+wellness&orig=&ie=UTF-8"
              rel="noreferrer"
              target="_blank"
            >
              Donate with Amazon Smile
            </a>
          </div>
        </article>

        <article className="donation-rewards-card">
          <div className="donation-rewards-logo-card">
            <img
              src={COLORADO_GIVES_LOGO}
              alt="ColoradoGives logo"
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
            <span>ColoradoGives</span>
          </div>

          <div className="donation-rewards-copy">
            <p>
              <strong>ColoradoGives</strong> is a safe and trusted way to
              support non-profits. Every non-proft receiving a donation through
              ColoradoGives will receive a portion of the fund, increasing the
              value of every dollar donated.
            </p>

            <p>
              How to Donate: go to{" "}
              <a href="http://www.coloradogives.org/" rel="noreferrer" target="_blank">
                www.coloradogives.org
              </a>
              , select Donate, pick a non-profit, search ViVe, select and
              donate.
            </p>

            <a
              className="donation-rewards-button"
              href="https://www.coloradogives.org/organization/ViVe"
              rel="noreferrer"
              target="_blank"
            >
              Donate with ColoradoGives
            </a>
          </div>
        </article>

        <article className="donation-rewards-card">
          <div className="donation-rewards-logo-card">
            <img
              src={PAYPAL_LOGO}
              alt="PayPal logo"
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
            <span>PayPal</span>
          </div>

          <div className="donation-rewards-copy">
            <p>
              <strong>PayPal</strong> has verified our charity. To donate
              through PayPal, please click the button below.
            </p>

            <a
              className="donation-rewards-button"
              href="https://www.paypal.com/donate"
              rel="noreferrer"
              target="_blank"
            >
              Donate with PayPal
            </a>
          </div>
        </article>

        <article className="donation-rewards-card">
          <div className="donation-rewards-logo-card">
            <img
              src={DIRECT_DONATION_LOGO}
              alt="ViVe Wellness logo"
              onError={(event) => {
                event.currentTarget.removeAttribute("src");
              }}
            />
            <span>ViVe Wellness</span>
          </div>

          <div className="donation-rewards-copy">
            <p>
              <strong>Direct Donation via Checks</strong>
            </p>

            <address className="donation-check-address">
              ViVe Wellness
              <br />
              P.O. Box 11003
              <br />
              Denver, CO 80211
            </address>
          </div>
        </article>
      </section>

      <section className="donate-supporters">
        <h1>Thank you for your support</h1>

        <div className="donate-supporter-grid">
          {SUPPORTER_LOGOS.map((supporter) => (
            <div className="donate-supporter-logo-card" key={supporter.name}>
              <img
                src={supporter.src}
                alt={`${supporter.name} logo`}
                onError={(event) => {
                  event.currentTarget.removeAttribute("src");
                }}
              />
              <span>{supporter.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
