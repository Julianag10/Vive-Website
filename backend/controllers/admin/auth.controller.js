import { authenticateAdmin } from "../../services/admin/auth.service.js";

export async function loginController(req,res) {
    const {email, password} = req.body;

    // await reutrns: {id: admin.id, email: admin.email}
    const admin = await authenticateAdmin(email, password);

    // every time an admin route is visted the routes are protected here:
    // if admin never logged in -> blocked
    // if admin logged out -> blocked
    // if session expired -> blocked
    if (!admin) 
        return res.status(401).json({error: "Invalid credentials"});

    // creates + saves admmin to session || updates the session if session data (admin) was modified:
    // 1. middlewar sees sessin data was modidied
    // 2. generates || reuses session ID
    req.session.admin = admin;
    
    // responds to client (cookie is created w/ session id) (browsers saves cookies in cache) 
    res.json({success: true});
}

// destroys the enitre sesssin
export async function logoutController(req, res) {
    // .destory removes the session from RAM -> cookie becomes usless(donse mapp to and session data)
    req.session.destroy(() => {
        res.json({ success: true });
    });
}

// lets front end checko if session is logged in 
export function meController(req, res) {
    // reports teh Session STATE (current memory being used -> amdin )
    res.json({admin: req.session.admin || null});
}

// server memory (RAM) : map of sessionId -> sessionDaTa
// server nned to know whic session belongs to the is browser
// browser sends the sessin id back on every req

// broser cookie = whcih session id to use on each req

// PER REQ
// 1. browsers sends req + cookie
// 2. backend reads cookie , extracts session id 
// 3. backend looks up session id  in RAM 
// 4. backend(w/ middleware) attaches teh session data to req.session so that 
// 6. backend recives req adn reads req.session.admin to get teh session that the browser is activley usin g