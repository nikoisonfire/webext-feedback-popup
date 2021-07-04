# Default styles

```javascript
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
```
