import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#103730";
const GOLD = "#F6B74A";
const WHITE = "#FEFEFE";
const MUTED = "#879B97";

const pages = [
  {
    name: "og-home",
    title: "Rediscover Your Neighborhood.",
    subtitle: "Share What You Have. Get What You Need. Build Your Tribe.",
    badge: "Join 500+ neighbors already building their tribes",
  },
  {
    name: "og-neighbors",
    title: "Your Neighborhood Has Everything.",
    subtitle: "Borrow, lend, help, hire, trade — connect with neighbors who have what you need.",
    badge: "For Neighbors",
  },
  {
    name: "og-partners",
    title: "Build Tribes. Activate Communities.",
    subtitle: "Launch branded tribes, activate your members, and scale real community impact.",
    badge: "For Partners",
  },
];

const target = process.argv[2];
const toGenerate = target ? pages.filter((p) => p.name === target) : pages;

// Load and resize logo to crisp size
const logoPng = await sharp("public/tribes-logo-white.png")
  .resize({ height: 50, fit: "inside" })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoPng).metadata();

function createSvgText({ title, subtitle, badge }) {
  // Escape XML entities
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>

    <!-- Badge -->
    <rect x="80" y="100" width="${esc(badge).length * 8.7 + 32}" height="40" rx="20" fill="${GOLD}"/>
    <text x="98" y="126" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${BG}">${esc(badge)}</text>

    <!-- Title -->
    <text x="80" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="60" font-weight="700" fill="${WHITE}">${esc(title)}</text>

    <!-- Subtitle -->
    <text x="80" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="${MUTED}">${esc(subtitle)}</text>

    <!-- Divider + URL -->
    <line x1="260" y1="548" x2="260" y2="576" stroke="${MUTED}" stroke-opacity="0.5" stroke-width="2"/>
    <text x="276" y="568" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="${MUTED}">trytribes.com</text>
  </svg>`;
}

for (const page of toGenerate) {
  const svgBuffer = Buffer.from(createSvgText(page));

  const result = await sharp(svgBuffer)
    .composite([
      {
        input: logoPng,
        top: HEIGHT - 80 - Math.round(logoMeta.height / 2),
        left: 80,
      },
    ])
    .png({ quality: 100 })
    .toBuffer();

  await writeFile(`public/${page.name}.png`, result);
  console.log(`Generated: public/${page.name}.png (${Math.round(result.length / 1024)}KB)`);
}
