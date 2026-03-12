import ProgramCard from "./ProgramCard";

// FEATURED ROGRAM SECTION: grid container
export default function FeaturedProgramSection() {
  // featured porgrams are dynamic API data
  const [featuredPrograms, setFeaturedPrograms] = useState();
  const [loading, setLoading] = useState(true); // shows loading until fetch called
  const [error, setError] = useState(null);

  // useEffect runs the fetch when Home loads, so data is requested once after render
  useEffect(() => {
    async function fetchFeaturePrograms() {
      try{
        const res = fetch("/api/programs/featured");

        // is backend: res.json(programs) express will send a status code 200 and json response body
        if (!res.ok) {
          // if res not ok: backend sends error message in json response body
          const errorData = await res.json();
          
          throw new Error(errorData.error || "failed to load featured programs")
        }

        const data = await res.json();

        setFeaturedPrograms(data);
      } catch (err) { // catch error from above: throw new error 
        setFeaturedPrograms(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturePrograms();
  }, []); // [] -> run on mount bc nothign will change, bc progrmas runs on mount, so nothign willchange

  if (loading) return <p>Loading featuredprograms…</p>;

  if (error) return <p>Error: {error}</p>;

  if (programs.length === 0) return <p>No programs found.</p>;
  // TODO Add fallback UI If no featured programs:show any three progrmas available

  if (!programs || programs.length === 0) return null;

  return (
    <section className="featured-programs-section">
  
      {featuredPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}

    </section>
  );
}

