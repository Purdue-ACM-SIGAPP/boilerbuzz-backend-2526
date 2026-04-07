import {
  addClub,
  addClubLogo,
  deleteClub,
  getClub,
  getClubLogo,
  getClubs,
  removeClubLogo,
  updateClub,
  updateClubLogo,
} from "@/controllers/clubs/clubsController";
import { Router } from "express";

const clubRouter = Router();

clubRouter.get("/club", getClubs);
clubRouter.get("/club/:id", getClub);
clubRouter.get("/club/:id/logo", getClubLogo);
clubRouter.post("/club", addClub);
clubRouter.post("/club/:id/logo", addClubLogo);
clubRouter.put("/club/:id", updateClub);
clubRouter.put("/club/:id/logo", updateClubLogo);
clubRouter.delete("/club/:id", deleteClub);
clubRouter.delete("/club/:id/logo", removeClubLogo);

export default clubRouter;
