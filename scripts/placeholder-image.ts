const PALETTE: [string, string][] = [
  ["#1e3a5f", "#0b1c2e"],
  ["#5f1e2e", "#2e0b16"],
  ["#1e5f3a", "#0b2e1c"],
  ["#5f4a1e", "#2e230b"],
  ["#3a1e5f", "#1c0b2e"],
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildPlaceholderSvg(label: string): string {
  const [from, to] = PALETTE[hashString(label) % PALETTE.length];
  const gradientId = `g-${hashString(label)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="960" height="600" fill="url(#${gradientId})" />
  <text x="480" y="284" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="#f5f5f5">${escapeXml(label)}</text>
  <text x="480" y="326" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" letter-spacing="2" fill="#c7c7c7">FOTO PRÓXIMAMENTE</text>
</svg>`;
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
