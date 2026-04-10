/**
 * Tribes MVP Invite Sender
 *
 * Reads a CSV of email + name pairs and sends Supabase magic-link invites
 * using the admin API. Use for the friends-and-family MVP launch.
 *
 * Prerequisites:
 *   1. Install deps (one-time): npm i -D @supabase/supabase-js csv-parse tsx dotenv
 *   2. Set env vars in new-website/.env.local:
 *        SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...    (service_role, NOT anon)
 *      ⚠️  SERVICE ROLE KEY IS SECRET — never commit it.
 *   3. Supabase email template and SMTP already configured per
 *      Marketing/MVP-Launch/supabase-invite-setup.md
 *   4. Place the contact list at: Marketing/MVP-Launch/mvp-invites.csv
 *      Columns: email,name  (see mvp-invites.csv.template for format)
 *
 * Usage:
 *   Dry run (logs what would be sent, no emails actually sent):
 *     npx tsx scripts/invite-mvp-users.ts --dry-run
 *
 *   Live run:
 *     npx tsx scripts/invite-mvp-users.ts
 *
 *   Send to a specific email only (first-time self-test):
 *     npx tsx scripts/invite-mvp-users.ts --only=you@example.com
 *
 * Safety notes:
 *   - ALWAYS do a dry run first to confirm the CSV parses correctly.
 *   - ALWAYS send a live invite to yourself first (--only=your@email.com)
 *     before running against the full list.
 *   - The script paces at 1.2s between calls to stay well under Supabase
 *     rate limits even on the built-in email sender. With real SMTP you
 *     can reduce this, but 50–150 invites over ~3 minutes is fine.
 */

import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import * as fs from "node:fs";
import * as path from "node:path";
import "dotenv/config";

type InviteRow = { email: string; name: string };

const CSV_PATH = path.resolve(
  __dirname,
  "../../Marketing/MVP-Launch/mvp-invites.csv"
);
const REDIRECT_TO = "https://trytribes.com/auth/callback";
const PACE_MS = 1200;
const SOURCE_TAG = "mvp-ff-v1";

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    only: args.find((a) => a.startsWith("--only="))?.split("=")[1],
  };
}

function loadContacts(): InviteRow[] {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(
      `CSV not found at ${CSV_PATH}\n` +
        `Copy mvp-invites.csv.template → mvp-invites.csv and fill in.`
    );
  }
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    comment: "#",
    trim: true,
  }) as InviteRow[];

  const valid = rows.filter(
    (r) => r.email && r.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)
  );
  const skipped = rows.length - valid.length;
  if (skipped > 0) {
    console.warn(`⚠️  Skipped ${skipped} row(s) with missing/invalid email.`);
  }
  return valid;
}

async function main() {
  const { dryRun, only } = parseArgs();

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.\n" +
        "   Create new-website/.env.local with both values set."
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let contacts = loadContacts();
  if (only) {
    contacts = contacts.filter((c) => c.email === only);
    if (contacts.length === 0) {
      console.error(`❌ No contact with email "${only}" found in CSV.`);
      process.exit(1);
    }
  }

  console.log(
    `\n📨 Tribes MVP invite sender\n` +
      `   CSV: ${CSV_PATH}\n` +
      `   Contacts to process: ${contacts.length}\n` +
      `   Mode: ${dryRun ? "DRY RUN (no emails sent)" : "LIVE"}\n` +
      `   Redirect: ${REDIRECT_TO}\n`
  );

  if (!dryRun) {
    console.log("   Starting in 3s... (Ctrl+C to abort)");
    await new Promise((r) => setTimeout(r, 3000));
  }

  let sent = 0;
  let failed = 0;
  const failures: { email: string; reason: string }[] = [];

  for (const row of contacts) {
    if (dryRun) {
      console.log(`  [dry] would invite → ${row.email} (name: ${row.name})`);
      sent++;
      continue;
    }

    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(row.email, {
        data: { name: row.name, source: SOURCE_TAG },
        redirectTo: REDIRECT_TO,
      });

      if (error) {
        failed++;
        failures.push({ email: row.email, reason: error.message });
        console.error(`  ❌ ${row.email} — ${error.message}`);
      } else {
        sent++;
        console.log(`  ✅ ${row.email}`);
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      failures.push({ email: row.email, reason: msg });
      console.error(`  ❌ ${row.email} — ${msg}`);
    }

    await new Promise((r) => setTimeout(r, PACE_MS));
  }

  console.log(
    `\n📊 Summary: ${sent} sent, ${failed} failed (of ${contacts.length} total)`
  );

  if (failures.length > 0) {
    console.log(`\n❌ Failures:`);
    for (const f of failures) console.log(`   ${f.email} — ${f.reason}`);
    console.log(
      `\n   Common causes:\n` +
        `   - Email already exists in Supabase (can't re-invite existing users)\n` +
        `   - SMTP not configured (see supabase-invite-setup.md Step 2)\n` +
        `   - Rate limit hit (increase PACE_MS and retry failures)`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
