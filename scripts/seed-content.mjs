import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content");
mkdirSync(root, { recursive: true });

const seo = (title, description) => ({ title, description });
const portrait = (file, alt) => ({ src: `/media/${file}`, alt });

const teamCategories = [
  { id: "dept-leadership", slug: "leadership", name: "Leadership", summary: "The people who set MediHire’s staffing standard.", description: "Leadership keeps the two journeys honest: hospitals get a clear request path, and clinicians see requirements before they apply.", sortOrder: 1 },
  { id: "dept-clinical", slug: "clinical-partnerships", name: "Clinical partnerships", summary: "Clinicians who advise on scope, credentialing, and unit fit.", description: "Clinical partnerships review specialty requirements with hiring leaders so a request matches the unit that will receive the clinician.", sortOrder: 2 },
  { id: "dept-recruiting", slug: "recruiting", name: "Recruiting", summary: "Recruiters who help clinicians read an opening and take the next step.", description: "Recruiting answers questions about shift, location, and employment type, then routes an application to the right reviewer.", sortOrder: 3 },
  { id: "dept-operations", slug: "client-operations", name: "Client operations", summary: "The desk that turns a staffing request into a coverage plan.", description: "Client operations confirms headcount, start window, and which service — temporary staffing, shift coverage, or permanent placement — fits the request.", sortOrder: 4 },
  { id: "dept-quality", slug: "quality-safety", name: "Quality and safety", summary: "The review desk for credential files and handoff notes.", description: "Quality and safety checks that a sample file has the license, specialty, and dates a hospital asked for before anyone is presented.", sortOrder: 5 },
].map((entry) => ({
  ...entry,
  editorialStatus: "published",
  seo: seo(entry.name, entry.summary),
}));

const teamMembers = [
  member("elena-voss", "Elena Voss", "Managing director", "dept-leadership", "portrait-elena.jpg", "A clinician in a white coat sits at a clinic desk with a stethoscope and paperwork.", "Elena leads the demonstration team. She keeps hospital requests and clinician applications in separate queues.", 1),
  member("jonah-reid", "Jonah Reid", "Clinical partnerships lead", "dept-clinical", "portrait-jonah.jpg", "A bearded clinician wearing glasses and a white coat stands with arms crossed.", "Jonah reviews specialty language with hiring leaders so an ICU request is not written like a medical-surgical one.", 2),
  member("priya-nair", "Priya Nair", "Recruiting lead", "dept-recruiting", "portrait-priya.jpg", "A clinician looks down, a red stethoscope around her neck.", "Priya helps clinicians compare shift and employment type before they apply.", 3),
  member("marcus-hale", "Marcus Hale", "Recruiter", "dept-recruiting", "portrait-marcus.jpg", "A clinician wearing a mask and scrubs stands outdoors.", "Marcus answers first questions about location and credential for sample openings.", 4),
  member("hannah-cole", "Hannah Cole", "Client operations lead", "dept-operations", "portrait-hannah.jpg", "A clinician in surgical attire stands under operating-room lights.", "Hannah turns a staffing request into a coverage note the clinical team can review.", 5),
  member("andre-silva", "Andre Silva", "Perioperative advisor", "dept-clinical", "portrait-andre.jpg", "A surgeon in a cap looks down, gloved hands in view.", "Andre advises on surgical technology and operating-room coverage language.", 6),
  member("sofia-berg", "Sofia Berg", "Client partner", "dept-operations", "portrait-sofia.jpg", "A smiling clinician in a cream suit wears a stethoscope in a studio portrait.", "Sofia stays with a hiring team from the first request through the sample confirmation.", 7),
  member("camille-ortiz", "Camille Ortiz", "Quality reviewer", "dept-quality", "portrait-camille.jpg", "A woman in a blue shirt works at a laptop in a brick office.", "Camille checks that a sample credential file matches the specialty and the dates on the request. Her profile is the last card on the team list so department filtering can be tested past the first page.", 8),
  {
    ...member("rowan-hale", "Rowan Hale", "Advisor", "dept-leadership", "portrait-jonah.jpg", "A bearded clinician wearing glasses and a white coat stands with arms crossed.", "This draft profile is for editorial preview only.", 9),
    editorialStatus: "draft",
  },
];

