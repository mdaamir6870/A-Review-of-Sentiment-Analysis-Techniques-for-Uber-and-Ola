# A-Review-of-Sentiment-Analysis-Techniques-for-Uber-and-Ola

## BRIGHT CRM

A responsive CRM interface for Bright Industrial Consultancy Service. The original sentiment-analysis notebooks and datasets are preserved.

### Run locally

Requires Node.js 20.19+ (verified with Node 24.14.1) and npm.

```sh
npm ci
npm run dev -- --port 3000
```

Open http://localhost:3000. To build for deployment:

```sh
npm run build
npm run preview
```

### Workspace features

- Executive overview with eight KPIs, revenue trends, service mix, project progress and follow-ups.
- Customers with multi-service selection, multiple contacts, linked records, communication history and internal notes.
- Searchable and filterable leads with a seven-stage pipeline; move cards by drag-and-drop or an accessible stage selector.
- Quotation creation and editing, direct PDF downloads and client email draft preparation.
- Tender deadlines, project details and closure workflow, candidate deployment and follow-up completion.
- Document uploads (up to 2 MB each), supported image/PDF previews, original file downloads and version metadata.
- Nine report panels, notifications, company settings, role policy preview, collapsible/mobile navigation, and persistent light/dark appearance.

### Demo scope

This is a frontend demonstration using synthetic business records and illustrative analytics. Records and files are stored in this browser's localStorage, subject to browser storage limits. A failed record save is reported; this is not a shared database or durable file store. Seeded documents are summaries until replaced with an uploaded file. Version history retains metadata; original binaries from earlier versions are not retained.

Quotation PDF export generates and downloads a branded PDF directly in the browser. Sending opens a local email draft; attach the PDF and send from your mail application. No messages are sent automatically.

Role permissions are a proposed policy preview. Authentication, server-enforced authorization, multi-user collaboration, live analytics, external communication and production file storage require backend integration. Dashboard headline totals and trends represent the requested example business scenario; detail lists contain representative sample records.

Brand mark is a custom vector-style typographic treatment created for this interface. Replace it with Bright's approved logo asset when available.
