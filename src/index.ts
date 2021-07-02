"use strict";
import detect, { Browser } from "./detection";

import * as chrome_icon from "./icons/chrome-logo.png";
import * as safari_icon from "./icons/safari-logo.png";
import * as edge_icon from "./icons/edge-logo.png";
import * as firefox_icon from "./icons/firefox-logo.png";

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

  /**
   * Modal constructor.
   * @param window The current sites window object (usually just 'window')
   * @param headline Headline for the modal window (default: I'm waiting for your rating!)
   * @param text Feedback text/HTML to be shown below the headline
   * @param installDate Date the extension was installed (read the docs for more info)
   * @param ffLink (optional) Link to Firefox Addons
   * @param chromeLink (optional) Link to Chrome Web Store
   * @param logo (optional) Extension Logo, or leave blank
   * @param timeout (optional, but recommended) Timeout like "7 days", "3 months", ... (read the docs)
   */
  constructor({
    window,
    headline,
    text,
    installDate,
    storeLinks,
    logo,
    timeout,
  }: {
    window: Window;
    headline: string;
    text: string;
    installDate: Date;
    storeLinks: Record<Browser, string>;
    logo?: string;
    timeout?: number;
  }) {
    this._document = window.document;
    this._window = window;

    this._headline = headline;
    this._text = text;
    this._logo = logo || "";

    this._timeout = timeout || 0;
    this._installDate = new Date(installDate) || Date.now();

    this._storeLinks = storeLinks;

    // Show the modal if it's showtime and manual-mode is disabled (default)
    if (this.isShowtime() && !this._manual) {
      this.addDefaultStyles();
      this.addModalToDocument();
    }
  }

  // Set Modal CSS styling
  public setStyle = (styleRules: string): void => {
    const style = this.createElement("style");
    style.innerHTML = styleRules;
    this._document.head.appendChild(style);
  };

  public addDefaultStyles = (): void => {
    const defaultStyles = `
        .fbm-blur {
            position: fixed;
            z-index: 3;
        
            width: 100vw;
            height: 100vh;
        
            left: 0;
            top: 0;
            background-color: #00000040;
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
            display: block;
            width: 100%;
            padding: 0 0 5px 15px;
            font-size: 24px;
            font-family: inherit;
            margin: 0;
        }
        .fbm-modal .fbm-text {
            font-size: 18px;
            line-height: 2;
            padding: 15px;
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
            display: block;
            width: 100%;
        }
        .fbm-modal .fbm-button:hover {
            background-color: #e1462c80;
        }
        .fbm-modal .fbm-button:focus {
            outline: none;
        }
        .fbm-modal .fbm-logo {
            width: 50%;
            margin-bottom: 20px;
        }
        .fbm-modal .fbm-logo:focus {
            outline: none;
        }
    `;
    this.setStyle(defaultStyles);
  };

  private createElement(tagName: string): HTMLElement {
    return this._document.createElement(tagName);
  }
  // Add Modal to Document
  // document.body.appendChild(document.createElement('div'))
  private addModalToDocument = (): void => {
    const blurEl: HTMLElement = this.createElement("div");
    const modalEl: HTMLElement = this.createElement("div");
    const headline: HTMLElement = this.createElement("h3");
    const subtext: HTMLElement = this.createElement("span");

    const logo = this.createLogo(this._logo);

    const button = this.createButton(
      "Test 1234",
      this.getCorrectStoreLink(),
      this.getCorrectBrowserLogo()
    );

    headline.classList.add("fbm-headline");
    headline.innerHTML = this._headline;

    subtext.classList.add("fbm-text");
    subtext.innerHTML = this._text;
    console.log(detect(navigator.userAgent));

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
    blurEl.addEventListener("click", () =>
      this._document.body.removeChild(blurEl)
    );

    // Append the modal to the document body.
    this._document.body.appendChild(blurEl);
  };

  // Returns an HTMLElement Button representation with a redirect after
  private createButton = (
    btnHtml: string,
    link: string,
    logo: any
  ): HTMLElement => {
    const button: HTMLElement = this.createElement("button");
    button.classList.add("fbm-button");

    button.style.backgroundImage = `url(${logo})`;

    button.innerHTML = btnHtml;
    button.addEventListener("click", () => this.redirectTo(link));

    return button;
  };

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

  // Is it time to show the modal yet? (true/false)
  private isShowtime = (): boolean => {
    const now = new Date(Date.now());
    const timePassed = now.getTime() - this._installDate.getTime();

    if (timePassed > this._timeout) {
      return true;
    } else {
      return false;
    }
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

    if (filter.length == 0) {
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

  private getCorrectBrowserLogo = () => {
    const browser = detect(navigator.userAgent);

    // @ts-nolint-nextline
    const filter = Object.keys(browser).filter(
      (el) => browser[el as Browser] === true
    );

    if (filter.includes("chrome")) {
      return chrome_icon;
    }
    if (filter.includes("firefox")) {
      return firefox_icon;
    }
    if (filter.includes("safari")) {
      return safari_icon;
    }
    if (filter.includes("edge")) {
      return edge_icon;
    }
    return chrome_icon;
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

  public get manual() {
    return this._manual;
  }
  public set manual(value) {
    this._manual = value;
  }
}

export default WebExtRatingModal;