const locations = [
  place("loc-austin", "austin", "Austin", "southwest", "office", "Austin", "TX", "Sample headquarters", "The Austin office is a MediHire workplace. It is not a hospital.", "600 Sample Street, Suite 400, Austin, TX 78701", "hospital-exterior.jpg", "Brick hospital entrance with a canopy and glass doors.", 1),
  place("loc-chicago", "chicago", "Chicago", "midwest", "office", "Chicago", "IL", "Sample Midwest office", "The Chicago office coordinates Midwest coverage. It is not a hospital campus.", "200 Demonstration Plaza, Suite 500, Chicago, IL 60601", "consult.jpg", "Two clinicians reviewing medical imaging on a monitor.", 2),
  place("loc-dallas", "dallas", "Dallas–Fort Worth", "southwest", "service-area", "Dallas", "TX", "North Texas service area", "Clinicians are placed with hospitals and clinics across Dallas–Fort Worth. There is no public MediHire desk here.", null, "hallway.jpg", "A clinic reception desk with a staircase and a floor directory.", 3),
  place("loc-boston", "boston", "Greater Boston", "northeast", "service-area", "Boston", "MA", "New England service area", "Coverage in this sample area reaches community hospitals and academic campuses around Boston.", null, "hallway.jpg", "A clinic reception desk with a staircase and a floor directory.", 4),
  place("loc-nashville", "nashville", "Nashville", "south", "service-area", "Nashville", "TN", "Middle Tennessee service area", "Night and temporary coverage in this sample area includes wound care and medical-surgical units.", null, "respiratory.jpg", "A surgical team gathered under operating-room lights.", 5),
  place("loc-denver", "denver", "Denver", "mountain-west", "service-area", "Denver", "CO", "Front Range service area", "The Front Range sample area covers hospital medicine and surgical support.", null, "hospital-exterior.jpg", "Brick hospital entrance with a canopy and glass doors.", 6),
  place("loc-phoenix", "phoenix", "Phoenix", "southwest", "service-area", "Phoenix", "AZ", "Valley service area", "Phoenix listings in this demonstration include hospital medicine and expired travel examples that stay off the public board.", null, "consult.jpg", "Two clinicians reviewing medical imaging on a monitor.", 7),
  place("loc-seattle", "seattle", "Seattle", "pacific", "service-area", "Seattle", "WA", "Puget Sound service area", "Seattle is the only Pacific sample area, and it sits past the first page of the locations list.", null, "hallway.jpg", "A clinic reception desk with a staircase and a floor directory.", 8),
];

