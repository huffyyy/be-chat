import express from "express";
import verifyToken from "../middleware/verifyToken";
import * as transactionController from "../controllers/transactionController";

const transactionRoutes = express.Router();

transactionRoutes.post("/transactions", verifyToken, transactionController.createTransaction);
transactionRoutes.post("/transactions/handle-payment", transactionController.updateTransaction);
transactionRoutes.get("/revenue", verifyToken, transactionController.getRevenueStat);
transactionRoutes.get("/payouts", verifyToken, transactionController.getHistoryPayouts);
transactionRoutes.get("/balance", verifyToken, transactionController.getBalance);

export default transactionRoutes;
