import { html } from './lib/html-tag.js';

const PORT = process.env.PORT || 7777;

export default function baseHtml() {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>App</title>
        <link rel="stylesheet" href="/assets/browser.css" />
      </head>

      <body>
        ${overlayStyle}
        <div id="overlay">…Loading</div>

        <div id="app"></div>

        <script src="/assets/browser.js"></script>

        ${liveReload}
      </body>
    </html> `;
}

const overlayStyle = html`<style>
  #overlay {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #121212;
    z-index: 99999;
    transition: opacity 500ms;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: sans-serif;
  }
</style>`;

const liveReload = html`
  <!--  -->
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    socket.on('hello', () => {
      console.log('Connected to live reload');
    });
    socket.on('reload', () => {
      console.log('Reloading browser…');
      location.reload();
    });
  </script>
  <!--  -->
`;
