"use client";

import { useState } from "react";
import { EVENT_TYPES } from "@/lib/constants.js";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  eventLocation: "",
  guestCount: "",
  estimatedBudget: "",
  serviceInterest: "",
  message: "",
  consent: false
};

function Field({ id, label, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="invalid-text">{error}</p> : null}
    </div>
  );
}

export default function EnquiryForm({
  compact = false,
  source = "consultation",
  title,
  intro,
  submitLabel = "Submit Enquiry"
}) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});
    setMessage("");

    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source })
    });
    const payload = await response.json();

    if (!response.ok) {
      setErrors(payload.details || {});
      setMessage(payload.error || "Please review the highlighted fields.");
      setStatus("error");
      return;
    }

    setForm(initialState);
    setStatus("success");
    setMessage(payload.message || "Your enquiry has been received.");
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      {title || intro ? (
        <div className="form-intro">
          {title ? <h2 className="heading-serif">{title}</h2> : null}
          {intro ? <p>{intro}</p> : null}
        </div>
      ) : null}

      {message ? (
        <div className={status === "success" ? "notice success" : "notice error"} role="alert">
          {message}
        </div>
      ) : null}

      <div className="form-grid">
        <Field id="fullName" label="Full name" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            aria-invalid={Boolean(errors.fullName)}
            required
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            aria-invalid={Boolean(errors.email)}
            required
          />
        </Field>

        <Field id="phone" label="Phone">
          <input id="phone" name="phone" value={form.phone} onChange={updateField} />
        </Field>

        <Field id="eventType" label="Event type" error={errors.eventType}>
          <select
            id="eventType"
            name="eventType"
            value={form.eventType}
            onChange={updateField}
            aria-invalid={Boolean(errors.eventType)}
            required
          >
            <option value="">Select an event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        {!compact ? (
          <>
            <Field id="eventDate" label="Event date">
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={updateField}
              />
            </Field>

            <Field id="eventLocation" label="Event location">
              <input
                id="eventLocation"
                name="eventLocation"
                value={form.eventLocation}
                onChange={updateField}
              />
            </Field>

            <Field id="guestCount" label="Guest count">
              <input
                id="guestCount"
                name="guestCount"
                value={form.guestCount}
                onChange={updateField}
              />
            </Field>

            <Field id="estimatedBudget" label="Estimated budget">
              <input
                id="estimatedBudget"
                name="estimatedBudget"
                value={form.estimatedBudget}
                onChange={updateField}
              />
            </Field>
          </>
        ) : null}

        <Field id="serviceInterest" label="Service interest" error={errors.serviceInterest}>
          <input
            id="serviceInterest"
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={updateField}
            aria-invalid={Boolean(errors.serviceInterest)}
            required
          />
        </Field>

        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            rows={5}
            name="message"
            value={form.message}
            onChange={updateField}
            aria-invalid={Boolean(errors.message)}
            required
          />
        </Field>

        <div className="form-field form-field-full">
          <label className="checkbox-row" htmlFor="consent">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={updateField}
              aria-invalid={Boolean(errors.consent)}
              required
            />
            <span>I consent to Ephata Concepts contacting me about this enquiry.</span>
          </label>
          {errors.consent ? <p className="invalid-text">{errors.consent}</p> : null}
        </div>
      </div>

      <button className="btn-brand form-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
