import { site } from '@/data/site';

/**
 * Small credential badges — Red Seal, Wedi, insured, years in business.
 * Text-only by design, not a reproduction of either body's official logo:
 * trademark/usage rules for an official mark aren't something to guess at.
 * If Ryan sends the real Red Seal / Wedi certified-installer badge image
 * files (the certifying bodies usually provide these directly to members),
 * swap them in here in place of the text pills below.
 *
 * Every badge here reflects a credential Ryan confirmed directly — nothing
 * is inferred or assumed.
 */
export default function TrustBadges({
  variant = 'light',
  className = '',
}: {
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const badges = [
    site.credentials.redSeal && 'Red Seal Certified',
    site.credentials.wedi && 'Wedi Certified',
    site.credentials.insured && 'Fully Insured',
    site.yearsExperience && `${site.yearsExperience} Years Experience`,
  ].filter(Boolean) as string[];

  if (badges.length === 0) return null;

  const pill =
    variant === 'dark'
      ? 'border-bone/25 text-bone/80'
      : 'border-ink/15 text-ink/70';

  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {badges.map((b) => (
        <li
          key={b}
          className={`border px-3 py-1.5 font-display text-[0.62rem] font-bold uppercase tracking-[0.12em] ${pill}`}
        >
          {b}
        </li>
      ))}
    </ul>
  );
}
