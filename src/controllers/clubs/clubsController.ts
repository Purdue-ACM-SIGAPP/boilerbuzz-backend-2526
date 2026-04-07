// import { db } from "@/libs/dbs";// Once db is setup, uncomment this line
import { Request, Response } from "express";
import pool from "@/libs/db";

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Unknown error";
};

const getClubLogoRecord = async (clubId: string) => {
  const query = "SELECT id, logo_path FROM Club WHERE id = $1";
  const result = await pool.query(query, [clubId]);

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0] as { id: number; logo_path: string | null };
};

const validateLogoPath = (logoPath: unknown): string | null => {
  if (typeof logoPath !== "string") {
    return null;
  }

  const trimmedLogoPath = logoPath.trim();
  if (trimmedLogoPath.length === 0) {
    return null;
  }

  return trimmedLogoPath;
};

const getClubs = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query("SELECT * FROM club");
    res.status(200).json(data.rows);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({
      error: "Failed to fetch clubs",
      details:
        "There was an internal server error while retrieving all clubs. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const getClub = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query("SELECT * FROM Club WHERE id = $1", [
      _req.params.id,
    ]);
    res.status(200).json(data.rows[0]);
  } catch (err) {
    console.error("Error fetching club:", err);
    res.status(500).json({
      error: "Failed to fetch club",
      details:
        "There was an internal server error while retrieving the club. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const addClub = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query(
      "INSERT INTO Club (member_post_permissions) VALUES ($1) RETURNING *",
      [_req.body.member_post_permissions],
    );
    res.status(200).json(data.rows);
  } catch (err) {
    console.error("Error Adding club:", err);
    res.status(500).json({
      error: "Failed to adding club",
      details:
        "There was an internal server error while adding the club. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const updateClub = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query(
      "UPDATE Club SET member_post_permissions = $1 WHERE id = $2",
      [_req.body.member_post_permissions, _req.params.id],
    );
    res.status(200).json(data.rows);
    // res.status(200).json({ message: "Update club endpoint hit. Functionality to be implemented." });
  } catch (err) {
    console.error("Error updating club:", err);
    res.status(500).json({
      error: "Failed to updating club",
      details:
        "There was an internal server error while updating the club. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const deleteClub = async (_req: Request, res: Response) => {
  try {
    const data = await pool.query("DELETE FROM Club WHERE id = $1", [
      _req.params.id,
    ]);
    res.status(200).json(data.rows);
  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({
      error: "Failed to deleting club",
      details:
        "There was an internal server error while deleting the club. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const getClubLogo = async (_req: Request, res: Response) => {
  try {
    const existingClub = await getClubLogoRecord(_req.params.id);

    if (!existingClub) {
      return res.status(404).json({ error: "Club not found" });
    }

    if (!existingClub.logo_path) {
      return res.status(404).json({ error: "Club logo not found" });
    }

    return res.status(200).json({
      club_id: existingClub.id,
      logo_path: existingClub.logo_path,
    });
  } catch (err) {
    console.error("Error fetching club logo:", err);
    return res.status(500).json({
      error: "Failed to fetch club logo",
      details:
        "There was an internal server error while retrieving the club logo. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const addClubLogo = async (_req: Request, res: Response) => {
  try {
    const logoPath = validateLogoPath(_req.body.logo_path);
    if (!logoPath) {
      return res.status(400).json({
        error: "Missing required field",
        details: "logo_path is required in the request body",
      });
    }

    const addLogoQuery =
      "UPDATE Club SET logo_path = $1 WHERE id = $2 AND logo_path IS NULL RETURNING id, logo_path";
    const addLogoResult = await pool.query(addLogoQuery, [logoPath, _req.params.id]);

    if (addLogoResult.rowCount === 0) {
      const existingClub = await getClubLogoRecord(_req.params.id);

      if (!existingClub) {
        return res.status(404).json({ error: "Club not found" });
      }

      return res.status(409).json({
        error: "Club logo already exists",
        details: "Use the update endpoint to replace an existing club logo",
      });
    }

    return res.status(201).json(addLogoResult.rows[0]);
  } catch (err) {
    console.error("Error adding club logo:", err);
    return res.status(500).json({
      error: "Failed to add club logo",
      details:
        "There was an internal server error while adding the club logo. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const updateClubLogo = async (_req: Request, res: Response) => {
  try {
    const logoPath = validateLogoPath(_req.body.logo_path);
    if (!logoPath) {
      return res.status(400).json({
        error: "Missing required field",
        details: "logo_path is required in the request body",
      });
    }

    const updateLogoQuery =
      "UPDATE Club SET logo_path = $1 WHERE id = $2 AND logo_path IS NOT NULL RETURNING id, logo_path";
    const updateLogoResult = await pool.query(updateLogoQuery, [
      logoPath,
      _req.params.id,
    ]);

    if (updateLogoResult.rowCount === 0) {
      const existingClub = await getClubLogoRecord(_req.params.id);

      if (!existingClub) {
        return res.status(404).json({ error: "Club not found" });
      }

      return res.status(404).json({
        error: "Club logo not found",
        details: "Use the add endpoint to set a logo for this club",
      });
    }

    return res.status(200).json(updateLogoResult.rows[0]);
  } catch (err) {
    console.error("Error updating club logo:", err);
    return res.status(500).json({
      error: "Failed to update club logo",
      details:
        "There was an internal server error while updating the club logo. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

const removeClubLogo = async (_req: Request, res: Response) => {
  try {
    const removeLogoQuery =
      "UPDATE Club SET logo_path = NULL WHERE id = $1 AND logo_path IS NOT NULL RETURNING id";
    const removeLogoResult = await pool.query(removeLogoQuery, [_req.params.id]);

    if (removeLogoResult.rowCount === 0) {
      const existingClub = await getClubLogoRecord(_req.params.id);

      if (!existingClub) {
        return res.status(404).json({ error: "Club not found" });
      }

      return res.status(404).json({ error: "Club logo not found" });
    }

    return res.status(200).json({ message: "Club logo removed successfully" });
  } catch (err) {
    console.error("Error removing club logo:", err);
    return res.status(500).json({
      error: "Failed to remove club logo",
      details:
        "There was an internal server error while removing the club logo. Please try again later.",
      technical_error: getErrorMessage(err),
    });
  }
};

export {
  addClub,
  addClubLogo,
  deleteClub,
  getClub,
  getClubLogo,
  getClubs,
  removeClubLogo,
  updateClub,
  updateClubLogo,
};
