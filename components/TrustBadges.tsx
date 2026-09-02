import Image from 'next/image';
import { site } from '@/data/site';

/**
 * Small credential badges — Red Seal, Wedi, insured, years in business.
 *
 * The Red Seal mark is the real "Proud Supporter" logo published by the
 * Red Seal program at red-seal.ca/eng/resources/endorse-support-logo.shtml,
 * downloaded from that official domain and used unmodified — its terms
 * grant permission to display it as-is for exactly this purpose. It's a
 * program-affiliation mark, not a personal certification crest: the actual
 * Red Seal Endorsement seal (the one stamped on a certificate) can only be
 * licensed for reuse by the issuing provincial authority — Skilled Trades
 * Ontario, in Ryan's case — so that one isn't self-serve. If that's worth
 * pursuing later, Ryan would need to request it from them directly.
 *
 * Wedi and insured stay as text pills — no official Wedi installer badge
 * has been sourced yet. If Ryan has the real file, swap it in the same way.
 *
 * Every credential here reflects something Ryan confirmed directly —
 * nothing is inferred or assumed.
 */
export default function TrustBadges({
  variant = 'light',
  className = '',
}: {
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const textBadges = [
    site.credentials.wedi && 'Wedi Certified',
    site.credentials.insured && 'Fully Insured',
    site.yearsExperience && `${site.yearsExperience} Years Experience`,
  ].filter(Boolean) as string[];

  if (!site.credentials.redSeal && textBadges.length === 0) return null;

  const pill =
    variant === 'dark' ? 'border-bone/25 text-bone/80' : 'border-ink/15 text-ink/70';

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {site.credentials.redSeal && (
        <li
          className={`flex h-[2.1rem] items-center border bg-white px-2 ${
            variant === 'dark' ? 'border-bone/25' : 'border-ink/15'
          }`}
        >
          <Image
            src="/brand/red-seal-proud-supporter.png"
            alt="Red Seal Proud Supporter"
            width={518}
            height={247}
            className="h-[1.5rem] w-auto"
          />
        </li>
      )}
      {textBadges.map((b) => (
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
