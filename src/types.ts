export type Source = {
  id: string;
  title: string;
  url?: string;
  publisher?: string;
  year?: number;
  quote?: string; // short excerpt
  perspective?: 'VN' | 'US' | 'International';
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO date (YYYY-MM-DD) or year-month
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  summary: string;
  body?: string; // optional longer description (markdown allowed)
  sources: string[]; // references by Source.id
  tags?: string[];
};

export type Person = {
  id: string;
  name: string;
  bio?: string;
  roles?: string[];
};

export type Term = {
  id: string;
  term: string;
  definition: string;
};

export type MuseumData = {
  sources: Source[];
  events: EventItem[];
  people?: Person[];
  terms?: Term[];
};

