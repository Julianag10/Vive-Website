

// next() = “let the request continue
export function requireAdmin(req, res, next) {
    // !req.session.admin ==:
        // not logged in 
        // logged out
        // session expired
        // invalid / missing coookie
  // If there is no session OR no admin stored in the session,
  // the request is not authorized
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ error: "Admin access required" });
  }

  // only runs IF Admin is authenticated → allow request to continue
  next();
}

