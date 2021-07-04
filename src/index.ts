"use strict";
import detect, { Browser } from "./detection";
import { browser } from "webextension-polyfill-ts";

import * as chrome_icon from "url:./icons/chrome-logo.png";
import * as safari_icon from "url:./icons/safari-logo.png";
import * as edge_icon from "url:./icons/edge-logo.png";
import * as firefox_icon from "url:./icons/firefox-logo.png";

class WebExtRatingModal {
  // Frontend modal features
  _headline = "I'm waiting for your rating!";
  _text = "";
  _logo = "";

  // Document Object
  private _document: Document;
  private _window: Window;

  // Timeout until modal is shown - in ms
  private _timeout = 0;

  // Date and Time of Installation
  private _installDate: Date;

  // Store Links
  private _storeLinks: Record<Browser, string>;

  // Manual Mode to control the modal manually (default: disabled)
  private _manual = false;

  // default: only show once
  private _frequency = 1;

  // Light/Dark Theme
  private _theme = "light";

  private _onOpen: () => void;
  private _onClose: () => void;

  /**
   * Constructor
   * @param param0 object (see the docs for parameters)
   */
  constructor({
    window,
    headline,
    text,
    installDate,
    storeLinks,
    logo,
    frequency,
    timeout,
    theme,
    onOpen,
    onClose,
  }: {
    window: Window;
    headline: string;
    text: string;
    installDate: Date;
    storeLinks: Record<Browser, string>;
    logo?: string;
    frequency?: number;
    timeout?: number;
    theme?: "dark" | "light";
    onOpen?: () => void;
    onClose?: () => void;
  }) {
    this._document = window.document;
    this._window = window;

    this._headline = headline;
    this._text = text;
    this._logo = logo || "";

    this._timeout = timeout || 0;
    this._installDate = new Date(installDate) || Date.now();

    this._theme = theme || "light";
    this._storeLinks = storeLinks;

    this._frequency = frequency || 1;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = function () {};

    // use parameter function or do nothing
    this._onOpen = onOpen || noop;
    this._onClose = onClose || noop;

    // Show the modal if it's showtime and manual-mode is disabled (default)
    this.isShowtime().then((result) => {
      if (result && !this._manual) {
        this.isShownEnoughTimes().then((result) => {
          if (!result) this.showModal();
        });
      }
    });
  }

  /**
   * Add the styles of the modal to <style> tag inserted into the document <head>
   * @param styleRules : string, CSS style rules
   */
  public setStyle = (styleRules: string): void => {
    const style = this.createElement("style");
    style.innerHTML = styleRules;
    this._document.head.appendChild(style);
  };

  /**
   * Add the default styles based on the chosen theme
   * @param theme "light" / "dark"
   */
  public addDefaultStyles = (theme: string): void => {
    const darkTheme = `
        .fbm-blur {
            position: fixed;
            z-index: 3;
        
            width: 100vw;
            height: 100vh;
        
            left: 0;
            top: 0;
            background-color: #00000080;
        }
        
        @keyframes modalAnimation {
            from {
                top: 45%;
            }
            to {
                top: 50%;
            }
        }
        .fbm-modal {
            position: absolute;
            top: 50%;
            left: 50%;
        
            transform: translate(-50%, -50%);
            animation-name: modalAnimation;
            animation-duration: 1.5s;
            animation-delay: 0.2s;
        
            background-color: #1D2D50;
            border-radius: 25px;
            padding: 15px;
        
            color: #F8F0E3;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }
        .fbm-modal .fbm-headline {
            text-align: center;
            display: block;
            width: 100%;
            padding: 0 0 5px 15px;
            font-size: 1.4rem;
            font-family: inherit;
            margin: 0;
        }
        .fbm-modal .fbm-text {
            font-size: 1.1rem;
            line-height: 2;
            padding: 30px 15px;
        }
        .fbm-modal .fbm-button {
            background-position: 10px 10px;
            background-repeat: no-repeat;
            cursor: pointer;
            padding: 12px 20px;
            background-color: #3D517B;
            transition: 0.2s ease-in;
            color: white;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .fbm-modal .fbm-button:hover {
            background-color: #3D517B80;
        }
        .fbm-modal .fbm-button:focus {
            outline: none;
        }
        .fbm-modal .fbm-button img {
          margin-right: 7px;
        }
        .fbm-modal .fbm-logo {
            width: 50%;
            margin-bottom: 20px;
        }
        .fbm-modal .fbm-logo:focus {
            outline: none;
        }
    `;
    const lightTheme = `
        .fbm-blur {
            position: fixed;
            z-index: 3;
        
            width: 100vw;
            height: 100vh;
        
            left: 0;
            top: 0;
            background-color: #00000080;
        }
        @keyframes modalAnimation {
            from {
                top: 45%;
            }
            to {
                top: 50%;
            }
        }
        .fbm-modal {
            position: absolute;
            top: 50%;
            left: 50%;
        
            transform: translate(-50%, -50%);
            animation-name: modalAnimation;
            animation-duration: 1.5s;
            animation-delay: 0.2s;
        
            background-color: white;
            border-radius: 25px;
            padding: 15px;
        
            color: #111;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }
        .fbm-modal .fbm-headline {
            text-align: center;
            display: block;
            width: 100%;
            padding: 0 0 5px 15px;
            font-size: 1.4rem;
            font-family: inherit;
            margin: 0;
        }
        .fbm-modal .fbm-text {
            font-size: 1.1rem;
            line-height: 2;
            padding: 30px 15px;
        }
        .fbm-modal .fbm-button {
            background-position: 10px 10px;
            background-repeat: no-repeat;
            cursor: pointer;
            padding: 12px 20px;
            background-color: #e1462c;
            transition: 0.2s ease-in;
            color: white;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            font-size: 1.1em;
        }
        .fbm-modal .fbm-button:hover {
            background-color: #e1462c80;
        }
        .fbm-modal .fbm-button:focus {
            outline: none;
        }
        .fbm-modal .fbm-button img {
          margin-right: 7px;
        }
        .fbm-modal .fbm-logo {
            width: 50%;
            margin-bottom: 20px;
        }
        .fbm-modal .fbm-logo:focus {
            outline: none;
        }
    `;
    const choice = theme === "dark" ? darkTheme : lightTheme;
    this.setStyle(choice);
  };

