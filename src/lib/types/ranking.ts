type Stat = {
    label: string;
    value: string;
  };
  
  type TopComic = {
    author: string;
    cover: string;
    rank: number;
    stats: Stat[];
    title: string;
  };
  
  type MetaItem = {
    accent?: boolean;
    icon: "comment" | "eye" | "heart";
    value: string;
  };
  
  type RankingItem = {
    cover: string;
    meta: [MetaItem, MetaItem];
    name: string;
    rank: number;
  };
  
  type RankingSection = {
    icon: "comments" | "eye";
    key: "comment" | "reading";
    title: string;
    items: RankingItem[];
  };

export type { Stat, TopComic, MetaItem, RankingItem, RankingSection };