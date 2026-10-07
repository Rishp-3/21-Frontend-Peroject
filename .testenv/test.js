// Automated smoke-test harness for all 21 projects.
// Usage: node test.js "01 Calculator" ...   (or no args = all dirs)
const fs = require("fs");
const path = require("path");
const jsdomPkg = require("jsdom");
const { JSDOM, VirtualConsole, requestInterceptor } = jsdomPkg;

const ROOT = path.resolve(__dirname, "..");
const dirs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs
      .readdirSync(ROOT)
      .filter((d) => /^\d{2} /.test(d) && fs.statSync(path.join(ROOT, d)).isDirectory());

let failures = 0;

async function testProject(dir) {
  const projPath = path.join(ROOT, dir);
  const htmlPath = path.join(projPath, "index.html");
  if (!fs.existsSync(htmlPath)) {
    console.log(`FAIL ${dir}: index.html missing`);
    failures++;
    return;
  }
  let html = fs.readFileSync(htmlPath, "utf8");
  if (html.length < 50) {
    console.log(`FAIL ${dir}: index.html empty/too small`);
    failures++;
    return;
  }

  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => {
    // ignore not-implemented CSS/layout noise
    if (/Could not parse CSS|not implemented/i.test(e.message)) return;
    // jsdom lacks real layout: <audio> playback always "fails" here — treat as warning
    if (/Could not load media|media resource/i.test(e.message)) return;
    errors.push("jsdomError: " + e.message);
  });
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

  // Serve local assets (style.css, main.js, images) from disk via a jsdom v29
  // requestInterceptor; everything else goes over the real network.
  const dom = new JSDOM(html, {
    url: "http://localhost/" + encodeURIComponent(dir) + "/index.html",
    runScripts: "dangerously",
    resources: {
      interceptors: [
        requestInterceptor((request) => {
          const u = new URL(request.url);
          if (u.hostname === "localhost") {
            const rel = decodeURIComponent(u.pathname).replace(/^\/[^/]+\//, "");
            const p = path.join(projPath, rel);
            if (fs.existsSync(p)) {
              const type = /\.(css)$/.test(rel)
                ? "text/css"
                : /\.js$/.test(rel)
                  ? "application/javascript"
                  : "text/plain";
              return new Response(fs.readFileSync(p), { headers: { "Content-Type": type } });
            }
            throw new Error("local file not found: " + rel);
          }
          // allow real network for everything else
        }),
      ],
    },
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      // Polyfill fetch via real network so API-based projects can run
      w.fetch = (u, o) => {
        if (typeof u === "string" && /^https?:/.test(u)) return fetch(u, o);
        return Promise.reject(new Error("non-http resource: " + u));
      };
      // Simple canvas stub for music player waveform
      w.HTMLCanvasElement.prototype.getContext = function () {
        return {
          fillRect() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {},
          stroke() {}, fill() {}, arc() {}, closePath() {}, save() {}, restore() {},
          set fillStyle(v) {}, set strokeStyle(v) {}, set lineWidth(v) {},
          createLinearGradient() { return { addColorStop() {} }; },
          measureText() { return { width: 10 }; }, fillText() {},
        };
      };
    },
  });
  const { window } = dom;

  // localStorage shim (jsdom supports it with file:// url? ensure availability)
  try {
    window.localStorage.setItem("__t", "1");
    window.localStorage.removeItem("__t");
  } catch (e) {
    errors.push("localStorage unavailable: " + e.message);
  }

  // Wait for external resources/scripts to load & run
  await new Promise((r) => setTimeout(r, 2500));

  // Check local asset references resolve on disk
  const refs = [];
  dom.window.document.querySelectorAll("script[src], link[href], img[src]").forEach((el) => {
    const v = el.getAttribute("src") || el.getAttribute("href");
    if (v && !/^(https?:|data:|#|mailto:)/.test(v) && !/favicon/.test(v)) refs.push(v);
  });
  for (const r of refs) {
    const p = path.resolve(projPath, decodeURIComponent(r.split("?")[0]));
    if (!fs.existsSync(p)) errors.push("missing local asset: " + r);
  }

  // Simulate basic interactions: click every button once (guard against infinite loops)
  const buttons = [...dom.window.document.querySelectorAll("button, input[type=submit]")];
  for (const b of buttons.slice(0, 40)) {
    try {
      b.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    } catch (e) {
      errors.push("click error on <button>" + (b.className || "") + ": " + e.message);
    }
  }
  // Dispatch input+change on inputs
  const inputs = [...dom.window.document.querySelectorAll("input:not([type=button]):not([type=submit]), textarea, select")];
  for (const inp of inputs.slice(0, 20)) {
    try {
      if (inp.type === "checkbox" || inp.tagName === "SELECT") {
        inp.checked = !inp.checked;
        inp.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
      } else {
        inp.value = "test";
        inp.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
        inp.dispatchEvent(new dom.window.Event("keyup", { bubbles: true }));
      }
    } catch (e) {
      errors.push("input error: " + e.message);
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  // Any leftover raw "//" comment text visible in body?
  const bodyText = dom.window.document.body ? dom.window.document.body.textContent : "";
  if (/^\s*\/\/[A-Z]/m.test(bodyText.replace(/[^\n]*\n/g, (m) => (m.includes("//") ? m : "")))) {
    // crude: check lines starting with // inside HTML source
  }
  const badComments = html.split("\n").filter((l) => /^\s*\/\/\w/.test(l));
  if (badComments.length) errors.push(`HTML has ${badComments.length} invalid "//" comment lines`);

  // TODO / placeholder markers
  const srcFiles = ["index.html", "style.css", "main.js"];
  for (const f of srcFiles) {
    const fp = path.join(projPath, f);
    if (fs.existsSync(fp)) {
      const c = fs.readFileSync(fp, "utf8");
      if (/TODO|FIXME|lorem ipsum/i.test(c)) errors.push(`${f} contains TODO/placeholder`);
    }
  }
  // README presence
  if (!fs.existsSync(path.join(projPath, "README.md"))) errors.push("README.md missing");

  window.close();

  if (errors.length) {
    failures++;
    console.log(`FAIL ${dir}`);
    [...new Set(errors)].slice(0, 12).forEach((e) => console.log("   - " + e));
  } else {
    console.log(`PASS ${dir} (${buttons.length} buttons, ${inputs.length} inputs)`);
  }
}

(async () => {
  for (const d of dirs) await testProject(d);
  console.log(`\n${dirs.length - failures}/${dirs.length} projects passed.`);
  process.exit(failures ? 1 : 0);
})();
