//redeploy trigger
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from '../lib/cloudinary.js';
import protectRoute from '../middleware/auth.middleware.js';
import User from '../models/User.js';

const upload = multer({ dest: "uploads/" });
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

router.post("/register", async (req, res) => {
  try {
    const { userName, email, mobileNumber, dateOfBirth, pushToken } = req.body;
    console.log("Received registration data:", { userName, email, mobileNumber, dateOfBirth, pushToken });
    console.log("At user register api req body >>> ", req.body);

    if (!userName || !email || !mobileNumber || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (mobileNumber.length !== 10) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }
    if (new Date(dateOfBirth) >= new Date()) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }
    if (userName.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }
    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({ message: "User with given mobile number already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User with given email already exists" });
    }

    //get random avatar
    const profileImageAvataar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userName}`;

    // upload profile image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(profileImageAvataar)
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      console.log("Cloudinary upload failed:", cloudinaryResponse);
      // return res.status(500).json({ message: "Failed to upload profile image" });
    }
    const imageUrl = cloudinaryResponse.secure_url;

    const user = new User({
      username: userName,
      email,
      mobileNumber,
      dateOfBirth: new Date(dateOfBirth),
      profileImage: imageUrl,
      pushToken: pushToken
    });
    await user.save();

    const token = generateToken(user._id);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.log("Error in register route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

});

// Login route
router.post("/login", async (req, res) => {

  try {
     console.time("LOGIN_TOTAL");

    const { email } = req.body;
    console.log("At user login api req body >>> ", req.body);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

     console.time("DB_QUERY");

    // compare email with db
    const user = await User.findOne({ email });

    console.timeEnd("DB_QUERY");

    if (!user) {
      return res.status(400).json({ message: "User with given email does not exist in DB" });
    }

    console.time("TOKEN");

    // generate token
    const token = generateToken(user._id);

    console.timeEnd("TOKEN");

    console.timeEnd("LOGIN_TOTAL");
    
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.log("Error in login route:", error);
    return res.status(500).json({ message: "Internal server error" });

  }
});

router.get("/getUserDetails", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: req.user._id,
        pushToken: req.user.pushToken,
      }
    });
  } catch (error) {
    console.log("Error in getUserDetails route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})
router.put("/updateFCMToken", protectRoute, async (req, res) => {
  try {
    console.log("At updateFCMToken api req body >>> ", req.body);
    const pushToken = req.body.pushToken;

    if (!pushToken) {
      return res.status(400).json({ message: "Push token is required" });
    }

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(userId,
      { pushToken: pushToken },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "FCM token updated successfully" });

  } catch (error) {
    console.log("Error in updateFCMToken route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

});

router.put("/updateProfile", protectRoute, upload.single("profileImage"), async (req, res) => {
  try {
    console.log("At updateProfile api req body >>> ", req.body);
    const { userName, dateOfBirth } = req.body;
    const profileImageFile = req.file;

    const existingUser = await User.findById(req.user._id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //Default old image url
    let profileImageUrl = existingUser.profileImage;

    if (req.file) {
      console.log("New profile image received");

      //Delete old image from cloudinary
      if (existingUser.profileImage &&
        existingUser.profileImage.includes("cloudinary")) {

        try {
          const olfImageUrl = existingUser.profileImage;
          const urlParts = olfImageUrl.split("/");
          const imageName = urlParts[urlParts.length - 1].split(".")[0];
          const folderName = urlParts[urlParts.length - 2];
          const publicId = `${folderName}/${imageName}`;
          console.log("Deleting old image from Cloudinary with public ID:", publicId);

          await cloudinary.uploader.destroy(publicId);
          console.log("Old image deleted successfully from Cloudinary");
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
        }
      }

      //Upload new image to cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path,
        { folder: "taskontime_profiles" }
      )
      if (uploadResult && uploadResult.secure_url) {
        profileImageUrl = uploadResult.secure_url;
        console.log("New profile image uploaded to Cloudinary successfully:", profileImageUrl);
      }
      const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
          username: userName,
          dateOfBirth,
          profileImage: profileImageUrl
        },
        { new: true }
      )

    }
  } catch (error) {
    console.log("Error in updateProfile route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;