const jobs = [
  job({
    id: "job-icu-austin", slug: "icu-nurse-austin", title: "ICU registered nurse", employer: "Northbank Medical Center",
    specialty: "icu-nursing", locationId: "loc-austin", workArrangement: "on-site", shift: "night", employmentType: "permanent",
    compensation: { min: 62, max: 78, currency: "USD", period: "hour" },
    summary: "Night ICU coverage for a sample medical center in Austin.",
    responsibilities: "- Take a six-bed ICU assignment on nights.\n- Give a recorded handoff at 07:00.\n- Escalate changes to the sample charge nurse.",
    qualifications: "- Active RN license that can be used in Texas.\n- Two years of adult ICU experience.\n- Comfort with ventilators and titration protocols.",
    application: { mode: "internal", url: null }, publishedAt: "2026-02-02", closingDate: "2027-03-31", jobStatus: "open", sortOrder: 1,
  }),
  job({
    id: "job-er-boston", slug: "emergency-nurse-boston", title: "Emergency nurse", employer: "Harborline Hospital",
    specialty: "emergency-nursing", locationId: "loc-boston", workArrangement: "on-site", shift: "day", employmentType: "temporary",
    compensation: null,
    summary: "Day-shift emergency coverage for a 13-week sample assignment.",
    responsibilities: "- Staff a pod in the sample emergency department.\n- Document in the unit’s existing system.",
    qualifications: "- RN license usable in Massachusetts.\n- Recent emergency department experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-03-01", closingDate: "2027-02-28", jobStatus: "open", sortOrder: 2,
  }),
  job({
    id: "job-medsurg-dallas", slug: "med-surg-nurse-dallas", title: "Medical-surgical nurse", employer: "Cedar Row Community Hospital",
    specialty: "med-surg", locationId: "loc-dallas", workArrangement: "on-site", shift: "day", employmentType: "per-diem",
    compensation: null,
    summary: "Per-diem day shifts on a medical-surgical floor in the Dallas sample area.",
    responsibilities: "- Cover posted day shifts.\n- Follow the unit’s bedside report.",
    qualifications: "- RN license usable in Texas.\n- One year of medical-surgical nursing.",
    application: { mode: "internal", url: null }, publishedAt: "2026-03-12", closingDate: null, jobStatus: "open", sortOrder: 3,
  }),
  job({
    id: "job-rt-chicago", slug: "respiratory-therapist-chicago", title: "Respiratory therapist", employer: "Lakeside Sample Hospital",
    specialty: "respiratory-therapy", locationId: "loc-chicago", workArrangement: "on-site", shift: "night", employmentType: "contract",
    compensation: { min: 48, max: 62, currency: "USD", period: "hour" },
    summary: "Night contract for a respiratory therapy team in the Chicago sample office area.",
    responsibilities: "- Cover ventilator rounds on nights.\n- Join the sample rapid-response roster.",
    qualifications: "- RRT credential.\n- Adult critical-care experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-04-04", closingDate: "2027-04-30", jobStatus: "open", sortOrder: 4,
  }),
  job({
    id: "job-hospitalist-phoenix", slug: "hospitalist-phoenix", title: "Hospitalist", employer: "Red Mesa Regional",
    specialty: "hospital-medicine", locationId: "loc-phoenix", workArrangement: "hybrid", shift: "day", employmentType: "permanent",
    compensation: { min: 240000, max: 280000, currency: "USD", period: "year" },
    summary: "Permanent hospital medicine role with a sample external application page.",
    responsibilities: "- Round on an inpatient teaching service.\n- Share weekend coverage on a published rotation.",
    qualifications: "- Board certification or eligibility in internal medicine.\n- Eligibility to work in Arizona.",
    application: { mode: "external", url: "https://example.com/apply/hospitalist-phoenix" }, publishedAt: "2026-04-20", closingDate: "2027-05-01", jobStatus: "open", sortOrder: 5,
  }),
  job({
    id: "job-tech-denver", slug: "surgical-technologist-denver", title: "Surgical technologist", employer: "Clearwater Surgical Hospital",
    specialty: "surgical-technology", locationId: "loc-denver", workArrangement: "on-site", shift: "day", employmentType: "temporary",
    compensation: null,
    summary: "Daytime surgical technology coverage in the Denver sample area.",
    responsibilities: "- Scrub on general and orthopedic lists.\n- Complete the sample count process.",
    qualifications: "- Surgical technologist certification.\n- Recent operating-room experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-05-02", closingDate: "2027-01-15", jobStatus: "open", sortOrder: 6,
  }),
  job({
    id: "job-ld-austin", slug: "labor-delivery-nurse-austin", title: "Labor and delivery nurse", employer: "Northbank Medical Center",
    specialty: "labor-delivery", locationId: "loc-austin", workArrangement: "on-site", shift: "rotating", employmentType: "permanent",
    compensation: null,
    summary: "Rotating labor and delivery shifts at the Austin sample employer.",
    responsibilities: "- Support labor, delivery, and recovery.\n- Rotate days and nights on the published pattern.",
    qualifications: "- RN license usable in Texas.\n- Recent labor and delivery experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-05-18", closingDate: null, jobStatus: "open", sortOrder: 7,
  }),
  job({
    id: "job-rad-chicago", slug: "radiologic-technologist-chicago", title: "Radiologic technologist", employer: "Lakeside Sample Hospital",
    specialty: "radiologic-technology", locationId: "loc-chicago", workArrangement: "on-site", shift: "weekend", employmentType: "permanent",
    compensation: null,
    summary: "Weekend diagnostic imaging coverage in Chicago.",
    responsibilities: "- Perform general radiography on weekend shifts.\n- Follow the sample radiation-safety checklist.",
    qualifications: "- ARRT registration.\n- State license where required.",
    application: { mode: "internal", url: null }, publishedAt: "2026-06-01", closingDate: "2027-06-01", jobStatus: "open", sortOrder: 8,
  }),
  job({
    id: "job-wound-nashville", slug: "wound-care-nurse-nashville", title: "Night wound care nurse", employer: "Midtown Sample Hospital",
    specialty: "wound-care", locationId: "loc-nashville", workArrangement: "on-site", shift: "night", employmentType: "temporary",
    compensation: null,
    summary: "Temporary night wound-care assignment. This opening is past the first page of the unfiltered board.",
    responsibilities: "- Assess and dress complex wounds on the night shift.\n- Record measurements in the sample chart.",
    qualifications: "- RN license usable in Tennessee.\n- Wound-care experience or certification.",
    application: { mode: "internal", url: null }, publishedAt: "2026-06-15", closingDate: "2027-06-30", jobStatus: "open", sortOrder: 9,
  }),
  job({
    id: "job-or-boston", slug: "operating-room-nurse-boston", title: "Operating room nurse", employer: "Harborline Hospital",
    specialty: "surgical-technology", locationId: "loc-boston", workArrangement: "on-site", shift: "day", employmentType: "permanent",
    compensation: null,
    summary: "This sample operating-room role is closed and must not accept applications.",
    responsibilities: "- Circulate in the sample operating room.",
    qualifications: "- Perioperative nursing experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-01-10", closingDate: "2027-01-10", jobStatus: "closed", sortOrder: 20,
  }),
  job({
    id: "job-travel-er", slug: "travel-emergency-nurse-phoenix", title: "Travel emergency nurse", employer: "Red Mesa Regional",
    specialty: "emergency-nursing", locationId: "loc-phoenix", workArrangement: "on-site", shift: "night", employmentType: "temporary",
    compensation: null,
    summary: "This sample travel role is past its closing date.",
    responsibilities: "- Staff the sample emergency department.",
    qualifications: "- Emergency nursing experience.",
    application: { mode: "internal", url: null }, publishedAt: "2026-01-20", closingDate: "2026-08-15", jobStatus: "open", sortOrder: 21,
  }),
  {
    ...job({
      id: "job-crna", slug: "nurse-anesthetist-denver", title: "Nurse anesthetist", employer: "Clearwater Surgical Hospital",
      specialty: "nurse-anesthesia", locationId: "loc-denver", workArrangement: "on-site", shift: "day", employmentType: "permanent",
      compensation: null,
      summary: "Draft sample role that must stay off the public site.",
      responsibilities: "- Provide anesthesia for the sample list.",
      qualifications: "- CRNA credential.",
      application: { mode: "internal", url: null }, publishedAt: null, closingDate: null, jobStatus: "open", sortOrder: 30,
    }),
    editorialStatus: "draft",
  },
];

