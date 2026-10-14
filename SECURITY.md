# Security Policy

## About This Repository

**21 Frontend Projects** is a learning-focused collection of client-side projects built with vanilla HTML, CSS, and JavaScript. There is no backend, database, or user account system, but security issues can still exist in the front-end code (for example XSS, unsafe handling of user input, or exposed API keys).

## Supported Versions

This repository does not use versioned releases. Security fixes are applied to the latest code on the `main` branch only.

| Branch | Supported |
| ------ | --------- |
| `main` | ✅        |
| Others | ❌        |

## Reporting a Vulnerability

If you find a security issue, **please do not open a public issue.**

Report it privately using GitHub's built-in reporting:

1. Go to the [Security tab](https://github.com/Rishp-3/21-Frontend-Peroject/security) of this repository.
2. Click **Report a vulnerability** (private vulnerability reporting).
3. Describe the issue.

If that option isn't available, you can reach the maintainer through the contact links on the [GitHub profile](https://github.com/Rishp-3).

### What to Include

- Which project is affected (e.g. "14 Notes App")
- A clear description of the vulnerability and its potential impact
- Steps to reproduce (a proof of concept helps)
- Browser and OS details, if relevant
- Any suggested fix, if you have one

### What to Expect

- **Acknowledgement:** within about 7 days
- **Assessment and fix:** the maintainer will investigate and, where the report is valid, fix it as soon as reasonably possible
- **Credit:** with your permission, you will be credited when the fix is published

This is a personal learning project maintained in spare time, so response times may vary.

## Scope

**In scope**

- Cross-site scripting (XSS) or HTML injection in any project
- Unsafe use of `innerHTML`, `eval`, or similar patterns with untrusted input
- Insecure handling of data in `localStorage`
- Exposed API keys, tokens, or other secrets committed to the repository
- Vulnerable or malicious third-party scripts/CDN links used by a project

**Out of scope**

- Issues in third-party services or APIs the projects call (e.g. weather or movie APIs); report those to the provider
- Vulnerabilities that require physical access to a user's device
- Missing security headers on local or demo usage
- General bugs or feature requests (please use regular issues for these)

## Security Best Practices for Contributors

- **Never commit secrets.** API keys, tokens, and passwords must not be pushed to the repo. Use placeholders and document how users can add their own key. If a key is exposed by mistake, revoke it immediately.
- **Avoid `innerHTML` with user input.** Prefer `textContent` or safe DOM methods.
- **Validate input.** Treat all user input as untrusted, even in front-end-only projects.
- **Avoid unnecessary third-party scripts.** If you must use one, load it from a trusted source over HTTPS.
- **Don't store sensitive data** in `localStorage` or `sessionStorage`.

Thank you for helping keep this project safe! 🔒
