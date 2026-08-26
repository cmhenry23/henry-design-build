'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { site } from '@/data/site';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Real, individual posts embedded via Instagram's own oEmbed widget — no API
 * key needed, since it only ever shows posts we've explicitly picked by URL.
 * There's no live "latest posts" feed here on purpose: Instagram's Graph API
 * needs a business-account access token to pull one, which this site doesn't
 * have. Update POSTS by hand with new permalinks when there's something
 * fresh worth featuring.
 */
const POSTS = [
  'https://www.instagram.com/henry_designbuild/p/DbtD--PlW6p/',
  'https://www.instagram.com/henry_designbuild/p/DawdduUsIep/',
  'https://www.instagram.com/henry_designbuild/p/DZYx8-6lcNc/',
];

export default function InstagramFeed() {
  // Covers client-side navigation onto a page that already has embed.js
  // loaded from an earlier page view — the script's own onLoad only fires
  // once per session, so new blockquotes need reprocessing here too.
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, []);

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-3">
        {POSTS.map((url) => (
          <blockquote
            key={url}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: '0 auto', width: '100%' }}
          />
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <p className="mt-8 text-center">
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost-light"
        >
          Follow {site.instagramHandle} on Instagram
        </a>
      </p>
    </div>
  );
}
