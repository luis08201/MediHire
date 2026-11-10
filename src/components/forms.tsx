"use client";

import { useActionState, useEffect, useRef } from "react";
import { copy, fill } from "@/i18n/en";
import { submitApplication, submitStaffing, type FormState } from "@/lib/forms/actions";

const initial: FormState = { ok: false, errors: {}, values: {} };

function Errors({ state }: { state: FormState }) {
  if (state.ok || !state.message) return null;
  return (
    <div className="notice error" role="alert" tabIndex={-1}>
      <h2>{state.message}</h2>
      {state.errors.form ? <p>{state.errors.form}</p> : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="field-error">{message}</p>;
}

export function StaffingForm({
  issuedAt,
  submissionId,
  locations,
  specialties,
  services,
  defaults,
}: {
  issuedAt: number;
  submissionId: string;
  locations: { value: string; label: string }[];
  specialties: { value: string; label: string }[];
  services: { value: string; label: string }[];
  defaults: { location?: string; service?: string; specialty?: string };
}) {
  const [state, action, pending] = useActionState(submitStaffing, initial);
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) successRef.current?.focus();
  }, [state.ok]);
  const value = (key: string, fallback = "") => state.values[key] || fallback;

  if (state.ok) {
    return (
      <div className="notice success" ref={successRef} tabIndex={-1}>
        <h2>{copy.contact.successTitle}</h2>
        <p>{fill(copy.contact.successBody, { id: state.id || "" })}</p>
        {state.testMode ? <p className="test-flag">{copy.contact.testMode}</p> : <p>{copy.contact.delivered}</p>}
      </div>
    );
  }

  return (
    <form className="form-card" action={action} noValidate>
      <Errors state={state} />
      <input type="hidden" name="issued_at" value={issuedAt} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_url">Company URL</label>
        <input id="company_url" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="organization">{copy.contact.organization}</label>
        <input id="organization" name="organization" autoComplete="organization" defaultValue={value("organization")} aria-invalid={Boolean(state.errors.organization)} aria-describedby={state.errors.organization ? "organization-error" : undefined} />
        <FieldError id="organization-error" message={state.errors.organization} />
      </div>
      <div className="field">
        <label htmlFor="name">{copy.contact.name}</label>
        <input id="name" name="name" autoComplete="name" defaultValue={value("name")} aria-invalid={Boolean(state.errors.name)} aria-describedby={state.errors.name ? "name-error" : undefined} />
        <FieldError id="name-error" message={state.errors.name} />
      </div>
      <div className="field">
        <label htmlFor="email">{copy.contact.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={value("email")} aria-invalid={Boolean(state.errors.email)} aria-describedby={state.errors.email ? "email-error" : undefined} />
        <FieldError id="email-error" message={state.errors.email} />
      </div>
      <div className="field">
        <label htmlFor="phone">{copy.contact.phone} <span className="muted">({copy.contact.optional})</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={value("phone")} aria-invalid={Boolean(state.errors.phone)} aria-describedby={state.errors.phone ? "phone-error" : undefined} />
        <FieldError id="phone-error" message={state.errors.phone} />
      </div>
      <div className="field">
        <label htmlFor="specialty">{copy.contact.specialty}</label>
        <select id="specialty" name="specialty" defaultValue={value("specialty", defaults.specialty || "")} aria-invalid={Boolean(state.errors.specialty)} aria-describedby={state.errors.specialty ? "specialty-error" : undefined}>
          <option value="">{copy.contact.specialty}</option>
          {specialties.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          <option value="other">{copy.contact.otherSpecialty}</option>
        </select>
        <FieldError id="specialty-error" message={state.errors.specialty} />
      </div>
      <div className="field">
        <label htmlFor="location">{copy.contact.location}</label>
        <select id="location" name="location" defaultValue={value("location", defaults.location || "")} aria-invalid={Boolean(state.errors.location)} aria-describedby={state.errors.location ? "location-error" : undefined}>
          <option value="">{copy.contact.location}</option>
          {locations.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          <option value="other">{copy.contact.otherLocation}</option>
        </select>
        <FieldError id="location-error" message={state.errors.location} />
      </div>
      <div className="field">
        <label htmlFor="service">{copy.contact.service} <span className="muted">({copy.contact.optional})</span></label>
        <select id="service" name="service" defaultValue={value("service", defaults.service || "")}>
          <option value="">{copy.contact.service}</option>
          {services.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="needs">{copy.contact.needs}</label>
        <textarea id="needs" name="needs" defaultValue={value("needs")} aria-invalid={Boolean(state.errors.needs)} aria-describedby="needs-hint needs-error" />
        <p id="needs-hint" className="muted">{copy.contact.needsHint}</p>
        <FieldError id="needs-error" message={state.errors.needs} />
      </div>
      <button className="button primary" type="submit" disabled={pending}>{pending ? copy.contact.sending : copy.contact.submit}</button>
    </form>
  );
}

export function ApplicationForm({ issuedAt, submissionId, job }: { issuedAt: number; submissionId: string; job: string }) {
  const [state, action, pending] = useActionState(submitApplication, initial);
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) successRef.current?.focus();
  }, [state.ok]);
  const value = (key: string) => state.values[key] || "";

  if (state.ok) {
    return (
      <div className="notice success" ref={successRef} tabIndex={-1} id="apply">
        <h2>{copy.apply.successTitle}</h2>
        <p>{fill(copy.apply.successBody, { id: state.id || "" })}</p>
        {state.testMode ? <p className="test-flag">{copy.apply.testMode}</p> : null}
      </div>
    );
  }

  return (
    <form className="form-card" id="apply" action={action} noValidate>
      <h2>{copy.apply.title}</h2>
      <p>{copy.jobs.internalNote}</p>
      <Errors state={state} />
      <input type="hidden" name="issued_at" value={issuedAt} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="job" value={job} />
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_url_apply">Company URL</label>
        <input id="company_url_apply" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="applicant-name">{copy.apply.name}</label>
        <input id="applicant-name" name="name" autoComplete="name" defaultValue={value("name")} aria-invalid={Boolean(state.errors.name)} aria-describedby={state.errors.name ? "applicant-name-error" : undefined} />
        <FieldError id="applicant-name-error" message={state.errors.name} />
      </div>
      <div className="field">
        <label htmlFor="applicant-email">{copy.apply.email}</label>
        <input id="applicant-email" name="email" type="email" autoComplete="email" defaultValue={value("email")} aria-invalid={Boolean(state.errors.email)} aria-describedby={state.errors.email ? "applicant-email-error" : undefined} />
        <FieldError id="applicant-email-error" message={state.errors.email} />
      </div>
      <div className="field">
        <label htmlFor="applicant-phone">{copy.apply.phone} <span className="muted">({copy.contact.optional})</span></label>
        <input id="applicant-phone" name="phone" type="tel" autoComplete="tel" defaultValue={value("phone")} aria-invalid={Boolean(state.errors.phone)} aria-describedby={state.errors.phone ? "applicant-phone-error" : undefined} />
        <FieldError id="applicant-phone-error" message={state.errors.phone} />
      </div>
      <div className="field">
        <label htmlFor="applicant-location">{copy.apply.location}</label>
        <input id="applicant-location" name="location" defaultValue={value("location")} aria-invalid={Boolean(state.errors.location)} aria-describedby={state.errors.location ? "applicant-location-error" : undefined} />
        <FieldError id="applicant-location-error" message={state.errors.location} />
      </div>
      <div className="field">
        <label htmlFor="credential">{copy.apply.credential}</label>
        <input id="credential" name="credential" defaultValue={value("credential")} aria-invalid={Boolean(state.errors.credential)} aria-describedby="credential-hint credential-error" />
        <p id="credential-hint" className="muted">{copy.apply.credentialHint}</p>
        <FieldError id="credential-error" message={state.errors.credential} />
      </div>
      <div className="field">
        <label htmlFor="cv">{copy.apply.cv}</label>
        <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-invalid={Boolean(state.errors.cv)} aria-describedby="cv-hint cv-error" />
        <p id="cv-hint" className="muted">{copy.apply.cvHint}</p>
        <FieldError id="cv-error" message={state.errors.cv} />
      </div>
      <div className="field">
        <label htmlFor="note">{copy.apply.note} <span className="muted">({copy.contact.optional})</span></label>
        <textarea id="note" name="note" defaultValue={value("note")} aria-invalid={Boolean(state.errors.note)} aria-describedby={state.errors.note ? "note-error" : undefined} />
        <FieldError id="note-error" message={state.errors.note} />
      </div>
      <div className="field">
        <label className="check" htmlFor="consent">
          <input id="consent" name="consent" type="checkbox" value="yes" aria-invalid={Boolean(state.errors.consent)} aria-describedby={state.errors.consent ? "consent-error" : undefined} />
          <span>{copy.apply.consent}</span>
        </label>
        <FieldError id="consent-error" message={state.errors.consent} />
      </div>
      <button className="button primary" type="submit" disabled={pending}>{pending ? copy.apply.sending : copy.apply.submit}</button>
    </form>
  );
}
