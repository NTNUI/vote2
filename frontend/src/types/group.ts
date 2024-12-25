export interface Group {
  group_id: number;
  name: string;
  name_english: string;
  slug: string;
  gsuite_prefix: string;
  subgroups: any[];
  member?: boolean;
  access: string;
  sent_request?: boolean;
  category: string;
  website_link: string;
}
