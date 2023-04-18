
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import * as transaction from './data/transactions.js';

const db = await dbConnection();
await db.dropDatabase();

