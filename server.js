const express = require("express");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const msg = {
    to, //arrive from body by frontend app 
    from: process.env.EMAIL_FROM || "your_email@domain.com",
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error
    );
    return res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
