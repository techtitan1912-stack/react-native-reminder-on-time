import expores from "express";
import { agenda } from "../../config/agenda.js";
import protectRoute from "../middleware/auth.middleware.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { sendFCMNotification } from "../services/notificationService.js";

const router = expores.Router();

//get task list of user
router.get("/getTasks", protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        console.log(" At getTasks route >>> User ID : ", req.user._id);
        console.log(" At getTasks route >>> Page : ", page, " Limit : ", limit, " Skip : ", skip);


        const tasks = await Task.find({
            $or: [
                { user: req.user._id },
                { mentionNumber: req.user.mobileNumber } // mobile number match
            ]
        })
            .populate({
                path: "user", // join with User table
                select: "username email mobileNumber profileImage"
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const totalTasks = await Task.countDocuments({
            $or: [
                { user: req.user._id },
                { mentionNumber: req.user.mobileNumber }
            ]
        });
        console.log(" At getTasks route >>> Fetched task count : ", tasks.length);
        console.log(" At getTasks route >>> Fetched task count : ", totalTasks);

        return res.send({
            tasks,
            currentPage: page,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit)
        });
    } catch (error) {
        console.log("Error in getTasks route >>> ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/addTask", protectRoute, async (req, res) => {
    try {
        const { title, description, reminderTime, mentionedNumber, mentionedUserNames, isCompleted, pushToken, profileImage } = req.body;

        let pushTokensArray = [];
        let mentionedNumberArray  = [];
        if (mentionedNumber && mentionedNumber.trim() !== "") {
            // 🔹 1. Clean mentioned numbers
            mentionedNumberArray  = Array.isArray(mentionedNumber)
                ? mentionedNumber.map((num) =>
                    num.trim().replace(/\s+/g, "").replace(/^\+?91/, "")
                )
                : [];

            // 🔹 2. Get push tokens from User table

            if (mentionedNumberArray.length > 0) {
                const users = await User.find({
                    mobileNumber: { $in: mentionedNumberArray },
                }).select("pushToken");

                pushTokensArray = users
                    .map((u) => u.pushToken)
                    .filter((token) => token); // remove null/undefined
            }
        }

        // 🔹 3. If no tokens found → add self token
        if (pushTokensArray.length === 0 && pushToken) {
            pushTokensArray.push(pushToken);
        }

        // 🔹 4. Create Task
        const newTask = new Task({
            user: req.user._id,
            title,
            description,
            reminderTime,
            mentionedNumber: mentionedNumberArray,
            mentionedUserNames,
            isCompleted,
            pushToken: pushTokensArray,
            profileImage,
        });

        const savedTask = await newTask.save();

        // 🔹 1. Send instant notification
        await sendFCMNotification(
            pushTokensArray,
            "New Task",
            `${title}`,
            false,
            profileImage
        );

        // 🔹 2. Schedule reminder
        await agenda.schedule(new Date(reminderTime), "task reminder", {
            taskId: savedTask._id,
            title,
            pushTokensArray,
            profileImage,
        });


        return res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        console.log("Error in addTask route >>> ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//complete task
router.put("/completeTask/:id", protectRoute, async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        const updateData = {
            isCompleted: isCompleted,
            completedAt: isCompleted ? new Date() : null
        };

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        console.log("Task updated:", updatedTask);

        return res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.delete("/deleteTask/:id", protectRoute, async (req, res) => {
    try {

        const taskId = req.params.id;
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log(" At deleteTask route >>> Task not found by id : ", req.params.id);
            return res.status(404).json({ message: "Task not found by id : ${req.params.id} " });
        }

        const deleteCount = await task.deleteOne();
        console.log(" At deleteTask route >>> Task deleted successfully : ", req.params.id, ", Delete count : ", deleteCount);


        await agenda.cancel({
            "data.taskId": taskId,
        });

        return res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.log("Error at deteleTask route >>> ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;