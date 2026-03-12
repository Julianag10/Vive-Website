import { Link } from "react-router-dom";
import "../styles/home.css";
import DonationForm from "../components/DonationForm";
import ProgramCard from "../components/ProgramCard";
import FeaturedProgramSection from "../components/ProgramSection";


export default function HomePage() {
  
  return (
    <div className="home-grid">
      {/* HERO */}
      <section className="hero">
        <img src="/img/Untitled_Artwork 3.png" alt="" />
        <div className="hero-text">
          <h1>Breaking Barriers to Health Inequities</h1>
        </div>
        <div className="hero-cta">
          <Link to="/donate" className="donate-btn">
            Donate Today
          </Link>
          <Link to="/volunteer" className="volunteer-btn">
            Volunteer With us
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <div className="vision">
          <h2>
            We foster social justice, health, and gender equity through
            culturally relevant physical, mental, and social wellness programs.
          </h2>
        </div>
        <div className="mission">
          <h2>Our Vision</h2>
          <p>
            We envision a world where gender, race, ethnicity, disability,
            education, income, origin and sexual orientation are no longer
            predictors of life and health outcomes.
          </p>
          <Link to="/about" className="aboutus-btn">
            About Us
          </Link>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="featured-programs">
        <h2>Our Top Programs</h2>
          <FeaturedProgramSection/>
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
          <img src="/img/empty.png" alt="" />
        </div>

        <div className="features-row">
          <img src="/img/empty.png" alt="" />
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
          <img src="/img/empty.png" alt="" />
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <div className="fact-impact">
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
      <section className="donate">
        <div className="donate-cta">
          <h1>Make an Impact </h1>
          <p>Support our mission by contributing a donation.</p>
        </div>

        <div className="donate-form">
          <DonationForm />
        </div>
      </section>

      {/* VOLUNTEER */}
      <section className="volunteer">
        <div className="volunteer-cta">
          <h2>Volunteer </h2>
          <p>Create impact in your community.</p>
          <form>
            <input type="text" name="name" placeholder="Your Name" />
            <input type="email" name="email" placeholder="Your Email" />
            <button type="submit" className="btn secondary">
              Sign Up
            </button>
          </form>
        </div>
        <img src="/img/empty.png" alt="" />
      </section>

      {/* PARTNERS */}
      <section className="partners">
        <h2>Our Partners</h2>
        <div className="partner-logos">{/* partner logos here */}</div>
      </section>
    </div>
  );
}