  // Shortform create a HTMLElement
  private createElement(tagName: string): HTMLElement {
    return this._document.createElement(tagName);
  }
  // Add Modal to user-specified Document object
  private addModalToDocument = (): void => {
    const blurEl: HTMLElement = this.createElement("div");
    const modalEl: HTMLElement = this.createElement("div");
    const headline: HTMLElement = this.createElement("h3");
    const subtext: HTMLElement = this.createElement("span");

    const logo = this.createLogo(this._logo);

    const button = this.createButton(
      this.getCorrectStoreLink(),
      this.getCorrectStoreButton()
    );

    headline.classList.add("fbm-headline");
    headline.innerHTML = this._headline;

    subtext.classList.add("fbm-text");
    subtext.innerHTML = this._text;

    modalEl.classList.add("fbm-modal");
    modalEl.appendChild(logo);
    modalEl.appendChild(headline);
    modalEl.appendChild(subtext);
    modalEl.appendChild(button);

    // Do not close the Modal when clicked on the child element
    modalEl.addEventListener("click", (ev) => {
      ev.stopPropagation();
    });

    blurEl.classList.add("fbm-blur");
    blurEl.appendChild(modalEl);

    // Close the Modal when clicked anywhere outside the modal (aka the blur element)
    blurEl.addEventListener("click", () => {
      this.hideModal(blurEl);
    });

    // Append the modal to the document body.
    this._document.body.appendChild(blurEl);
  };

  /**
   * Returns an HTMLElement Button representation with a onClick redirect
   * @param link string: url the user get's redirected to on click
   * @param buttonContent Array: [store icon, store button text]
   * @returns HTMLElement : r2u button element
   */
  private createButton = (link: string, buttonContent: any): HTMLElement => {
    const button: HTMLElement = this.createElement("button");
    button.classList.add("fbm-button");

    const imgTag = `<img src="${buttonContent[0].default}"/>`;

    button.innerHTML = imgTag + buttonContent[1];
    button.addEventListener("click", () => this.redirectTo(link));

    return button;
  };

  // Create Logo Element from source
  private createLogo = (src: string): HTMLImageElement => {
    const logo = this._document.createElement("img");
    logo.classList.add("fbm-logo");
    logo.src = src;

    return logo;
  };

  // Open a new tab after clicking the button
  private redirectTo = (link: string): void => {
    this._window.open(link, "_blank");
  };

  /**
   * Show the modal.
   */
  private showModal = (): void => {
    this.addDefaultStyles(this._theme);
    this.addModalToDocument();
    this.addToCache();
    this.toggleBodyScroll();
    this._onOpen();
  };
  /**
   * Hide the modal.
   * @param element fbm-blur div as HTMLElement
   */
  private hideModal = (element: HTMLElement): void => {
    this._document.body.removeChild(element);
    this.toggleBodyScroll();
    this._onClose();
  };

