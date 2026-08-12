import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import DonationSplitSection from "../components/DonationSplitSection";
import FeaturedProgramsSection from "../features/Programs/components/FeaturedProgramsSection";
import VolunteerSection from "../features/Volunteer/VolunteerSection";
import SuccessModal from "../components/SuccessModal";

const PARTNER_IMAGES = [
  {
    name: "City of Denver Parks and Recreation",
    src: "/uploads/home/partners/City of Denver Parks and Rec.png",
  },
  {
    name: "CityWILD",
    src: "/uploads/home/partners/City-Wild.png",
  },
  {
    name: "Colorado Parks and Wildlife",
    src: "/uploads/home/partners/Colorado Parks and Wildlife.png",
  },
  {
    name: "Denver Urban Gardens",
    src: "/uploads/home/partners/Denver Urban Gardens.png",
  },
  {
    name: "Boys and Girls Club",
    src: "/uploads/home/partners/boys-and-girls-club-logo.png",
  },
  {
    name: "Caring for Denver",
    src: "/uploads/home/partners/caring-for-denver-logo.png",
  },
  {
    name: "Denver Afterschool Alliance",
    src: "/uploads/home/partners/denver-afterschool-alliance.png",
  },
  {
    name: "Denver Public Schools",
    src: "/uploads/home/partners/dps-logo.png",
  },
  {
    name: "GRASP",
    src: "/uploads/home/partners/grasp.png",
  },
  {
    name: "The Greenway Foundation",
    src: "/uploads/home/partners/greenway-foundation-logo.png",
  },
  {
    name: "Groundwork Denver",
    src: "/uploads/home/partners/groundwork-logo.png",
  },
  {
    name: "Kiva Center",
    src: "/uploads/home/partners/kiva-center-logo.png",
  },
  {
    name: "Lincoln Healthcare",
    src: "/uploads/home/partners/lincoln-Healthcare-logo.png",
  },
  {
    name: "Metro Caring",
    src: "/uploads/home/partners/metro-caring.png",
  },
  {
    name: "Mile High Corps",
    src: "/uploads/home/partners/mile-high-corps.jpeg",
  },
];

