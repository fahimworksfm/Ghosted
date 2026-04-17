# Ghosted — Full Feature Test & Verification Guide

Run the app locally first:
```bash
npm run build && npm start
# Open: http://localhost:3000
```

---

## PAGE 1 — Home (`/`)

### 1.1 · Visual Header
**Where:** Top banner (blue background)

| Check | Expected |
|---|---|
| Two red corner badges | Pulsing "NOW HIRING" and "APPLY TODAY" in top-left and top-right corners |
| Headline | "APPLYNOW" — white + red, large, all-caps |
| Sub-tagline | Blue-tinted text describing the app |
| "INSTANT DECISIONS" badge | Bouncing animation, red background |
| "Hall of Shame" link | Purple button, top-right of header — clicking goes to `/hall-of-fame` |

---

### 1.2 · Warning Ticker
**Where:** Yellow bar immediately below the header

| Check | Expected |
|---|---|
| Scrolling text | Marquee scrolls continuously left, no gap/jump |
| Content | Rotating ⚠ warnings about ATS systems, the process, and "the real analysis buried inside the joke" |

---

### 1.3 · Company Name Field (Step 1 — top of questionnaire)
**Where:** First card inside the questionnaire section

| Check | Expected |
|---|---|
| Input placeholder | "e.g. Google, Amazon, MegaCorp Industries™" |
| Typing a company | Accepted freely, no validation |
| Helper text | "We'll show you how many others have checked this company." |

**Test values to try:** `Google`, `Amazon`, `openai`, `yourfakecompany`

---

### 1.4 · Questionnaire (3 Absurd Questions)
**Where:** Step 1 cards, below the company field

| Check | Expected |
|---|---|
| Three question cards | Each has a blue border and a red drop-shadow |
| Dropdown default option | "— SELECT AN OPTION (ALL ARE WRONG) —" |
| Option order | Options are **not alphabetical** — shuffled deterministically per question |
| All-wrong label | Every option is satirical/absurd |
| Submit gate | Cannot submit until all 3 are answered |

**Test:** Select all 3, then clear one — the submit button should refuse.

---

### 1.5 · File Upload (Step 2)
**Where:** Step 2 section, dashed border drop-zone

| Check | Expected |
|---|---|
| Click to browse | File picker opens, accepts `.pdf .doc .docx .txt` |
| Drag and drop | Drop a file → zone highlights yellow, file accepted |
| After upload | Shows filename, file size in KB, "Click to change" prompt |
| No upload | Upload is optional — proceeding without a file runs mock analysis |
| Real analysis note | `.txt` or `.pdf` gives real keyword scoring; other formats get mocked |

---

### 1.6 · Runaway Submit Button (Step 3)
**Where:** Step 3 section, centered button

| Check | Expected |
|---|---|
| Before questions answered | Button is disabled + greyed out; yellow warning text shown |
| After all 3 questions answered | Button activates (red, enabled) |
| Hover with mouse | **Button moves away** for 2 seconds; label changes to "STOP CHASING ME" |
| Small text while fleeing | "Please stop. I am just a button." appears below |
| After 2 seconds | Button stops moving, label changes to "FINE. SUBMIT." — click now works |
| Click without chasing | If you click directly fast enough, it submits |
| Error on skip | If questions not answered, red error banner appears above button |

---

## PAGE 2 — Loading Screen (appears after submit)

### 2.1 · Progress Bar Sequence
**Where:** Full-screen loading view, dark background

| Phase | What to look for | Timing |
|---|---|---|
| Race to 99% | Green bar fills rapidly with rotating status messages | ~1.8 seconds |
| Stall at 99% | Bar freezes at 99%, yellow text: "Processing... (please wait)" with ominous message | **5 full seconds** |
| FORMATTING LOST | Bar turns red + pulses, red warning box appears: "⚠ CRITICAL ERROR: FORMATTING LOST ⚠" | ~1.5 seconds |
| Finish | Bar completes to 100%, page transitions to results | immediately after |

