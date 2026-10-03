# Stay in the Fight

A mobile-first explainer comparing permanent standard time with permanent daylight saving time, with a little 2019 Washington Nationals energy.

## Run locally

No build step or dependencies. Serve this folder with any static HTTP server:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. JavaScript modules require HTTP (opening index.html directly as a local file will not work reliably).

```sh
npm test
```

Tests cover the 2026 DST boundaries, solar calculations across every day and city, twilight classification, and custom schedule edge cases.

## Features

- Date slider and user-controlled year playback
- Three cities, adjustable morning/evening schedules, and shareable URL parameters
- Sunrise, sunset, civil twilight, and daylight remaining after your chosen time
- Short scouting reports and expandable political background
- Replayable Nationals comeback and Howie Kendrick foul-pole celebration
- Dark mode, reduced-motion support, keyboard controls, and no audio autoplay

Political information is a snapshot dated **October 3, 2026**, not a live tracker. Sources and calculation assumptions are included on the page. Solar times are approximate; twilight labels are not visibility or safety predictions.

The supplied Claude page is preserved in the repository's initial commit. The next commit brings the comparison forward, reduces the reading load, corrects the standard-time legislative alternative, and adds interactions. No API keys, tracking, or external runtime libraries are included. Google Fonts is optional; system fonts are used if unavailable.

This repository has not been configured for hosting by this change. Its root files can be served by any static host. A fan project, not affiliated with the Washington Nationals.