const blogCategories = [
  { id: "cat-workforce", slug: "workforce-planning", name: "Workforce planning", summary: "Notes for leaders planning census and coverage.", description: "Workforce planning articles help hiring teams describe headcount, shift, and start window before they request staff.", sortOrder: 1 },
  { id: "cat-hiring", slug: "hiring-teams", name: "Hiring teams", summary: "How a staffing request becomes a short conversation.", description: "Hiring-team articles explain what MediHire asks for on the request form and what happens after it is accepted.", sortOrder: 2 },
  { id: "cat-clinician", slug: "clinician-careers", name: "Clinician careers", summary: "How to read an opening before you apply.", description: "Clinician career articles explain specialty, shift, and employment type on the job board. The sample article in this category is past the first page of the journal.", sortOrder: 3 },
].map((entry) => ({ ...entry, editorialStatus: "published", seo: seo(entry.name, entry.summary) }));

const blogPosts = [
  post("post-coverage", "how-to-request-coverage", "How to request coverage without a scavenger hunt", "A staffing request should name the unit, the shift, and the headcount in one pass.", "2026-10-20", "cat-workforce", "elena-voss", "consult.jpg", "Two clinicians reviewing medical imaging on a monitor.", "Start with the service you need, then the specialty and the city. The form on the contact page is built for that order."),
  post("post-shift", "designing-a-shift-grid", "Designing a shift grid a unit can actually staff", "Night, day, rotating, and weekend are different products. Write them that way.", "2026-09-12", "cat-hiring", "hannah-cole", "respiratory.jpg", "A surgical team gathered under operating-room lights.", "A weekend radiologic role is not a night ICU role. Filters on the job board use those words as stable values so a label change does not break a shared link."),
  post("post-winter", "winter-census-notes", "Winter census notes for sample hospitals", "What to tell a staffing partner before the first cold front.", "2026-08-02", "cat-workforce", "jonah-reid", "hospital-exterior.jpg", "Brick hospital entrance with a canopy and glass doors.", "Name the specialty, the number of people, and whether the need is temporary or per diem. Leave permanent searches in their own request."),
  post("post-interview", "first-conversation", "The first conversation after a staffing request", "Acceptance of the form is not a filled shift. It is a queued conversation.", "2026-07-18", "cat-hiring", "sofia-berg", "hero-team.jpg", "Hands type on a laptop beside a stethoscope on a wooden desk.", "In this demonstration, a request is stored privately and marked as test mode until a delivery endpoint is configured."),
  post("post-orientation", "orientation-for-travelers", "Orientation that respects a short assignment", "Temporary clinicians need the same safety brief, on a shorter clock.", "2026-06-04", "cat-workforce", "andre-silva", "or-team.jpg", "Two surgeons in caps and masks looking down during a procedure.", "List the systems, the badge process, and the person who receives the handoff. Put that in the request notes if it is already known."),
  post("post-nights", "reading-a-night-shift", "How to read a night-shift opening", "The wound-care example on the board is temporary, on-site, and past the first page.", "2026-04-09", "cat-clinician", "priya-nair", "hallway.jpg", "A clinic reception desk with a staircase and a floor directory.", "Check specialty, location, employment type, and shift together. A shared filter link should reopen the same combination."),
  {
    ...post("post-draft", "unpublished-briefing", "Unpublished briefing", "This draft stays out of the journal, search, and the sitemap.", "2026-11-01", "cat-workforce", "elena-voss", "consult.jpg", "Two clinicians reviewing medical imaging on a monitor.", "Draft body for preview only."),
    editorialStatus: "draft",
  },
];