| Check | Expected |
|---|---|
| Rotating messages | Text above bar cycles: "Parsing your life's work...", "Consulting Magic 8-Ball...", etc. |
| Application ID | Shown below bar: `ATS-XXXXXXXX-VOID` (random hex) |
| No refresh button | None exists — you are trapped |

---

## PAGE 3 — Results (`/results`)

### 3.1 · Sound Effects
**Where:** Top-right of the red header bar — speaker icon button

| Check | Expected |
|---|---|
| Default state | Sound is **on** (`🔊 Sound On`) |
| On page load | Sad trombone plays ~0.6s after results appear (4 descending notes) |
| REJECTED stamp | Stamp thud sound plays when the stamp animates in (~1.4s after load) |
| Modal appears | Air horn chord plays when Talent Network modal appears (~1.2s after load) |
| Toggle off | Click `🔊` → shows `🔇 Sound Off`; no more sounds play |
| Persists | Refresh page — sound preference remembered (localStorage) |

---

### 3.2 · Rejection Tier Badge
**Where:** First big block below the red header

| Tier | How to trigger | Visual |
|---|---|---|
| **Bronze** | Short resume or no file upload | Amber border, `🥉`, dim glow |
| **Silver** | Medium resume, some keywords | Grey border, `🥈` |
| **Gold** | Solid resume with education + skills + experience | Yellow border, `🥇`, warm glow |
| **Platinum** | Long resume with 7+ quality signals | Purple border, `💎`, purple glow + **confetti burst** |

**Platinum test:** Upload a `.txt` file with 600+ words, years of experience, education, skills section, 5+ action verbs, and multiple numbers/percentages. The confetti fires from two sides.

---

### 3.3 · Company Counter
**Where:** Below the tier badge

| Check | Expected |
|---|---|
| With company typed | Shows "You are person #N to check [Company]" with tier-appropriate message |
| 1st ever company | "You are the FIRST person to check X. Brave. Or naive." |
| Google/Amazon etc. | Shows 200+ count: "N people have checked X. It has developed a reputation." |
| Global stats strip | Three numbers: **Total Rejected**, **Today**, **Platinum count** |
| No company entered | Shows only global stats strip, no company-specific message |

**Test:** Type `google` → should show 203+ (seeded). Type `myfakecompany` → shows 1.

---

### 3.4 · Ghosting Timeline
**Where:** Below the company counter — collapsed by default

| Check | Expected |
|---|---|
| Collapsed state | Header: "📅 The Ghosting Timeline" with ▼ chevron |
| Click to expand | Chevron rotates 180°; events animate in one by one (180ms apart) |
| 13 events total | Day 1 through Day 47, each with an icon and description |
| Event styling | Normal events: blue; final "Day 47 — This email." is red + bold |
| Timeline spine | Vertical line connecting each event dot |
| Click to collapse | Collapses, re-expanding re-animates from scratch |

---

### 3.5 · Rejection Letter
**Where:** Main white letter card (Courier New font)

| Check | Expected |
|---|---|
| Font | Courier New throughout |
| Letterhead | "MegaCorp Industries™" in large bold, tagline + division name below |
| Tier badge | Small colored border box in top-right (e.g., "Silver Rejection") |
| REF code | Error code like `ERR_BUZZWORD_CONTAMINATION` |
| Red block | Primary disqualification with error code in small mono text |
| Yellow block | Secondary algorithmic concern (a different absurd reason) |
| Stats table | Word count, buzzwords flagged, ATS score, processing time |
| Sign-off | Multi-line, has a P.S. that is its own joke |
| REJECTED stamp | Appears 0.8s after load — rotated, red, animates from large+transparent to normal |

---

### 3.6 · Analysis Tabs (3 tabs)

**Where:** Below the rejection letter — three tabs

