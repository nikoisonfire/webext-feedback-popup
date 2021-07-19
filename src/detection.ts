export type Browser = "chrome" | "firefox" | "safari" | "edge" | "opera";

type BrowserObject = Record<Browser, boolean>;

function detect(userAgent: string): BrowserObject {
  const browser = {
    chrome: false,
    firefox: false,
    safari: false,
    edge: false,
    opera: false,
  };

  if (!userAgent) {
    return browser;
  }

  const opera =
    userAgent.match(/Opera\/]{1}([\d.]+)/) ||
    userAgent.match(/(Chrome)(.+)OPR\/{1}([\d.]+)/);
  const chrome =
    userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/);
  const firefox = userAgent.match(/Firefox\/([\d.]+)/);
  const safari = userAgent.match(
    /Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/
  );
  const edge = userAgent.match(/Edge\/(\d{2,}\.[\d\w]+)$/);

  if (chrome && !edge) {
    browser.chrome = true;
  }
  if (firefox && !edge) {
    browser.firefox = true;
  }
  if (safari) {
    browser.safari = true;
  }
  if (edge) {
    browser.edge = true;
  }
  if (opera) {
    browser.opera = true;
  }

  return browser;
}

export default detect;
