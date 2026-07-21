# One Man Labs website

The public website for [One Man Labs](https://www.onemanlabs.org/), an independent product and R&D studio building software, hardware, and AI systems.

## Portfolio

The site presents a growing portfolio of product and research systems. Each project has a dedicated case-study page; public repositories are linked from the relevant project.

- [Orchestra](https://github.com/OneManLabs/orchestra) — distributed Codex harness and compute-fleet control plane
- [Forge](https://github.com/OneManLabs/forge) — model-agnostic AI design studio
- [CAM](https://github.com/OneManLabs/cam) — open-source browser CNC and G-code application
- Drone Part Picker — compatibility-aware drone component configurator

All Orchestra imagery used here was captured with synthetic data and contains no private fleet credentials, addresses, or device identities.

## Local preview

This is a dependency-free static site. Serve the repository directory with any local HTTP server, then open `index.html` through that server.

## Structure

- `index.html` — home page
- `work.html` — portfolio index
- `orchestra.html`, `forge.html`, `cam.html`, `drone-part-picker.html` — project case studies
- `studio.html` — studio capabilities and process
- `contact.html` — project inquiry page
- `style.css` — responsive design and motion
- `script.js` — navigation, reveals, screenshot viewer, and contact form behavior
- `assets/` — public site imagery and social preview

## Contact form

The contact form submits directly to Formspree. Its public form identifier is intentionally present in the browser code; no private API keys or credentials are stored in this repository.

## Copyright

© One Man Labs. Site content and visual assets are not offered under an open-source license unless explicitly stated otherwise. Orchestra has its own license in its repository.
