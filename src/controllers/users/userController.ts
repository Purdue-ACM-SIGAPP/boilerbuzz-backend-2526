import { Request, Response } from "express";

import pool from "@/libs/db";

export const listUsers = async (_request: Request, response: Response) => {
  try {
    const result = await pool.query("SELECT * FROM AppUser");
    console.log("Get list of users from database");
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to list users" });
  }
};

export const getUserData = async (request: Request, response: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM UserSettings WHERE user_id = $1",
      [request.params.id],
    );

    console.log("Update user data request sent");
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json("Failed to fetch user data");
  }
};

export const addUser = async (_request: Request, response: Response) => {
  try {
    const result = await pool.query(
      "INSERT INTO AppUser DEFAULT VALUES RETURNING *",
    );
    response.status(201).json(result.rows[0]);
  } catch {
    response.status(500).json({ error: "Failed to add user data" });
  }
};

export const updateUserSettings = async (
  _request: Request,
  response: Response,
) => {
  // No need to do anything since there is nothing in the user settings table
  // other than the user ID.
  response.status(200).json({ message: "No updatable user settings yet" });
};

export const deleteUserData = async (request: Request, response: Response) => {
  try {
    await pool.query("DELETE FROM UserSettings WHERE user_id = $1", [
      request.params.id,
    ]);
    const result = await pool.query("DELETE FROM AppUser WHERE id = $1", [
      request.params.id,
    ]);

    if (result.rowCount === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    console.log("Delete user data request processed");
    return response.status(200).json({ message: "User data deleted" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to delete user data" });
  }
};