#### Tab 1: `⚡ Real ATS Analysis` (default active)
| Check | Expected |
|---|---|
| "SYSTEM OVERRIDE" banner | Green header: "This section bypassed the satire engine. The data below is real." |
| ATS Compatibility Score | 0–100 bar that fills on render; green ≥70, yellow ≥45, red <45 |
| Action Verbs box | Count of power verbs found; lists them in green tags |
| Quantified Results box | Count of metrics found (numbers + context); red if 0 |
| Weak Phrases box | Count of passive phrases found; shows first example |
| ATS Sections box | X/7 sections detected |
| Missing sections warning | Red panel listing any missing required headers |
| Recommendations | Prioritized cards: red dot = high, yellow = medium, green = low |
| Each recommendation | Has a tip + italic example starting with "↳" |

**Test with a `.txt` file containing:** "Led a team of 10. Reduced costs by 30%. Skills: Python, SQL. Experience: 5 years." → Should get high score, detect power verbs "Led", "Reduced", find 2 metrics, detect Skills section.

#### Tab 2: `📊 ATS Score Card`
| Check | Expected |
|---|---|
| Warning banner | Yellow: "PROPRIETARY EVALUATION METRICS ⚠ PATENT PENDING" |
| 8 metrics | All visible with horizontal bars |
| Bar animation | Bars start at 0%, animate to their width on first view |
| Score colors | High scores on bad metrics = red; low scores on good metrics = red (rigged) |
| Verdicts | Each metric has a sarcastic one-liner below the bar |
| Examples | "Nepotism Potential: 1/10 — None detected. Red flag." |
| Footer | "These metrics are completely made up. They are also the only metrics that matter." |

#### Tab 3: `💡 Improvement Tips`
| Check | Expected |
|---|---|
| Blue header | "Following these tips will result in a different rejection." |
| Numbered list | 3–5 tips, each with a red number badge |
| Tip structure | Real advice in white text |
| Yellow block | Satirical "(Note: ...)" in yellow italic mono |
| Contradictions | e.g., "Add keywords — (Note: will trigger buzzword contamination)" |
| Platinum bonus tip | If platinum tier, final tip is honest: "Your resume was actually strong." |

---

### 3.7 · Share & Export Buttons
**Where:** Below the tabs

| Button | What it does | How to verify |
|---|---|---|
| `🔗 Copy Shareable Link` | Copies a `?d=BASE64` URL to clipboard | Paste in new tab → results page loads with same letter |
| `💼 Share on LinkedIn` | Opens LinkedIn share dialog in new tab | Pre-filled satirical text with error code and tier |
| `📄 Download PDF` | Downloads `rejection-letter.pdf` | PDF opens in viewer: Courier New letterhead, content, rotated red REJECTED stamp |

**Test the shared link:** Copy link → open in Incognito → should show same rejection letter without any sessionStorage.

---

### 3.8 · Talent Network Modal
**Where:** Appears ~1.2s after results load, as an overlay

| Close attempt | What happens |
|---|---|
| Click × (attempt 1) | × button teleports to a random position; guilt message appears |
| Click × (attempt 2) | × teleports again, further; message escalates |
| Click × (attempt 3) | × teleports again; "button has been relocated for your protection" |
| Click × (attempt 4) | CAPTCHA appears instead of closing |
| CAPTCHA question | "Is this job application process ethical?" |
| Type wrong answer | Error: "The answer is 'no.' We find your optimism concerning." |
| Type `no` | Modal finally closes |
| Click backdrop | Each click counts as a close attempt too |

**Other modal checks:**
| Check | Expected |
|---|---|
| Email field | Accepts any input; label says "will be sold to 847 partners" |
| Second file upload | Drag zone accepts files with formats `.pdf .docx .hope` |
| "Sign Me Up" button | Styled blue CTA that does nothing |
| Terms links | "Terms of Emotional Distress" and "Privacy Policy (lol)" — styled, not functional |

---

### 3.9 · Page Action Buttons
**Where:** Below the share buttons

| Button | Navigates to |
|---|---|
| "Apply Again (Why Not)" | `/` — home page |
| "🏆 Hall of Shame" | `/hall-of-fame` |

---

