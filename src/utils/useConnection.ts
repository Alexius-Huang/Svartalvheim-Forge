import { Connection, createConnection } from "typeorm";
import models from "../models";

let connection: Connection | undefined;

export async function useConnection(callback: (connection: Connection) => void) {
  try {
    const conn = connection ?? (
      connection = await createConnection({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number.parseInt(process.env.POSTGRES_PORT as string),
        database: process.env.POSTGRES_DATABASE,
        entities: models,
      })
    );

    callback(conn);
  } catch (err) {
    throw err;
  }
} 
