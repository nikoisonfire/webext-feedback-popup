export type Browser = "webkit" | "chrome" | "firefox" | "safari" | "edge";

type BrowserObject = Record<Browser, boolean>;

function detect(userAgent: string): BrowserObject {
  const browser = {
    webkit: false,
    chrome: false,
    firefox: false,
    safari: false,
    edge: false,
  };

  if (!userAgent) {
    return browser;
  }

  const webkit = userAgent.match(/Web[kK]it[/]{0,1}([\d.]+)/);
  const chrome =
    userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/);
  const firefox = userAgent.match(/Firefox\/([\d.]+)/);
  const safari = userAgent.match(
    /Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/
  );
  const edge = userAgent.match(/Edge\/(\d{2,}\.[\d\w]+)$/);

  if (webkit && !edge) {
    browser.webkit = true;
  }
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

  return browser;
}

export default detect;
