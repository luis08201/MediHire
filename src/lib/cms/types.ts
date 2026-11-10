export type EditorialStatus = "draft" | "published";

export type SeoFields = {
  title: string;
  description: string;
};

export type Media = {
  src: string;
  alt: string;
};

export type TeamCategory = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  sortOrder: number;
  editorialStatus: EditorialStatus;
  seo: SeoFields;
};

export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  departmentId: string;
  portrait: Media;
  biography: string;
  sortOrder: number;
  editorialStatus: EditorialStatus;
  demo: boolean;
  seo: SeoFields;
};

export type LocationKind = "office" | "service-area";

export type Location = {
  id: string;
  slug: string;
  name: string;
  region: string;
  kind: LocationKind;
  city: string;
  state: string;
  summary: string;
  coverage: string;
  address: string | null;
  image: Media;
  sortOrder: number;
  editorialStatus: EditorialStatus;
  demo: boolean;
  seo: SeoFields;
};

export type Compensation = {
  min: number;
  max: number;
  currency: "USD";
  period: "hour" | "year";
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  employer: string;
  specialty: string;
  locationId: string;
  workArrangement: "on-site" | "hybrid" | "remote";
  shift: "day" | "night" | "rotating" | "weekend";
  employmentType: "temporary" | "per-diem" | "contract" | "permanent";
  compensation: Compensation | null;
  summary: string;
  responsibilities: string;
  qualifications: string;
  application: {
    mode: "internal" | "external";
    url: string | null;
  };
  publishedAt: string | null;
  closingDate: string | null;
  jobStatus: "open" | "closed";
  editorialStatus: EditorialStatus;
  sortOrder: number;
  demo: boolean;
  seo: SeoFields;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  sortOrder: number;
  editorialStatus: EditorialStatus;
  seo: SeoFields;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  categoryId: string;
  authorId: string;
  publishedAt: string | null;
  image: Media;
  editorialStatus: EditorialStatus;
  demo: boolean;
  seo: SeoFields;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: string;
  sortOrder: number;
  editorialStatus: EditorialStatus;
  seo: SeoFields;
};

export type PageEntry = {
  id: string;
  title: string;
  seo: SeoFields;
  fields: Record<string, string>;
};

export type CollectionName =
  | "team-categories"
  | "team-members"
  | "jobs"
  | "blog-categories"
  | "blog-posts"
  | "locations"
  | "services"
  | "pages";

export type EntryMap = {
  "team-categories": TeamCategory;
  "team-members": TeamMember;
  jobs: Job;
  "blog-categories": BlogCategory;
  "blog-posts": BlogPost;
  locations: Location;
  services: Service;
  pages: PageEntry;
};
