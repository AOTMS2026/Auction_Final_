const THEME_VARIABLES = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--ring",
  "--brand",
  "--brand-foreground",
  "--brand-dark",
  "--ink",
];

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function createThemeCss() {
  const styles = getComputedStyle(document.documentElement);
  const variables = THEME_VARIABLES.map((name) => `  ${name}: ${styles.getPropertyValue(name).trim()};`)
    .filter((line) => !line.endsWith(": ;"))
    .join("\n");

  return `/*
 * PitchBid landing page theme
 * Import this file into another project and map these variables to your components.
 */
:root {
${variables}
  --landing-surface: #122026;
  --landing-surface-raised: #162a32;
  --landing-surface-card: #2e343a;
  --landing-text: #f2e9dc;
  --landing-text-muted: #abb4bd;
  --landing-primary: #38bdf8;
  --landing-secondary: #f97316;
  --landing-border: rgba(56, 189, 248, 0.35);
}

body {
  background: var(--landing-surface);
  color: var(--landing-text);
  font-family: "Plus Jakarta Sans", Arial, sans-serif;
}
`;
}

function createLandingHtml() {
  const landingPage = document.querySelector<HTMLElement>("[data-landing-page]");
  if (!landingPage) {
    throw new Error("Landing page root was not found.");
  }

  const clone = landingPage.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("script, [data-landing-export-control], [data-bottom-nav]").forEach((element) => {
    element.remove();
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PitchBid Landing Page</title>
    <link rel="stylesheet" href="./pitchbid-theme.css" />
  </head>
  <body>
${clone.outerHTML}
  </body>
</html>
`;
}

export function exportLandingPage() {
  downloadTextFile("pitchbid-landing-page.html", createLandingHtml(), "text/html;charset=utf-8");
  downloadTextFile("pitchbid-theme.css", createThemeCss(), "text/css;charset=utf-8");
}
