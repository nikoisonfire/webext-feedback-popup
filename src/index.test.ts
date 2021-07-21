import WebExtFeedbackPopup from "./index";

const mockStoreLinks = {
  firefox: "https://addons.mozilla.org/de/firefox/addon/grammarly-1/",
  chrome:
    "https://chrome.google.com/webstore/detail/grammarly-for-chrome/kbfnbcaeplbcioakkpcpgfkobkghlhen",
  opera: "https://addons.opera.com/de/extensions/details/opera-ad-blocker/",
  edge: "https://www.microsoft.com/en-us/p/grammarly-for-microsoft-edge/9p59wxtbhzzm?activetab=pivot:overviewtab",
  safari: "https://apps.apple.com/us/app/grammarly-for-safari/id1462114288",
};

let storageMock: Record<string, unknown> = {};

function getStorage(key: string) {
  return new Promise((resolve, reject) => {
    if (storageMock[key]) resolve(storageMock);
    else reject("Key not found");
  });
}
function setStorage(obj: any) {
  return new Promise((resolve) => {
    storageMock = obj;
    resolve(true);
  });
}

jest.mock("webextension-polyfill-ts", () => {
  return {
    browser: {
      storage: {
        local: {
          get: getStorage,
          set: setStorage,
        },
      },
    },
  };
});

jest.mock(
  "url:./icons/chrome-logo.png",
  () =>
    new Array({
      default: "/icons/chrome-logo.png",
    })
);

document.body.innerHTML = `
  <div>
  </div>
`;

const mock = new WebExtFeedbackPopup({
  window: window,
  headline: "Would you mind sparing some feedback?",
  text: "We've put a lot of love into this project, would you mind sharing your thoughts and maybe a feedback on it?",
  installDate: new Date(2020, 3, 1, 10, 0, 0),
  frequency: 2,
  timeout: 20000,
  storeLinks: mockStoreLinks,
});

describe("index text", () => {
  test("constructor: should construct mock object", () => {
    expect(mock).toBeDefined();
    expect(mock).toBeInstanceOf(WebExtFeedbackPopup);
    expect(mock._headline).not.toBeNull();
  });

  test("constructor: should add Modal and its children to window ", () => {
    expect(window.document.body.innerHTML).toContain('<div class="fbm-modal">');
    expect(window.document.body.innerHTML).toContain(
      '<h3 class="fbm-headline">'
    );
    expect(window.document.body.innerHTML).toContain('<span class="fbm-text">');
    expect(window.document.body.innerHTML).toContain(
      '<button class="fbm-button">'
    );
  });

  test("constructor: should add default light style", () => {
    expect(document.head.innerHTML).toContainIgnoreWS(
      "background-color:#e1462c80;"
    );
  });

  test("constructor: should add explicit dark style", () => {
    const shallowWindow = { ...window };

    const mock2 = new WebExtFeedbackPopup({
      window: shallowWindow,
      headline: "Would you mind sparing some feedback?",
      text: "We've put a lot of love into this project, would you mind sharing your thoughts and maybe a feedback on it?",
      installDate: new Date(2020, 3, 1, 10, 0, 0),
      theme: "dark",
      storeLinks: mockStoreLinks,
    });
    expect(mock2).toBeDefined();
    expect(shallowWindow.document.head.innerHTML).toContainIgnoreWS(
      "background-color:#1D2D50;"
    );
  });
});