export default function HomePage() {
  const [donationStatus, setDonationStatus] = useState(null);

  useEffect(() => {
    document.body.classList.add("home-page-active");

    return () => {
      document.body.classList.remove("home-page-active");
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const donationSessionId = params.get("donation_session_id");

    if (!donationSessionId) {
      return;
    }

    fetch(`/api/checkout/session-status?session_id=${donationSessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setDonationStatus(data.payment_status);
        params.delete("donation_session_id");
        const query = params.toString();
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}${query ? `?${query}` : ""}`
        );
      })
      .catch(() => setDonationStatus("error"));
  }, []);

  function closeDonationModal() {
    setDonationStatus(null);
  }
  
  return (
    <div className="home-grid">
      {/* HERO */}
      <section className="hero">
        <img src="/uploads/home/hero.png" alt="" />
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-title-nowrap">Breaking Barriers</span>
            <br />
            to Health
            <br />
            Inequities
          </h1>
          <div className="hero-panel">
            <p>
              ViVe Wellness creates culturally relevant programs that promote
              physical, mental, and social well-being for underserved communities
              across Denver.
            </p>
            <div className="hero-cta">
              <Link to="/donate" className="donate-btn">
                Donate Today
              </Link>
              <Link to="/volunteer" className="volunteer-btn">
                Volunteer With us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <div className="mission">
          <h2>
              We foster social justice, health, and gender equity through culturally relevant physical, mental, and social wellness programs.
          </h2>
          
        </div>
        <div className="vision">
          <div className="vision-panel">
            <h2>
              Our Vision
            </h2>
            <p>
              We envision a world where gender, race, ethnicity, disability,
              education, income, origin and sexual orientation are no longer
              predictors of life and health outcomes.
            </p>
            <Link to="/about" className="aboutus-btn">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="featured-programs">
        <h2>Our Top Programs</h2>
        <FeaturedProgramsSection/>
        <Link to="/programs" className="view-all-programs-btn">
          View all programs
        </Link>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-row">
          <div className="features-benefits">
            <h2>Kids grow stronger and more confident</h2>
            <p>
              Youth fitness and wellness programs give kids structured
              opportunities to stay active through sports, dance, and play.
            </p>
          </div>
          <img src="/uploads/home/features/volleyball.png" alt="" />
        </div>

        <div className="features-row">
          <img src="/uploads/home/features/cute-girl.png" alt="" />
          <div className="features-benefits">
            <h2>Families feel respected and included</h2>
            <p>
              Every program is delivered in English and Spanish to ensure
              accessibility and inclusivity. And culturally relevant wellness
              programs designed for underserved Latino and migrant communities.
            </p>
          </div>
        </div>

        <div className="features-row">
          <div className="features-benefits">
            <h2>Families achieve better health outcomes</h2>
            <p>
              Our team partners with local schools, clinics, and nonprofits to
              expand reach and reduce systemic barriers.
            </p>
          </div>
          <img src="/uploads/home/features/crafting.png" alt="" />
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <div className="fact-impact">
          <img
            className="fact-impact-icon"
            src="/uploads/icons/life-preserver.svg"
            alt=""
            aria-hidden="true"
          />
          <h2>Fact</h2>
          <p>
            Over 60% of Latino and African American children do not know how to
            swim, increasing the drowning risk in our community.
          </p>

          <h2>Our Impact</h2>
          <p>
            5800 children and their families learned to swim. Every year ViVe
            teaches over 500 kids and their families how to swim through our
            After School and Learn to Swim programs.
          </p>
        </div>

        <div className="fact-impact">
          <img
            className="fact-impact-icon"
            src="/uploads/icons/leaf-fill.svg"
            alt=""
            aria-hidden="true"
          />
          <h2>Fact</h2>
          <p>
            Minority children lack the access and opportunity of outdoor nature
            activities as well as physical wellness.
          </p>

          <h2>Our Impact</h2>
          <p>
            4900 children enrolled in After School and outdoor recreation
            programs. Movement, social emotional and wellness & Youth Workforce
            development.
          </p>
        </div>

        <div className="fact-impact">
          <img
            className="fact-impact-icon"
            src="/uploads/icons/non-profit-organization.png"
            alt=""
            aria-hidden="true"
          />
          <h2>Fact</h2>
          <p>
            30,000 newcomers arrived in Denver Colorado in 2023. Most of them
            from Venezuela without permit to work while they waited for their
            immigration appointment.
          </p>

          <h2>Our Impact</h2>
          <p>
            15,000 newcomers assisted. VIVE has supported through resources such
            as food bags, phones, bus passes, mental health resources,
            children&apos;s school and housing for over 4500 people.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>Testimonials</h2>
        <blockquote>
          “ViVe helped me find confidence in myself and helped me to help
          others, vive inspired me to start my own nonprofit one day.”
          <cite>– Miriam, Program Leader</cite>
        </blockquote>

        <blockquote>
          “ViVe helped me love working with kids in a park all summer, and open
          up my world prespective, meet some amazing people, and become friends
          with people way older and younger than me.”
          <cite>– Juliana, Program Pathway</cite>
        </blockquote>

        <blockquote>
          “what would hector say...”
          <cite>– Hector, Program Pathway</cite>
        </blockquote>

        <blockquote>
          “ViVe helped me learn to deal with my little brother better.”
          <cite>– Eliel, Program Pathway</cite>
        </blockquote>

        <blockquote>
          “ViVe has not helped me, I still cannot swim”
          <cite>– Richie, Program Pathway</cite>
        </blockquote>

        <blockquote>
          “hopeflly vive can help me to by pants that aretn sweat pants.”
          <cite>– Juan, Program Pathway</cite>
        </blockquote>
      </section>

      {/* DONATE */}
      <DonationSplitSection className="donate" heading="Make an Impact" />

      {/* VOLUNTEER */}
      <VolunteerSection />

      {/* PARTNERS */}
      <section className="partners">
        <h2>Our Partners</h2>
        <div className="partner-logos">
          {PARTNER_IMAGES.map((partner) => (
            <img
              src={partner.src}
              alt={`${partner.name} logo`}
              key={partner.src}
            />
          ))}
        </div>
      </section>

      {donationStatus === "paid" && (
        <SuccessModal
          onClose={closeDonationModal}
          title="Thank you for your donation!"
        >
          <p>Your payment was successful.</p>
          <p>Your support helps ViVe Wellness continue serving our community.</p>
          <p>You will be emailed with your receipt.</p>
        </SuccessModal>
      )}

      {donationStatus === "error" && (
        <SuccessModal
          onClose={closeDonationModal}
          title="Donation status unavailable"
        >
          <p>We could not verify your donation status right now.</p>
          <p>If your payment completed, Stripe will still send your receipt.</p>
        </SuccessModal>
      )}
    </div>
  );
}