const services = [
  {
    id: "svc-temporary", slug: "temporary-staffing", name: "Temporary staffing", sortOrder: 1,
    summary: "Named clinicians for a defined stretch of weeks, with an end date on the request.",
    body: "Temporary staffing covers a leave, a census spike, or a project with a known end. Tell us the specialty, the shift, and the week you need someone on the unit.\n\nThe request form can open with this service already selected.",
  },
  {
    id: "svc-shift", slug: "shift-coverage", name: "Shift coverage", sortOrder: 2,
    summary: "Per-diem and short blocks when a posted shift would otherwise go uncovered.",
    body: "Shift coverage is for the board you already have: a night, a weekend, or a short run of days. Include the start window in the staffing needs field.\n\nUse the location page when the coverage is tied to one service area.",
  },
  {
    id: "svc-permanent", slug: "permanent-placement", name: "Permanent placement", sortOrder: 3,
    summary: "A retained search for a role you intend to keep on the unit.",
    body: "Permanent placement is a different conversation from a 13-week assignment. Share the employment type, the reporting line, and whether the role is on-site or hybrid.\n\nClinicians still apply through the opening. Hiring teams start here.",
  },
].map((entry) => ({
  ...entry,
  editorialStatus: "published",
  seo: seo(entry.name, entry.summary),
}));