## PAGE 4 — Hall of Shame (`/hall-of-fame`)

**Navigate:** Click "Hall of Shame" link (header on home, button on results) or go to `/hall-of-fame`

### 4.1 · Header
| Check | Expected |
|---|---|
| Pulsing gradient | Blue/purple background gradient animates |
| Title | "Hall of **Shame**" — Shame in yellow |

### 4.2 · Global Counters (4 boxes)
| Check | Expected |
|---|---|
| Numbers animate | Count up from 0 to final value over ~1.2 seconds on page load |
| Total Rejected | Should show 1,247+ (seeded) |
| Today | Shows today's live count (starts at 0, increments with each submission) |
| Top Tier (Gold) | Shows 411+ (seeded) |
| Elite (Platinum) | Shows 146+ (seeded) |

### 4.3 · Tier Distribution Bars
| Check | Expected |
|---|---|
| 4 tiers shown | Bronze, Silver, Gold, Platinum |
| Bars animate | Fill from 0 to percentage width |
| Percentages | Add up to ~100% |
| Colors | Amber / Grey / Yellow / Purple matching tier colors |

### 4.4 · Most-Checked Companies Leaderboard
| Check | Expected |
|---|---|
| Up to 10 companies | Sorted by check count descending |
| Google at #1 | 203 checks (seeded) |
| Relative bars | Each row has a mini bar scaled against the top entry |
| Blue counts | Count shown in blue mono font |
| Increases | After submitting with a company name, that company's count increments here |

### 4.5 · Notable Error Codes Table
| Check | Expected |
|---|---|
| 6 error codes listed | Including ERR_DANGEROUS_SELF_AWARENESS, ERR_FILE_RECEIVED, etc. |
| Each has a count | Static (seeded), shown in grey mono |
| Each has a description | One-line satirical explanation |
| Red border | Each code card has a dark red border |

---

## FEATURE — Shared Link Round-Trip

1. Submit the form (any file or no file)
2. On results page, click **Copy Shareable Link**
3. Open a new Incognito/Private window
4. Paste the URL and hit Enter
5. **Expected:** Results page loads with the same rejection letter — no sessionStorage used
6. Tier badge, letter content, and error code should all match
7. Company counter shows "no company" global stats (company name is not encoded in URL)
8. Tabs still work; sound effects still play

---

## EDGE CASES

### No File Upload
- Skip Step 2, answer all 3 questions, submit
- **Expected:** Mock analysis runs — moderate tier (Silver/Gold), real analysis shows 0 metrics (no resume to parse)

### Very Short `.txt` File
Create a file with content: `I am a person. I want a job.`
- **Expected:** Bronze tier, word count ~6, 0 power verbs, 0 metrics, all 4 sections missing — real analysis flags everything as high priority

### Strong `.txt` Resume
Create a `.txt` with:
```
SUMMARY
Experienced engineer with 8 years of experience.

EXPERIENCE
Led team of 12 engineers, reducing deployment time by 45%.
Built microservices platform handling $2M in transactions monthly.
Scaled infrastructure from 1K to 500K daily users.
Optimized database queries, improving response time by 60%.

EDUCATION
Bachelor of Science in Computer Science, MIT, 2016

SKILLS
Python, Go, Kubernetes, PostgreSQL, React, AWS

CERTIFICATIONS
AWS Certified Solutions Architect
```
- **Expected:** Platinum tier, ATS score 70+, 4+ power verbs detected, 4 metrics found, all 4 sections present, minimal recommendations

### Reload Results Page Directly
- Navigate to `/results` without submitting
- **Expected:** Fallback result shown (FALLBACK constant) — Silver tier, ERR_FILE_RECEIVED

---

## DEPLOYMENT ON RENDER (FREE TIER)

### What works on free tier
- Full app functionality
- Sound effects, animations, PDF export
- Company counter (resets to seeded data on each restart — see note below)
- All pages

