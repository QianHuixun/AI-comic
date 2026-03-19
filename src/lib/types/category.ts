type BadgeTone = "hot" | "new" | "recommend";

type CategoryItem = {
  count: string;
  gradient: string;
  iconClass: string;
  name: string;
};

type ComicItem = {
  author: string;
  badge?: {
    label: string;
    tone: BadgeTone;
  };
  comments: string;
  cover: string;
  likes: string;
  readings: string;
  title: string;
};

export type { BadgeTone, CategoryItem, ComicItem };