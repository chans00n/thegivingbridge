import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  referrer: string;
  commitment: "FUNDRAISER" | "TEAM_CAPTAIN" | "";
  submissionTimestamp?: string;
}

interface FormDataWithCaptcha extends FormData {
  recaptchaToken?: string;
}

function getGoogleCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
    const keyPath = path.resolve(
      process.cwd(),
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    );
    if (fs.existsSync(keyPath)) {
      return JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    }
    console.error("Service account key file not found at path:", keyPath);
    return null;
  }
  console.error(
    "Google Sheets API credentials not found in environment variables.",
  );
  return null;
}

export async function POST(request: Request) {
  let formData: FormDataWithCaptcha;
  try {
    formData = (await request.json()) as FormDataWithCaptcha;
    formData.submissionTimestamp = new Date().toISOString();
    console.log(
      "Received interest form data (with timestamp & captcha token):",
      formData,
    );

    // --- Begin reCAPTCHA Verification ---
    const recaptchaToken = formData.recaptchaToken;
    if (!recaptchaToken) {
      console.warn("reCAPTCHA token missing.");
      return NextResponse.json(
        { message: "CAPTCHA verification failed: Token missing." },
        { status: 400 },
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error(
        "reCAPTCHA secret key is not set in environment variables.",
      );
      return NextResponse.json(
        { message: "Server configuration error regarding CAPTCHA." },
        { status: 500 },
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    let recaptchaSuccessful = false;
    try {
      const recaptchaResponse = await fetch(verificationUrl, {
        method: "POST",
      });
      const recaptchaData = await recaptchaResponse.json();
      console.log("reCAPTCHA verification response:", recaptchaData);
      if (recaptchaData.success) {
        recaptchaSuccessful = true;
      } else {
        // Log specific error codes from Google if available
        console.warn(
          "reCAPTCHA verification failed:",
          recaptchaData["error-codes"],
        );
      }
    } catch (captchaError) {
      console.error(
        "Error during reCAPTCHA verification request:",
        captchaError,
      );
      // Don't immediately return; proceed to validation but mark as failed
    }

    if (!recaptchaSuccessful) {
      return NextResponse.json(
        { message: "CAPTCHA verification failed. Please try again." },
        { status: 400 }, // Or 403 Forbidden
      );
    }
    // --- End reCAPTCHA Verification ---

    // --- Begin Server-Side Validation ---
    const errors: { [key: string]: string } = {};
    if (
      !formData.fullName ||
      typeof formData.fullName !== "string" ||
      formData.fullName.trim() === ""
    ) {
      errors.fullName = "Full name is required.";
    }
    if (
      !formData.email ||
      typeof formData.email !== "string" ||
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      errors.email = "A valid email is required.";
    }
    if (
      !formData.commitment ||
      !["FUNDRAISER", "TEAM_CAPTAIN"].includes(formData.commitment)
    ) {
      errors.commitment =
        "A valid commitment (FUNDRAISER or TEAM_CAPTAIN) is required.";
    }
    if (formData.phone && typeof formData.phone !== "string") {
      errors.phone = "Phone number must be a string.";
    }
    if (formData.address && typeof formData.address !== "string") {
      errors.address = "Address must be a string.";
    }
    if (formData.referrer && typeof formData.referrer !== "string") {
      errors.referrer = "Referrer name must be a string.";
    }

    if (Object.keys(errors).length > 0) {
      console.warn("Server-side validation failed:", errors);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }, // Bad Request
      );
    }
    // --- End Server-Side Validation ---

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_TO &&
      process.env.EMAIL_FROM
    ) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        const emailHtml = `
          <h1>New Interest Form Submission</h1>
          <p><strong>Full Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || "N/A"}</p>
          <p><strong>Address:</strong> ${formData.address || "N/A"}</p>
          <p><strong>Referrer:</strong> ${formData.referrer || "N/A"}</p>
          <p><strong>Commitment:</strong> ${formData.commitment}</p>
          <p><strong>Submitted At:</strong> ${formData.submissionTimestamp}</p>
        `;
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: "New Giving Bridge Interest Form Submission",
          html: emailHtml,
        };
        await transporter.sendMail(mailOptions);
        console.log("Interest form email sent successfully.");
      } catch (emailError) {
        console.error("Failed to send interest form email:", emailError);
      }
    } else {
      console.warn(
        "Email configuration is incomplete. Skipping email sending.",
      );
    }

    const googleCreds = getGoogleCredentials();
    const googleSheetId = process.env.GOOGLE_SHEET_ID;

    if (googleCreds && googleSheetId) {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: googleCreds,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const sheets = google.sheets({ version: "v4", auth });

        const valuesToAppend = [
          [
            formData.submissionTimestamp,
            formData.fullName,
            formData.email,
            formData.phone || "",
            formData.address || "",
            formData.referrer || "",
            formData.commitment,
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: googleSheetId,
          range: "Sheet1!A:G",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: valuesToAppend,
          },
        });
        console.log("Data appended to Google Sheet successfully.");
      } catch (sheetError) {
        console.error("Failed to append data to Google Sheet:", sheetError);
      }
    } else {
      console.warn(
        "Google Sheets configuration is incomplete. Skipping Sheets append.",
      );
    }

    return NextResponse.json(
      {
        message: "Interest form submitted successfully!",
        data: { ...formData },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing interest form submission:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to submit interest form", error: errorMessage },
      { status: 500 },
    );
  }
}