const pages = [
  {
    id: "home",
    title: "Home",
    seo: seo("MediHire · Healthcare staffing for hospitals and clinicians", "MediHire helps hospitals request staff and helps clinicians review active openings with the requirements in plain view."),
    fields: {
      heroEyebrow: "Healthcare recruitment",
      heroTitle: "Staff the unit. Read the role before you apply.",
      heroBody: "MediHire is a demonstration staffing desk for hospitals and clinics, and a job board for nurses, therapists, and other clinicians. Request coverage or browse openings — both paths stay in English and in the open.",
      hospitalTitle: "For hospitals and hiring teams",
      hospitalBody: "Describe the specialty, the shift, and the headcount. A staffing partner replies to the work email you provide. This demonstration stores the request privately and labels test mode until delivery is configured.",
      clinicianTitle: "For healthcare professionals",
      clinicianBody: "Filter active openings by specialty, location, employment type, and shift. Open a role to see the employer, the schedule, and how to apply.",
      servicesTitle: "Staffing services",
      servicesBody: "Three ways to ask for help. Each one opens a staffing request with that service selected.",
      howTitle: "How it works",
      howIntro: "Hiring teams and clinicians move on separate paths that meet in a reviewed introduction.",
      howHospitalTitle: "Hiring teams",
      hospitalStep1Title: "Name the coverage",
      hospitalStep1Body: "Choose temporary staffing, shift coverage, or permanent placement.",
      hospitalStep2Title: "Send the request",
      hospitalStep2Body: "Include organization, work email, specialty, location, and the staffing need.",
      hospitalStep3Title: "Review introductions",
      hospitalStep3Body: "In the full product, a partner would confirm fit. Here, the request stops in the private queue.",
      howClinicianTitle: "Clinicians",
      clinicianStep1Title: "Filter the board",
      clinicianStep1Body: "Combine specialty, location, employment type, and shift. Share the address if you want the same view later.",
      clinicianStep2Title: "Read the requirements",
      clinicianStep2Body: "Employer, arrangement, shift, and qualifications are on the opening.",
      clinicianStep3Title: "Apply once",
      clinicianStep3Body: "Use the built-in form or the employer’s page when the opening says so. Closed roles do not take applications.",
      coverageTitle: "Coverage and offices",
      coverageBody: "Physical offices are MediHire workplaces. Service areas are where clinicians are placed. They are labeled differently on purpose.",
    },
  },
  {
    id: "about",
    title: "About",
    seo: seo("About MediHire", "MediHire’s mission is a plain-language staffing desk for hospitals and a readable job board for clinicians."),
    fields: {
      lede: "MediHire exists so a hiring team can ask for coverage without a scavenger hunt, and a clinician can see the shift before sending a CV.",
      missionTitle: "Mission",
      missionBody: "Hospitals and clinics need people who can work a specific unit, on a specific pattern, in a specific place. Clinicians need those facts before they apply.\n\nThis demonstration keeps both journeys on the public site. Accounts, applicant tracking, organization permissions, and billing are described as later product work, not built here.",
      approachTitle: "Recruitment approach",
      approachBody: "A request names the service, the specialty, and the location. An opening names the employer, the arrangement, the shift, and the employment type. Filter values are stable codes, so a display label can change without breaking a shared link.\n\nSample records are marked. Drafts stay in the editor until someone publishes them. Closed and expired openings leave the board and stop accepting applications.",
    },
  },
  {
    id: "services",
    title: "Services",
    seo: seo("Staffing services", "Temporary staffing, shift coverage, and permanent placement for hospitals and clinics."),
    fields: { lede: "Choose the service that matches the length of the need. Each description is editable in the CMS, and each one can open a staffing request." },
  },
  {
    id: "contact",
    title: "Request staff",
    seo: seo("Request staff", "Send MediHire a staffing request with your organization, work email, specialty, location, and coverage needs."),
    fields: { lede: "Use your organization email. Tell us the specialty, where you need people, and what the next few weeks look like. A location or service link can prefill this form." },
  },
  {
    id: "careers",
    title: "Careers",
    seo: seo("Healthcare openings", "Browse sample healthcare openings and filter by specialty, location, employment type, and shift."),
    fields: { lede: "Active sample openings only. Search by job title or specialty, then combine the filters. The address keeps your choices so a colleague can open the same board." },
  },
  {
    id: "team",
    title: "Team",
    seo: seo("MediHire team", "Meet the sample MediHire team and filter profiles by department."),
    fields: { lede: "These profiles are sample staff for the demonstration. Filter by department, or open a department page for the longer description." },
  },
  {
    id: "blog",
    title: "Insights",
    seo: seo("Insights for hiring teams and clinicians", "Articles on workforce planning, hiring teams, and clinician careers."),
    fields: { lede: "Short sample articles for the two audiences MediHire serves. Filter by category or open the category page." },
  },
  {
    id: "locations",
    title: "Locations",
    seo: seo("Offices and service areas", "See where MediHire keeps sample offices and where it places clinicians."),
    fields: { lede: "Offices are workplaces for MediHire staff. Service areas are regions where clinicians are placed with hospitals and clinics. Filter by region." },
  },
];

