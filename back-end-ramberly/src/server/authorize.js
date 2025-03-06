import passport from "passport";

export const authorize = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      res.status(401).json({ message: "unauthorized" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
