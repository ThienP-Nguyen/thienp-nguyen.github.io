# Security policy

This repository hosts https://thienp-nguyen.github.io/ and its static subpages.

## Report a vulnerability privately

Use **Security → Advisories → Report a vulnerability** in this repository. Include the affected URL and minimal reproduction steps. Do not disclose an unpatched issue in a public issue or pull request.

## Public content

All deployed HTML, CSS, JavaScript, photographs, and documents are public. A hidden link, an unlisted path, or `noindex` is not access control. Do not commit passwords, tokens, private keys, or confidential material.

## Maintaining protection

Keep two-factor authentication enabled. Limit write access and regularly review installed GitHub Apps, access tokens, and SSH keys. The active default-branch ruleset requires pull requests and blocks branch deletion and force pushes. Secret scanning and push protection supplement, but do not replace, these controls.

The pages use a Content Security Policy that permits scripts from this site only. Keep JavaScript in external files. Google Fonts and the garden's YouTube privacy-enhanced player are explicitly allowed. Review resource compatibility after changing the policy.
