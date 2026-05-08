import admin from "../../config/firebaseAdmin.js";

export const sendFCMNotification = async (
  pushTokensArray,
  title,
  body,
  playSound,
  profileImage
) => {

  console.log("Sending notification at >>>", new Date(), {
    pushTokensArray,
    title,
    body,
    playSound
  });

  if (!Array.isArray(pushTokensArray) || pushTokensArray.length === 0) {
    console.log("No tokens found");
    return;
  }

  const message = {
    tokens: pushTokensArray,
    // notification: {
    //   title,
    //   body,
    //   Image: profileImage,
    // },

    data: {
      title: title || "",
      body: body || "",
      type: playSound ? "REMINDER" : "TASK_CREATED",
      sound: playSound ? "alarm" : "notification_ring",
      image: profileImage || "",
    },

    android: {
      priority: "high",
      notification: {
        channelId: playSound ? "alarm-channel" : "default-channel",
        sound: playSound ? "alarm" : "notification_ring",
        image: profileImage || undefined,
      },
    },



    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          mutableContent: true,  // allows image to show on iOS
          sound: playSound ? "alarm.mp3" : "notification_ring.mp3",
        },
      },
      fcm_options: {
        image: profileImage || undefined,  // iOS support
      },
    },

  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("FCM response:", response);
  } catch (error) {
    console.error("FCM Error:", error);
  }
};