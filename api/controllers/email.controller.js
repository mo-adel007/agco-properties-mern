import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendJobApplicationDubai = async (req, res, next) => {
  const { name, email, phone, position } = req.body;
  const cv = req.file;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL_JOB_DUBAI, // Using the specific recipient email
      subject: `Job Application for ${position}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${position}\n`,
      attachments: [
        {
          filename: cv.originalname,
          content: cv.buffer,
          contentType: cv.mimetype,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Application sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send application. Please try again later.",
    });
  }
};
export const sendJobApplicationCairo = async (req, res, next) => {
  const { name, email, phone, position } = req.body;
  const cv = req.file;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL_JOB_CAIRO, // Using the specific recipient email
      subject: `Job Application for ${position}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${position}\n`,
      attachments: [
        {
          filename: cv.originalname,
          content: cv.buffer,
          contentType: cv.mimetype,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Application sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send application. Please try again later.",
    });
  }
};

export const sendContactEmail = async (req, res) => {
  const { inquiryType, role, fields } = req.body;

  if (!fields || !Array.isArray(fields)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid form data" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const emailContent = `
    <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
    <p><strong>Role:</strong> ${role}</p>
    ${fields
      .map((field) => `<p><strong>${field.label}:</strong> ${field.value}</p>`)
      .join("")}
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL_CONTACT, // Using the specific recipient email
    subject: `New Contact Form Submission - ${inquiryType}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

export const listYourProperty = async (req, res) => {
  const {
    userType,
    firstName,
    lastName,
    phoneNumber,
    email,
    propertyType,
    zipCode,
    streetAddress,
    area,
    city,
    bedrooms,
    bathrooms,
    areaSize,
    budget,
    notes,
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL_PROPERTY, // Using the specific recipient email
      subject: "New Property Listing Request",
      text: `New property listing request from ${firstName} ${lastName}.
      
User Type: ${userType}
Phone Number: ${phoneNumber}
Email: ${email}

Property Information:
Type: ${propertyType}
Zip Code: ${zipCode}
Street Address: ${streetAddress}
Area: ${area}
City: ${city}
Number of Bedrooms: ${bedrooms}
Number of Bathrooms: ${bathrooms}
Area Size: ${areaSize}
Budget: ${budget}

Notes: ${notes || "None"}
      `,
    });

    res
      .status(200)
      .json({ message: "Property listing submitted successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error submitting property listing." });
  }
};
export const registerInterest = async (req, res) => {
  const { name, email, phoneNumber, listingId,listingName  } = req.body;

  // Configure the email transporter using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL_CONTACT,
      subject: `Interest Registered for Property ID: ${listingId}`,
      text: `A new interest has been registered for the property with the following details:

Name: ${name}
Email: ${email}
Phone Number: ${phoneNumber}
Listing ID: ${listingId}
Listing Name: ${listingName}

      `,
    };

    await transporter.sendMail(mailOptions);

    // Send a response back to the client
    res.status(200).json({
      success: true,
      message: "Interest registered successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register interest. Please try again later.",
    });
  }
};