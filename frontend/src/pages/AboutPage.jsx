import { useEffect, useState } from "react";
import "../styles/aboutUs.css";
import StaffGrid from "../features/About/StaffGrid";
import {getStaff} from "../features/About/StaffService";

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

      <h1>About ViVe Wellness</h1>

      <section className="about-grid">
        <div className="about-box">
          <p>
            Foster social justice, health and gender equity through culturally relevant physical, mental and social wellness programs.
            <h2 className="inline-h4">Our Mission</h2>
          </p>
        </div>

        <div className="about-box">
          <p>
            <h2 className="inline-h4">Our Vision</h2>
            We envision a world where gender, race, ethnicity, disability, education, income, origin and sexual orientation are no longer predictors of life and health outcomes.
          </p>
        </div>
      
        <div className="about-box">
          <p className="Our-Story">
            Founded in 2017, ViVe advances equity by addressing systemic barriers faced by low-income, racially, and ethnically diverse communities in Denver and surrounding cities. 
            <h2 className="inline-h4">Our Story</h2>
            Primarily serving underserved Latino migrants and other marginalized communities, ViVe provides programs that foster health equity through culturally relevant wellness activities.  
          </p>
        </div>

        <div className="about-box"> 
          <p>  
            Through partnerships with local organizations and donations secured through grants and private funding, ViVe Wellness promotes physical and mental health, leadership, and social well-being to children and adults across Denver and surrounding cities.
          </p>
        </div>
      </section>
      

      <StaffGrid
        staff={staffMembers}
      />

    </main>

    
  );
}