  /**
   * After opening the modal, add the timestamp to localStorage (for below checks)
   */
  private addToCache = (): void => {
    browser.storage.local
      .get("feedbackprompt")
      .then((data) => {
        if (data.feedbackprompt && data.feedbackprompt.length > 0) {
          const times = data.feedbackprompt;
          times.push(Date.now());
          browser.storage.local.set({ feedbackprompt: times });
        } else {
          const initialArr = [Date.now()];
          browser.storage.local.set({ feedbackprompt: initialArr });
        }
      })
      .catch((error) => console.log(error));
  };

  /**
   * Check if timeout has expired and modal can be shown
   * @returns Promise : true => show modal | false => don't show modal
   */
  private isShowtime = async () => {
    return new Promise((resolve, reject) => {
      // If the modal is already shown use the last "shown" date, not the installDate
      browser.storage.local
        .get("feedbackprompt")
        .then((data) => {
          const now = new Date(Date.now());
          // Declaration if the modal hasn't been shown already.
          let lastDate = this._installDate.getTime();

          if (data.feedbackprompt && data.feedbackprompt.length > 0) {
            const times = data.feedbackprompt;
            lastDate = times[times.length - 1];
          }

          // Calculate the time passed to see if it's time to show the modal again
          const timePassed = now.getTime() - lastDate;

          if (timePassed > this._timeout) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => reject(error));
    });
  };

  // TODO : Forge these two functions together because of confusion and redundancy

  /**
   * Based on the specified frequency, show the modal yes(false)/no(true)
   * @returns Promise: true => don't show modal anymore | false => show it, has been shown less time than specified frequency
   */
  private isShownEnoughTimes = async () => {
    return new Promise((resolve, reject) => {
      browser.storage.local
        .get("feedbackprompt")
        .then((data) => {
          if (data.feedbackprompt && data.feedbackprompt.length > 0) {
            const times = data.feedbackprompt;
            if (times.length >= this._frequency) {
              resolve(true);
              return;
            }
          }
          resolve(false);
          return;
        })
        .catch((error) => reject(error));
    });
  };

  /**
   * Determines correct Store Link by looking at the users userAgent
   * @returns Either the corresponding link to the browser the user is using, or – if undefined – returns the first item in storeLinks
   */
  private getCorrectStoreLink = (): string => {
    const browser = detect(navigator.userAgent);
    let resultBrowser: Browser = "chrome";

    // @ts-nolint-nextline
    const filter = Object.keys(browser).filter(
      (el) => browser[el as Browser] === true
    );

    if (filter.length === 0) {
      return "https://www.google.de";
    }
    // More than one engine was detected (i.e. Chrome -> Chrome + Webkit)
    if (filter.length > 1) {
      if (filter.includes("chrome")) {
        resultBrowser = "chrome";
      } else {
        resultBrowser = "chrome";
      }
    }
    // Only one engine
    else {
      resultBrowser = filter[0] as Browser;
    }

    return (
      this._storeLinks[resultBrowser] || Object.values(this._storeLinks)[0]
    );
  };

  /**
   * Returns the corresponding browser logo and button text
   * @returns [logo "image object"? (see imports), corresponding button text]
   */
  private getCorrectStoreButton = (): any => {
    const browser = detect(navigator.userAgent);

    // @ts-nolint-nextline
    const filter = Object.keys(browser).filter(
      (el) => browser[el as Browser] === true
    );

    if (filter.includes("chrome")) {
      return [chrome_icon, "Visit the Chrome Web Store"];
    }
    if (filter.includes("firefox")) {
      return [firefox_icon, "Visit Firefox Addons"];
    }
    if (filter.includes("safari")) {
      return [safari_icon, "Visit the App Store"];
    }
    if (filter.includes("edge")) {
      return [edge_icon, "Visit the Microsoft Store"];
    }
    return chrome_icon;
  };

  /**
   * Toggles scrolling the body (on/off) when the modal is open or closed
   */
  private toggleBodyScroll = (): void => {
    if (this._document.body.style.position === "fixed") {
      this._document.body.style.height = "100vh";
      this._document.body.style.overflowY = "hidden";
    } else {
      this._document.body.style.height = "";
      this._document.body.style.overflowY = "";
    }
  };

  public get timeout(): number {
    return this._timeout;
  }
  public set timeout(value) {
    this._timeout = value;
  }

  public get window(): Window {
    return this._window;
  }
  public set window(value: Window) {
    this._window = value;
  }

  public get installDate(): Date {
    return this._installDate;
  }
  public set installDate(value) {
    this._installDate = value;
  }
  /* 
BETA

  public get manual() {
    return this._manual;
  }
  public set manual(value) {
    this._manual = value;
  } */
}

export default WebExtRatingModal;
