import cron from "cron";
import https from "https";

const targetUrl = process.env.API_URL || "http://localhost:3000";

const job = new cron.CronJob("*/14 * * * *", function () {
    console.log("Cron job pinging:", targetUrl);
    https.get(targetUrl, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log("Cron job executed successfully at", new Date());
        } else {
            console.error("Cron job failed with status code:", res.statusCode);
            console.log("Ping URL:", targetUrl);
            console.log("Status:", res.statusCode);
            console.log("Headers:", res.headers);
        }
    }).on("error", (err) => {
        console.error("Cron job error:", err);
    });
});

export default job;

