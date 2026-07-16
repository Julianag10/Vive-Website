import {
  listActivePrograms,
  listFeaturedPrograms,
} from "../services/programs.service.js";
import { getProgramById } from "../services/programs.service.js";


// LIST ACTIVE PORGRMAS (public)
// TODO why not _req any more?
export async function listProgramsController(req, res) {
  try {
    const programs = await listActivePrograms();
    res.json(programs);
  } catch (error) {
    console.error("Failed to load programs:", error);
    res.status(500).json({ error: error.message || "Failed to load programs" });
  }
}

export async function listFeaturedProgramsController(req, res) {
  try {
    // format the response
    const featuredPrograms = await listFeaturedPrograms();
    res.json(featuredPrograms);
  } catch (error) {
    console.error("Failed to load featured programs:", error);
    res.status(500).json({ error: error.message || "Failed to load featured programs" });
  }
}

export async function getProgramByIdController(req, res) {
  try {
    const program = await getProgramById(
      req.params.id
    );

    // if no row found
    if (!program) {
      res.status(404).json({ error: "Program not found" });
    } else {
      res.json(program);
    }
  } catch (error) {
    console.error("Failed to load program:", error);
    res.status(500).json({ error: error.message || "Failed to load program" });
  }
}