const credits = [
  credit("hero-team.jpg", "Hands type on a laptop beside a stethoscope on a wooden desk.", "1576091160550-2173dba999ef"),
  credit("hallway.jpg", "A clinic reception desk with a staircase and a floor directory.", "1519494026892-80bbd2d6fd0d"),
  credit("hospital-exterior.jpg", "Brick hospital entrance with a canopy and glass doors.", "1586773860418-d37222d8fce3"),
  credit("respiratory.jpg", "A surgical team gathered under operating-room lights.", "1579684385127-1ef15d508118"),
  credit("consult.jpg", "Two clinicians reviewing medical imaging on a monitor.", "1666214280557-f1b5022eb634"),
  credit("or-team.jpg", "Two surgeons in caps and masks looking down during a procedure.", "1551601651-2a8555f1a136"),
  credit("portrait-elena.jpg", "A clinician in a white coat at a clinic desk.", "1536064479547-7ee40b74b807"),
  credit("portrait-jonah.jpg", "A clinician in glasses and a white coat.", "1612349317150-e413f6a5b16d"),
  credit("portrait-priya.jpg", "A clinician with a red stethoscope.", "1614608682850-e0d6ed316d47"),
  credit("portrait-marcus.jpg", "A masked clinician outdoors.", "1582750433449-648ed127bb54"),
  credit("portrait-hannah.jpg", "A clinician under operating-room lights.", "1571772996211-2f02c9727629"),
  credit("portrait-andre.jpg", "A surgeon looking down.", "1550831107-1553da8c8464"),
  credit("portrait-sofia.jpg", "A clinician in a cream suit with a stethoscope.", "1651008376811-b90baee60c1f"),
  credit("portrait-camille.jpg", "A woman working at a laptop in a brick office.", "1551836022-d5d88e9218df"),
];

write("team-categories.json", teamCategories);
write("team-members.json", teamMembers);
write("locations.json", locations);
write("jobs.json", jobs);
write("blog-categories.json", blogCategories);
write("blog-posts.json", blogPosts);
write("services.json", services);
write("pages.json", pages);
write("credits.json", credits);
console.log("Seeded MediHire content.");

function write(name, data) {
  writeFileSync(path.join(root, name), `${JSON.stringify(data, null, 2)}\n`);
}

function member(id, name, role, departmentId, file, alt, biography, sortOrder) {
  return {
    id, slug: id, name, role, departmentId,
    portrait: portrait(file, alt),
    biography,
    sortOrder,
    editorialStatus: "published",
    demo: true,
    seo: seo(`${name}, ${role}`, biography),
  };
}

function place(id, slug, name, region, kind, city, state, summary, coverage, address, file, alt, sortOrder) {
  return {
    id, slug, name, region, kind, city, state, summary, coverage, address,
    image: portrait(file, alt),
    sortOrder,
    editorialStatus: "published",
    demo: true,
    seo: seo(`${name} ${kind === "office" ? "office" : "service area"}`, summary),
  };
}

function job(entry) {
  return {
    ...entry,
    editorialStatus: "published",
    demo: true,
    seo: seo(entry.title, entry.summary),
  };
}

function post(id, slug, title, excerpt, publishedAt, categoryId, authorId, file, alt, body) {
  return {
    id, slug, title, excerpt, body: `${excerpt}\n\n${body}\n\nThis is sample journal copy for the MediHire demonstration.`,
    categoryId, authorId, publishedAt,
    image: portrait(file, alt),
    editorialStatus: "published",
    demo: true,
    sortOrder: 1,
    seo: seo(title, excerpt),
  };
}

function credit(file, title, photoId) {
  return {
    title,
    file: `/media/${file}`,
    source: `https://unsplash.com/photos/${photoId}`,
    creator: "Unsplash",
    license: "Unsplash License",
  };
}
