'use client';

import { useState } from 'react';
import { site } from '@/data/site';
import { BUILD_TYPES } from '@/lib/estimate';

/**
 * NOTE FOR LAUNCH
 * ───────────────
 * This form has no server behind it. On submit it opens the visitor's own
 * email client with everything pre-filled, which works on day one with zero
 * infrastructure and zero cost — but it does depend on them having a mail
 * client configured, and you get no record of submissions.
 *
 * When you want real form delivery, sign up for Formspree, Resend or
 * Basin, then replace the body of `handleSubmit` with a POST to their
 * endpoint. The field names below are already sensible for that.
 */

const BUDGETS = [
  'Not sure yet',
  'Under $25k',
  '$25k – $75k',
  '$75k – $150k',
  '$150k – $350k',
  '$350k – $750k',
  '$750k+',
];

const TIMELINES = ['As soon as possible', 'Within 3 months', '3–6 months', '6–12 months', 'Just exploring'];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();

    const body = [
      `Name: ${get('firstName')} ${get('lastName')}`,
      `Email: ${get('email')}`,
      get('phone') ? `Phone: ${get('phone')}` : null,
      '',
      `Project type: ${get('projectType')}`,
      `Location: ${get('location') || 'Not given'}`,
      `Budget: ${get('budget')}`,
      `Timeline: ${get('timeline')}`,
      '',
      'About the project:',
      get('message'),
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `New project enquiry — ${get('firstName')} ${get('lastName')}`
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input name="firstName" label="First name" required autoComplete="given-name" />
        <Input name="lastName" label="Last name" required autoComplete="family-name" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input name="email" label="Email" type="email" required autoComplete="email" />
        <Input name="phone" label="Phone" type="tel" autoComplete="tel" optional />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Select name="projectType" label="What are you building?" required>
          {BUILD_TYPES.map((t) => (
            <option key={t.id} value={t.label}>
              {t.label}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </Select>
        <Input name="location" label="Where is it?" placeholder="Town or area" optional />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Select name="budget" label="Rough budget" required>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
        <Select name="timeline" label="Timeline" required>
          {TIMELINES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/55"
        >
          Tell us about it
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="What are you picturing? What's the space like now? Anything you've already ruled in or out?"
          className="mt-2.5 w-full border border-ink/20 bg-white/70 px-4 py-3 text-[0.95rem] leading-relaxed placeholder:text-ink/30 focus:border-ink focus:outline-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send it over
      </button>

      {sent && (
        <p className="border border-cedar bg-cedar/15 p-4 text-sm leading-relaxed" role="status">
          Your email app should have opened with everything filled in — just hit send. If nothing
          happened, email{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>{' '}
          directly.
        </p>
      )}
    </form>
  );
}

/* ── Field primitives ── */

function Input({
  name,
  label,
  type = 'text',
  required,
  optional,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/55"
      >
        {label}
        {optional && <span className="ml-2 font-normal normal-case tracking-normal text-ink/30">optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2.5 w-full border border-ink/20 bg-white/70 px-4 py-3 text-[0.95rem] placeholder:text-ink/30 focus:border-ink focus:outline-none"
      />
    </div>
  );
}

function Select({
  name,
  label,
  required,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/55"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="mt-2.5 w-full border border-ink/20 bg-white/70 px-4 py-3 text-[0.95rem] focus:border-ink focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}
