import pool from "@/libs/db";
import { Request, Response } from "express";

const createBookmark = async (req: Request, res: Response) => {
  try {
    console.log("Creating Bookmark connection between user and poster...");
    const { userId, posterId } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "userId is required",
      });
    }
    if (!posterId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "posterId is required",
      });
    }
    console.log("checkpoint");
    await pool.query(
      "INSERT INTO user_poster_bookmark (user_id, poster_id) VALUES ($1, $2) RETURNING *",
      [userId, posterId],
    );

    return res.status(201).json({
      success: true,
      message: "Bookmark created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error creating Bookmark",
      details:
        "There was an internal server error while creating a bookmark. Please try again later.",
      technical_error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getAllBookmarks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "userId is required",
      });
    }
    console.log("Getting all bookmarks");
    const result = await pool.query(
      "SELECT * FROM user_poster_bookmark WHERE user_id = $1",
      [userId],
    );
    return res.status(200).json({
      success: true,
      message: "Bookmarks retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Unable to retrieve all bookmarks",
      details:
        "There was an internal server error while retrieving all bookmarks. Please try again later.",
      technical_error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getBookmark = async (req: Request, res: Response) => {
  try {
    console.log("Getting bookmark");
    const { userId, posterId } = req.params;
    if (!userId) {
      return res.status(400).json({
        message: "Missing required field",
        details: "userId is required",
      });
    }
    if (!posterId) {
      return res.status(400).json({
        message: "Missing required field",
        details: "posterId is required",
      });
    }
    const result = await pool.query(
      "SELECT * FROM user_poster_bookmark WHERE user_id = $1 AND poster_id = $2",
      [userId, posterId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Bookmark not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      error: "Unable to retrieve all bookmarks",
      details:
        "There was an internal server error while retrieving bookmark. Please try again later.",
      technical_error: error instanceof Error ? error.message : String(error),
    });
  }
};

const deleteBookmark = async (req: Request, res: Response) => {
  try {
    console.log("Deleting bookmark");
    const { userId, posterId } = req.params;
    if (!userId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "userId is required",
      });
    }
    if (!posterId) {
      return res.status(400).json({
        error: "Missing required field",
        details: "posterId is required",
      });
    }
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM user_poster_bookmark WHERE user_id = $1 AND poster_id = $2)",
      [userId, posterId],
    );
    if (!result.rows[0].exists) {
      return res.status(400).json({
        error: "Error deleting bookmark",
        details: "Bookmark doesn't exist",
      });
    }
    await pool.query(
      "DELETE FROM user_poster_bookmark WHERE user_id = $1 AND poster_id = $2",
      [userId, posterId],
    );
    return res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Unable to delete bookmark",
      details:
        "There was an internal server error while retrieving bookmark. Please try again later.",
      technical_error: error instanceof Error ? error.message : String(error),
    });
  }
};

export { createBookmark, deleteBookmark, getAllBookmarks, getBookmark };
