"use client";

import { useState } from "react";

// Demo-only: this is a fully working React form for the client walkthrough.
// Replace with the real GHL form submission endpoint once the GHL form exists.

interface FeedbackFormProps {
  userId?: string;
  email?: string;
  appVersion?: string;
}

type TradeMatch = "yes" | "maybe" | "no" | "";
type Referral = "yes" | "maybe" | "no" | "";
type FollowUp = "yes" | "no" | "";

interface FormState {
  firstImpression: string;
  easeRating: number;
  tradeMatch: TradeMatch;
  confusion: string;
  wantNext: string;
  referral: Referral;
  followUp: FollowUp;
  followUpEmail: string;
  otherNotes: string;
}

const initial: FormState = {
  firstImpression: "",
  easeRating: 0,
  tradeMatch: "",
  confusion: "",
  wantNext: "",
  referral: "",
  followUp: "",
  followUpEmail: "",
  otherNotes: "",
};

export default function FeedbackForm({
  userId,
  email,
  appVersion,
}: FeedbackFormProps) {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.easeRating === 0) newErrors.easeRating = "Pick a rating";
    if (!form.tradeMatch) newErrors.tradeMatch = "Pick one";
    if (!form.referral) newErrors.referral = "Pick one";
    if (!form.followUp) newErrors.followUp = "Pick one";
    if (form.followUp === "yes" && !form.followUpEmail.trim())
      newErrors.followUpEmail = "Email required for follow-up";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Demo mode: log the payload so the walkthrough audience can see what
    // the real submission will look like, then show thank-you.
    // eslint-disable-next-line no-console
    console.log("[Feedback demo submission]", {
      ...form,
      meta: { userId, email, appVersion, source: "mvp-feedback" },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-casablanca/20 mb-5">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#103730"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-firefly mb-3">
          Thank you.
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          Your feedback lands in front of the team today. If you said yes to a
          follow-up call, expect an email within a day or two.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setSubmitted(false);
          }}
          className="mt-6 text-sm text-firefly underline underline-offset-4 hover:text-casablanca-dark transition-colors"
        >
          Submit another response (demo)
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      {/* Q1 */}
      <div>
        <Label num={1}>In your own words, what is Tribes?</Label>
        <p className="text-xs text-gray-500 mb-2 ml-8">
          One sentence is perfect. Don&apos;t overthink it.
        </p>
        <textarea
          value={form.firstImpression}
          onChange={(e) => update("firstImpression", e.target.value)}
          rows={2}
          placeholder="e.g. A way for neighbors to share tools..."
          className={inputClass}
        />
      </div>

      {/* Q2 */}
      <div>
        <Label num={2} required>
          How easy was it to get started?
        </Label>
        <p className="text-xs text-gray-500 mb-3 ml-8">
          From opening the app to doing your first thing.
        </p>
        <div className="flex gap-2 ml-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("easeRating", n)}
              aria-label={`Rate ${n} out of 5`}
              className={`flex-1 h-12 rounded-lg border-2 font-bold transition-all ${
                form.easeRating === n
                  ? "bg-firefly border-firefly text-white scale-[1.03] shadow-md"
                  : "bg-white border-gray-200 text-gray-500 hover:border-casablanca hover:text-firefly"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5 ml-8">
          <span>Confusing</span>
          <span>Effortless</span>
        </div>
        {errors.easeRating && <ErrorMsg msg={errors.easeRating} />}
      </div>

      {/* Q3 */}
      <div>
        <Label num={3} required>
          Did you find something you&apos;d actually trade?
        </Label>
        <RadioGroup
          name="tradeMatch"
          value={form.tradeMatch}
          onChange={(v) => update("tradeMatch", v as TradeMatch)}
          options={[
            { value: "yes", label: "Yes, I'd use it today" },
            { value: "maybe", label: "Maybe, with more listings nearby" },
            { value: "no", label: "No, nothing fit" },
          ]}
        />
        {errors.tradeMatch && <ErrorMsg msg={errors.tradeMatch} />}
      </div>

      {/* Q4 */}
      <div>
        <Label num={4}>What&apos;s one thing that confused you?</Label>
        <p className="text-xs text-gray-500 mb-2 ml-8">
          Anywhere you paused, frowned, or thought &quot;huh?&quot;
        </p>
        <textarea
          value={form.confusion}
          onChange={(e) => update("confusion", e.target.value)}
          rows={2}
          placeholder="Optional"
          className={inputClass}
        />
      </div>

      {/* Q5 */}
      <div>
        <Label num={5}>What&apos;s one thing you&apos;d want next?</Label>
        <p className="text-xs text-gray-500 mb-2 ml-8">
          Feature, fix, or vibe — anything goes.
        </p>
        <textarea
          value={form.wantNext}
          onChange={(e) => update("wantNext", e.target.value)}
          rows={2}
          placeholder="Optional"
          className={inputClass}
        />
      </div>

      {/* Q6 */}
      <div>
        <Label num={6} required>
          Would you invite a neighbor to try it?
        </Label>
        <RadioGroup
          name="referral"
          value={form.referral}
          onChange={(v) => update("referral", v as Referral)}
          options={[
            { value: "yes", label: "Yes — already thinking of who" },
            { value: "maybe", label: "Maybe — I'd need to be able to pitch it" },
            { value: "no", label: "Not yet" },
          ]}
        />
        {errors.referral && <ErrorMsg msg={errors.referral} />}
      </div>

      {/* Q7 */}
      <div>
        <Label num={7} required>
          Can we follow up with a 15-minute call?
        </Label>
        <RadioGroup
          name="followUp"
          value={form.followUp}
          onChange={(v) => update("followUp", v as FollowUp)}
          options={[
            { value: "yes", label: "Yes — happy to chat" },
            { value: "no", label: "Not this time" },
          ]}
        />
        {form.followUp === "yes" && (
          <div className="ml-8 mt-3">
            <input
              type="email"
              value={form.followUpEmail}
              onChange={(e) => update("followUpEmail", e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
            {errors.followUpEmail && <ErrorMsg msg={errors.followUpEmail} />}
          </div>
        )}
        {errors.followUp && <ErrorMsg msg={errors.followUp} />}
      </div>

      {/* Q8 */}
      <div>
        <Label num={8}>Anything else we should hear?</Label>
        <p className="text-xs text-gray-500 mb-2 ml-8">
          Vent, dream, complain — this is your space.
        </p>
        <textarea
          value={form.otherNotes}
          onChange={(e) => update("otherNotes", e.target.value)}
          rows={3}
          placeholder="Optional"
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center font-bold text-firefly bg-casablanca hover:bg-casablanca-dark transition-all duration-300 px-8 py-4 rounded-lg text-lg min-h-[56px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-casablanca/30"
        >
          Send feedback
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Your responses go straight to the team. We read every one.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "ml-8 w-[calc(100%-2rem)] px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-ink placeholder:text-gray-400 focus:border-casablanca focus:outline-none transition-colors resize-none";

function Label({
  num,
  required,
  children,
}: {
  num: number;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 mb-1">
      <span className="shrink-0 w-6 h-6 rounded-full bg-casablanca/20 text-casablanca-dark flex items-center justify-center text-xs font-extrabold mt-0.5">
        {num}
      </span>
      <span className="font-bold text-firefly leading-snug">
        {children}
        {required && <span className="text-casablanca-dark ml-1">*</span>}
      </span>
    </label>
  );
}

function RadioGroup({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="ml-8 space-y-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
              selected
                ? "bg-firefly/5 border-firefly"
                : "bg-white border-gray-200 hover:border-casablanca/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "border-firefly"
                  : "border-gray-300"
              }`}
            >
              {selected && <span className="w-2.5 h-2.5 rounded-full bg-firefly" />}
            </span>
            <span
              className={`text-sm font-medium ${
                selected ? "text-firefly" : "text-gray-600"
              }`}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="ml-8 mt-2 text-xs text-red-600 font-medium" role="alert">
      {msg}
    </p>
  );
}
