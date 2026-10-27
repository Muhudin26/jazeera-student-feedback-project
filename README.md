# Jazeera University Student Complaint & Feedback System

A responsive, static HTML/CSS/JavaScript complaint form with dependent Faculty → Department → Batch dropdowns and WhatsApp/email message preparation.

## Files

- `index.html` — form structure and page content
- `style.css` — responsive blue-and-white styling
- `script.js` — dropdown logic, validation, and message generation
- `assets/jazeera-logo.png` — the supplied Jazeera University logo

## Run locally

Open `index.html` in a modern browser. For a local server, open this folder in VS Code and use the Live Server extension.

## Deploy to GitHub Pages

1. Create or open the GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder.
3. In repository Settings, open Pages.
4. Choose deployment from the main branch and the repository root folder.
5. Save and wait for GitHub Pages to publish the site.

## Contact settings

Edit the `CONTACT` object near the top of `script.js`:
- WhatsApp: digits only, including country code
- Email: destination email address

The current values are testing contacts supplied for this project.

## Academic configuration

Edit `ACADEMIC_CONFIG` in `script.js` when verified university data changes. Batch maxima were supplied by the requester. Departments with `maxBatch: null` are intentionally unavailable until their limits are confirmed.

**Important:** Confirm the current faculty/department relationships and the two unconfirmed batch limits (Health Science and Accounting and Finance) with the university before public deployment. The static site prepares messages but does not store complaints in a database. Students must press Send inside WhatsApp or their email application.
