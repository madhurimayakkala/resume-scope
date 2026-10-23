# ATS Resume Matcher

A modern ATS Resume Matcher that compares resumes against job descriptions using deterministic skill-based matching and intelligent analysis.

Built using:

* Next.js
* React
* TypeScript
* Tailwind CSS
* pdf-parse

---

## Features

* PDF Resume Upload
* Resume Text Extraction
* Skill Extraction & Normalization
* ATS-Style Match Scoring
* Skill Overlap Analysis
* Missing Skill Detection
* Resume-to-JD Comparison
* Responsive Premium UI
* Smooth Modern Animations

---

## How It Works

The system:

1. Extracts text from uploaded resume PDFs
2. Identifies technical skills from the resume
3. Extracts required skills from the job description
4. Compares both skill sets
5. Calculates overlap percentage
6. Displays:

   * matched skills
   * missing skills
   * ATS compatibility insights

The matching logic is deterministic and rule-based rather than fully AI-generated, making the results faster, more explainable, and more reliable.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes

### Resume Parsing

* pdf-parse

---

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Folder Structure

```bash
app/
components/
lib/
types/
```

---

## Future Improvements

* Resume memory system
* Better semantic skill matching
* Resume tailoring suggestions
* Export analyzed reports
* Advanced ATS scoring metrics
