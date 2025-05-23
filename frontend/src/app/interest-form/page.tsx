"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  referrer: string;
  commitment: "FUNDRAISER" | "TEAM_CAPTAIN" | "";
}

export default function InterestFormPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    referrer: "",
    commitment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "FUNDRAISER" | "TEAM_CAPTAIN";
    setFormData((prev) => ({
      ...prev,
      commitment: value,
    }));
    if (fieldErrors.commitment) {
      setFieldErrors((prev) => ({
        ...prev,
        commitment: "",
      }));
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setError(null);
      if (fieldErrors.recaptcha) {
        setFieldErrors((prev) => ({ ...prev, recaptcha: "" }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setFieldErrors({});
    setIsVerifying(true);

    const currentFieldErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      currentFieldErrors.fullName = "Full Name is required.";
    }
    if (!formData.email.trim()) {
      currentFieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      currentFieldErrors.email = "Email address is invalid.";
    }
    if (!formData.commitment) {
      currentFieldErrors.commitment = "Commitment choice is required.";
    }
    if (!recaptchaToken) {
      currentFieldErrors.recaptcha = "Please complete the CAPTCHA.";
    }

    if (Object.keys(currentFieldErrors).length > 0) {
      setFieldErrors(currentFieldErrors);
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch("/api/submit-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
          setFieldErrors(result.errors);
        } else {
          setError(result.message || "Failed to submit form");
        }
        throw new Error(result.message || "Form submission failed");
      }

      console.log("Form submission successful:", result);
      setSubmitted(true);
    } catch (err) {
      if (!error && Object.keys(fieldErrors).length === 0) {
        if (err instanceof Error) {
          setError(
            err.message.includes("Form submission failed")
              ? err.message
              : "An unexpected error occurred during submission.",
          );
        } else {
          setError("An unexpected error occurred during submission.");
        }
      }
      console.error("Form submission error details:", err);
    } finally {
      setIsVerifying(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg">
          Your interest form has been submitted successfully. We will be in
          touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Join the Giving Bridge Challenge!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Let&apos;s make September count—because recovery is a journey that no
          one should walk alone.
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
            id="general-form-error"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
          <h1 id="form-title" className="sr-only">
            Interest Form for 30-for-30 Challenge
          </h1>
          {/* Full Name */}
          <div className="mb-6">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First and Last Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby={
                fieldErrors.fullName ? "fullName-error" : undefined
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {fieldErrors.fullName && (
              <p
                id="fullName-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Cell Phone */}
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cell phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {fieldErrors.phone && (
              <p
                id="phone-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Home Address */}
          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Home address (Street, City, State, Zip) (Optional)
            </label>
            <textarea
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              aria-describedby={
                fieldErrors.address ? "address-error" : undefined
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {fieldErrors.address && (
              <p
                id="address-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.address}
              </p>
            )}
          </div>

          {/* Referrer */}
          <div className="mb-6">
            <label
              htmlFor="referrer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Who referred or recruited you? (First and Last Name) (Optional)
            </label>
            <input
              type="text"
              name="referrer"
              id="referrer"
              value={formData.referrer}
              onChange={handleChange}
              aria-describedby={
                fieldErrors.referrer ? "referrer-error" : undefined
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {fieldErrors.referrer && (
              <p
                id="referrer-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.referrer}
              </p>
            )}
          </div>

          {/* Commitment */}
          <div className="mb-6">
            <fieldset
              aria-describedby={
                fieldErrors.commitment ? "commitment-error" : undefined
              }
            >
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Do you want to commit to being a Fundraiser or Team Captain?
              </legend>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="fundraiser"
                    className="flex items-center p-3 border border-gray-300 rounded-md hover:border-indigo-500 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500"
                  >
                    <input
                      type="radio"
                      name="commitment"
                      id="fundraiser"
                      value="FUNDRAISER"
                      checked={formData.commitment === "FUNDRAISER"}
                      onChange={handleRadioChange}
                      required
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-3 block text-sm text-gray-800">
                      <strong className="font-medium">Fundraiser</strong>
                      <span className="block text-xs text-gray-500">
                        Find 30 Donors in 30 Days
                      </span>
                    </span>
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="team_captain"
                    className="flex items-center p-3 border border-gray-300 rounded-md hover:border-indigo-500 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500"
                  >
                    <input
                      type="radio"
                      name="commitment"
                      id="team_captain"
                      value="TEAM_CAPTAIN"
                      checked={formData.commitment === "TEAM_CAPTAIN"}
                      onChange={handleRadioChange}
                      required
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-3 block text-sm text-gray-800">
                      <strong className="font-medium">Team Captain</strong>
                      <span className="block text-xs text-gray-500">
                        Build a team of fundraisers and win prizes
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </fieldset>
            {fieldErrors.commitment && (
              <p
                id="commitment-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {fieldErrors.commitment}
              </p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="mb-6">
            <div className="flex justify-center md:justify-start">
              {/* Wrapper for scaling reCAPTCHA on small screens */}
              <div className="recaptcha-wrapper">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleRecaptchaChange}
                  aria-describedby={
                    fieldErrors.recaptcha ? "recaptcha-error" : undefined
                  }
                />
              </div>
            </div>
            {fieldErrors.recaptcha && (
              <p
                id="recaptcha-error"
                className="mt-1 text-xs text-red-600 text-center md:text-left"
                role="alert"
              >
                {fieldErrors.recaptcha}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full md:w-auto md:max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isVerifying ? "Submitting..." : "Submit Interest"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-8 text-center">
          By submitting this form, you agree to our Privacy Policy. Your
          information will be used to contact you about the Giving Bridge
          initiative. We respect your privacy and will not share your
          information with unauthorized third parties. You may be contacted by
          The Phoenix for marketing purposes. The Phoenix adheres to Google API
          Services User Data Policy, including the Limited Use requirements,
          when using and transferring to any other app information received from
          Google APIs.
          <br /> <br />
          This site is protected by reCAPTCHA and the Google&nbsp;
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Privacy Policy
          </a>
          &nbsp;and&nbsp;
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Terms of Service
          </a>
          &nbsp;apply.
        </p>
      </div>
    </div>
  );
}

/* Add this CSS to a global stylesheet or within a <style jsx global> tag 
   if you don't have a global CSS file easily configurable for Next.js pages.
   For simplicity here, assuming you might add it to a global styles.css or similar.
   If using Tailwind exclusively, this part is harder to do purely with utility classes.
*/

/*
.recaptcha-wrapper {
  display: inline-block; // Or block, depending on layout needs
}

@media (max-width: 400px) { // Adjust breakpoint as needed
  .recaptcha-wrapper {
    transform: scale(0.8); // Adjust scale factor as needed
    transform-origin: 0 0; // Scale from top-left
    max-width: calc(100% / 0.8); // Counteract scaling for layout if parent is restrictive
    margin-bottom: -20px; // Adjust if scaling affects layout below
  }
  // If the reCAPTCHA widget itself has an iframe, you might need to target it too,
  // but usually scaling the wrapper is enough.
}
*/
