# kylekramer.ai

Personal website and portfolio for Kyle Kramer — AI &amp; Data Strategy Executive.

Static site (plain HTML/CSS, no build step). Hosted on **Vercel**, domain via **Porkbun**.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home / hero |
| `about.html` | Bio, credentials, skills |
| `experience.html` | Career timeline |
| `writing.html` | Book, patent, op-eds, speaking |
| `contact.html` | Contact form + direct links |
| `styles.css` | Shared stylesheet |

## Publish updates
Double-click **`push.cmd`** (Windows). It commits everything and pushes to GitHub; Vercel then deploys automatically. Requires [Git for Windows](https://git-scm.com/download/win).

The repo/branch are set at the top of `push.cmd` — edit there if they change.

## One-time setup
1. **Create the GitHub repo** (e.g. `SixSigmaEngineer/kylekramersite`).
2. Run `push.cmd` once to push these files up.
3. In **Vercel** → *Add New Project* → import this repo. Framework preset: **Other** (no build command, output = root).
4. In Vercel → *Settings → Domains*, add `kylekramer.ai`. Vercel shows the DNS records.
5. In **Porkbun** → *Domain → DNS*, add the records Vercel gives you (typically an `A` record for the apex and a `CNAME` for `www`). Propagation usually takes a few minutes.

## Contact form
`contact.html` uses [Formspree](https://formspree.io) (free). Replace `YOUR_FORM_ID` in that file with your Formspree form ID. Until then, the form falls back to opening the visitor's email client to `kfkramer1@gmail.com`.
