import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type InputTabKey = "manual" | "upload" | "crawl";

type InputTab = {
  key: InputTabKey;
  label: string;
  disabled?: boolean;
};

type StyleOption = {
  label: string;
  value: string;
};

type CharacterAction = "reuse" | "update" | "create";
type ComicAssetStatus = "pending" | "completed" | "failed";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type NovelRecord = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  style: string | null;
  sourceType: "manual" | "upload";
  status: "draft" | "active" | "archived";
  totalChapters: number;
  createdAt: string | null;
  updatedAt: string | null;
};

type NovelDetail = NovelRecord & {
  stats: {
    chapterCount: number;
    characterCount: number;
  };
};

type ChapterRecord = {
  id: number;
  novelId: number;
  chapterNo: number;
  title: string;
  content: string;
  contentLength: number;
  summary: string | null;
  storyboardJson: {
    storyboards?: StoryboardItem[];
  } | null;
  analysisJson: ChapterAnalysisResult | null;
  analysisError: string | null;
  analysisAttempts: number;
  lastAnalyzedAt: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string | null;
  updatedAt: string | null;
};

type ChapterCharacterSummary = {
  id: number;
  name: string;
  action: CharacterAction;
  roleInChapter: string | null;
  changeSummary: string | null;
};

type CharacterRecord = {
  id: number;
  novelId: number;
  name: string;
  aliasesJson: string[] | null;
  gender: string | null;
  ageRange: string | null;
  appearance: string | null;
  personality: string | null;
  background: string | null;
  ability: string | null;
  relationshipJson: Array<Record<string, unknown>> | null;
  firstChapterId: number | null;
  lastChapterId: number | null;
  version: number;
  createdAt: string | null;
  updatedAt: string | null;
};

type CharacterAppearanceRecord = {
  chapterId: number;
  chapterNo: number;
  chapterTitle: string;
  action: CharacterAction;
  roleInChapter: string | null;
  changeSummary: string | null;
};

type CharacterDetail = CharacterRecord & {
  recentAppearances: CharacterAppearanceRecord[];
};

type SceneItem = {
  title: string;
  summary: string;
  location?: string | null;
  mood?: string | null;
  characters: string[];
};

type StoryboardItem = {
  sceneTitle: string;
  panelNo: number;
  shot: string;
  description: string;
  dialogue?: string | null;
  emotion?: string | null;
};

type ChapterAnalysisCharacter = {
  name: string;
  aliases: string[];
  action: CharacterAction;
  matchedCharacterId: number | null;
  matchType: "id" | "alias" | "name" | "fuzzy" | "none";
  confidence: number;
  roleInChapter: string | null;
  changeSummary: string;
  extractedProfile: {
    gender?: string | null;
    ageRange?: string | null;
    appearance?: string | null;
    personality?: string | null;
    background?: string | null;
    ability?: string | null;
    relationships?: Array<{
      targetName: string;
      relation: string;
    }>;
  };
  evidence: string[];
};

type ChapterAnalysisResult = {
  summary: string;
  scenes: SceneItem[];
  storyboards: StoryboardItem[];
  characters: ChapterAnalysisCharacter[];
};

type ChapterDetail = ChapterRecord & {
  characters: ChapterCharacterSummary[];
  storyboardImages: StoryboardImageRecord[];
  comicPages: ComicPageRecord[];
};

type AnalyzeChapterResponse = {
  chapterId: number;
  status: "completed";
  summary: string;
  characters: Array<{
    id: number;
    name: string;
    action: CharacterAction;
    roleInChapter: string | null;
    changeSummary: string;
  }>;
};

type StoryboardImageRecord = {
  id: number;
  panelNo: number;
  sceneTitle: string;
  promptText: string;
  revisedPrompt: string | null;
  remoteUrl: string | null;
  imageData: string | null;
  mimeType: string | null;
  status: ComicAssetStatus;
  errorMessage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type ComicPageRecord = {
  id: number;
  pageNo: number;
  title: string;
  layoutJson: Record<string, unknown> | null;
  panelImageIdsJson: number[] | null;
  imageData: string;
  mimeType: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type GenerateComicResponse = {
  chapterId: number;
  storyboardImages: StoryboardImageRecord[];
  comicPages: ComicPageRecord[];
};

export type {
  AnalyzeChapterResponse,
  ApiResponse,
  ChapterAnalysisCharacter,
  CharacterAppearanceRecord,
  CharacterDetail,
  ChapterAnalysisResult,
  ChapterCharacterSummary,
  ChapterDetail,
  ChapterRecord,
  CharacterAction,
  CharacterRecord,
  ComicPageRecord,
  ComicAssetStatus,
  GenerateComicResponse,
  IconProps,
  InputTab,
  InputTabKey,
  NovelDetail,
  NovelRecord,
  SceneItem,
  StoryboardImageRecord,
  StoryboardItem,
  StyleOption,
};
