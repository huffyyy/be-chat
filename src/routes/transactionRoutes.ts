import express from "express";
import verifyToken from "../middleware/verifyToken";
import * as transactionController from "../controllers/transactionController";

const transactionRoutes = express.Router();

transactionRoutes.post("/transactions", verifyToken, transactionController.createTransaction);
transactionRoutes.post("/transactions/handle-payment", transactionController.updateTransaction);

export default transactionRoutes;
