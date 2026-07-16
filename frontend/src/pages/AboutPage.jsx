import { useEffect, useState } from "react";
import "../styles/aboutUs.css";
import StaffGrid from "../features/About/StaffGrid";
import { getStaff } from "../features/About/StaffService";

export default function AboutPage() {
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    async function loadStaff() {
      try {
        const data = await getStaff();
        setStaffMembers(data);
      } catch (err) {
        console.error("Failed to load staff:", err);
      }
    }

    loadStaff();
  }, []);

  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">Community wellness, equity, and belonging</p>
        <h1>About ViVe Wellness</h1>
        <p>
          ViVe Wellness creates culturally relevant programs that support physical,
          mental, and social wellness for families across Denver and surrounding
          communities.
        </p>
      </section>

      <section className="about-story-grid" aria-label="About ViVe Wellness">
        <article className="about-panel about-panel-mission">
          <h2>Our Mission</h2>
          <p>
            Foster social justice, health and gender equity through culturally relevant physical, mental and social wellness programs.
          </p>
        </article>

        <article className="about-panel about-panel-vision">
          <h2>Our Vision</h2>
          <p>
            We envision a world where gender, race, ethnicity, disability, education, income, origin and sexual orientation are no longer predictors of life and health outcomes.
          </p>
        </article>
      
        <article className="about-panel about-panel-story">
          <h2>Our Story</h2>
          <p>
            Founded in 2017, ViVe advances equity by addressing systemic barriers faced by low-income, racially, and ethnically diverse communities in Denver and surrounding cities. 
            Primarily serving underserved Latino migrants and other marginalized communities, ViVe provides programs that foster health equity through culturally relevant wellness activities.  
          </p>
        </article>

        <article className="about-panel about-panel-impact">
          <h2>How We Work</h2>
          <p>  
            Through partnerships with local organizations and donations secured through grants and private funding, ViVe Wellness promotes physical and mental health, leadership, and social well-being to children and adults across Denver and surrounding cities.
          </p>
        </article>
      </section>
      
      <StaffGrid
        staff={staffMembers}
      />
    </main>
  );
}
