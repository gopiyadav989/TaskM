import express from "express";
import { protectRoute, isAdminRoute } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser, getTeamList, getNotificationList, updateUserProfile, markNotificationRead, changeUserPassword, deleteUserProfile, activateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationList);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// For Admin Only
router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activateUserProfile)
    .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
