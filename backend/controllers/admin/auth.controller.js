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

    // creates + saves admmin to session:
    // req was already parsed by req.session
    // req.sesion alreay contains teh session in RAM 
    // req.session.admin attaches the new||modified admin to session
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

// lets frontend know if session is logged in 
export function meController(req, res) {
    // reports the Session STATE (current memory being used -> admin )
    res.json({admin: req.session.admin || null});
}