### Free tier limitations
| Limitation | Impact |
|---|---|
| **Sleeps after 15 min of inactivity** | First request after sleep takes ~30s to respond |
| **Ephemeral filesystem** | `data/stats.json` resets to seeded data (1,247 entries) on every restart/deploy |
| 512MB RAM | Sufficient for this app |
| 0.1 CPU | Sufficient; no heavy compute |

> **Counter note:** On Render free, the counter works correctly during a session. After the service sleeps and restarts, it returns to the seeded baseline (1,247 total, 203 for Google, etc.). This is cosmetically fine — the app still feels "lived in." For persistent real counts, either upgrade to a paid Render plan with a disk ($7/mo) or swap `lib/stats.ts` for a free Postgres on [Neon.tech](https://neon.tech).

---

### Step-by-step Render Deployment

#### Prerequisites
- GitHub account with this repo pushed (already done — branch `claude/anti-ats-rejection-app-vYCS6`)
- [render.com](https://render.com) account (free, no card required)

#### Steps

**1. Push repo to GitHub (if not already)**
```bash
# In the Ghosted directory:
git remote add github https://github.com/YOUR_USERNAME/ghosted.git
git push github claude/anti-ats-rejection-app-vYCS6:main
```

**2. Create a new Web Service on Render**
- Go to [dashboard.render.com](https://dashboard.render.com)
- Click **New +** → **Web Service**
- Connect your GitHub account → select the Ghosted repo

**3. Configure the service**

| Field | Value |
|---|---|
| Name | `ghosted` (or anything) |
| Region | Choose closest to you |
| Branch | `main` (or `claude/anti-ats-rejection-app-vYCS6`) |
| Runtime | **Node** |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance Type | **Free** |

**4. Add environment variable**

Under **Environment** tab, add:
```
NODE_ENV = production
```

**5. Click "Create Web Service"**

Render will:
1. Clone the repo
2. Run `npm install && npm run build` (~2–3 min)
3. Start the app with `npm start`
4. Give you a URL like `https://ghosted-xxxx.onrender.com`

**6. Verify deployment**

Open the Render URL and run through the test checklist above. Everything should work identically to local.

#### Troubleshooting on Render

| Symptom | Fix |
|---|---|
| Build fails with OOM | Add `NODE_OPTIONS=--max-old-space-size=400` env var |
| Service won't start | Check logs — ensure Build Command completed successfully |
| Counter not persisting | Expected on free tier (ephemeral filesystem) |
| Slow first load | Expected — free tier sleeps; subsequent loads are fast |
| PDF download not working | Ensure browser isn't blocking popups/downloads from the Render domain |

---

## QUICK SMOKE TEST CHECKLIST

Run through this in 5 minutes to verify the whole app works:

- [ ] Home page loads with pulsing "NOW HIRING" badges
- [ ] Warning ticker scrolls continuously
- [ ] Type `google` in company field
- [ ] Answer all 3 questions (options are shuffled, not alphabetical)
- [ ] Upload any `.txt` file (or skip)
- [ ] Hover submit button — it runs away for 2 seconds
- [ ] Submit — progress bar stalls at 99% for 5 seconds, shows "FORMATTING LOST"
- [ ] Results page: trombone plays, tier badge shows with correct color
- [ ] Company counter shows 200+ for Google
- [ ] Click Ghosting Timeline — 13 events animate in
- [ ] Rejection letter uses Courier New font, REJECTED stamp animates in
- [ ] "Real ATS Analysis" tab shows green "SYSTEM OVERRIDE" banner + real scores
- [ ] "ATS Score Card" tab shows animated bar charts
- [ ] "Improvement Tips" tab shows numbered tips with yellow satirical footnotes
- [ ] Copy Shareable Link → paste in Incognito → same letter appears
- [ ] Download PDF → opens with letterhead + REJECTED stamp
- [ ] Talent Network modal appears → takes 4 close attempts + typing "no" to dismiss
- [ ] Hall of Shame page shows animated counters and company leaderboard
- [ ] Submit again with `myfakecompany` — counter shows 1 on results page
