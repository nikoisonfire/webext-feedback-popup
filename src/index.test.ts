//import WebExtFeedbackPopup from "./index";

/* const mock = new WebExtFeedbackPopup({
  window,
  "Headline",
  "Text",
  new Date("2021-06-17T03:24:00"),
  "https://addons.mozilla.org/de/firefox/addon/https-everywhere/",
  "https://chrome.google.com/webstore/detail/https-everywhere/gcbommkclmclpchllfjekcdonpmejbdp",
  "",
  2000
});

test("constructor: should construct mock object", () => {
  expect(mock).toBeDefined();
  expect(mock._headline).not.toBeNull();
});

test("constructor: should add Modal and its children to window ", () => {
  expect(window.document.body.innerHTML).toContain('<div class="fbm-blur">');
  expect(window.document.body.innerHTML).toContain('<div class="fbm-modal">');
  expect(window.document.body.innerHTML).toContain('<h3 class="fbm-headline">');
  expect(window.document.body.innerHTML).toContain('<span class="fbm-text">');
  expect(window.document.body.innerHTML).toContain(
    '<button class="fbm-button">'
  );
});

test("isShowTime: should return true", () => {
  mock.timeout = 0;
  expect(mock.isShowtime()).toBe(true);
});

test("isShowTime: should return false", () => {
  mock.installDate = new Date(Date.now());
  mock.timeout = 999999;
  expect(mock.isShowtime()).toBe(false);
});

test("createElement: should return HTMLElement", () => {
  const testEl: HTMLElement = mock.createElement("div");
  expect(testEl).not.toBeNull;
  expect(testEl.tagName).toBe("DIV");
});

test("redirectTo: should open new window", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const oldWindow = mock.window;
  const mockWindow: any = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open: (_link: string, _target: string) => {
      return;
    },
  };

  mock.window = mockWindow;
  const spy = jest.spyOn(mockWindow, "open");
  mock.redirectTo("https://www.google.de");

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
  mock.window = oldWindow;
});
 */
