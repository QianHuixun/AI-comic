import type {
  characterActionEnum,
  chapterStatusEnum,
  comicAssetStatusEnum,
  novelSourceTypeEnum,
  novelStatusEnum,
} from "../../db/schema.ts";

export interface SignInBody {
  passWord: string;
  phoneNumber: string;
}

export interface AuthSession {
  userId: number;
  phoneNumber: string;
  name?: string | null;
}

export interface AuthUserSummary {
  id: number;
  phoneNumber: string;
  name: string | null;
}

export type NovelStatus = typeof novelStatusEnum.enumValues[number];
export type NovelSourceType = typeof novelSourceTypeEnum.enumValues[number];
export type ChapterStatus = typeof chapterStatusEnum.enumValues[number];
export type CharacterAction = typeof characterActionEnum.enumValues[number];
export type ComicAssetStatus = typeof comicAssetStatusEnum.enumValues[number];

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface CreateNovelBody {
  title: string;
  description?: string;
  style?: string;
  sourceType?: NovelSourceType;
  status?: NovelStatus;
}

export interface CreateChapterBody {
  chapterNo: number;
  title: string;
  content?: string;
}

export interface AnalyzeChapterBody {
  force?: boolean;
}

export interface GenerateComicBody {
  force?: boolean;
}

export interface CharacterRelationship {
  targetName: string;
  relation: string;
}

export interface ExtractedCharacterProfile {
  gender?: string | null;
  ageRange?: string | null;
  appearance?: string | null;
  personality?: string | null;
  background?: string | null;
  ability?: string | null;
  relationships?: CharacterRelationship[];
}

export interface QwenCharacterAnalysisItem {
  name: string;
  aliases?: string[];
  action: CharacterAction;
  matchedCharacterId?: number | null;
  matchType: "id" | "alias" | "name" | "fuzzy" | "none";
  confidence: number;
  roleInChapter?: string | null;
  changeSummary: string;
  extractedProfile: ExtractedCharacterProfile;
  evidence: string[];
}

export interface QwenScene {
  title: string;
  summary: string;
  location?: string | null;
  mood?: string | null;
  characters: string[];
}

export interface QwenStoryboard {
  sceneTitle: string;
  panelNo: number;
  shot: string;
  description: string;
  dialogue?: string | null;
  emotion?: string | null;
}

export interface QwenChapterAnalysis {
  summary: string;
  scenes: QwenScene[];
  storyboards: QwenStoryboard[];
  characters: QwenCharacterAnalysisItem[];
}

export interface CharacterMergeResult {
  id: number;
  name: string;
  action: CharacterAction;
  roleInChapter: string | null;
  changeSummary: string;
}

export interface StoryboardImageAsset {
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
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ComicPageAsset {
  id: number;
  pageNo: number;
  title: string;
  layoutJson: Record<string, unknown> | null;
  panelImageIdsJson: number[] | null;
  imageData: string;
  mimeType: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GenerateComicResponse {
  chapterId: number;
  storyboardImages: StoryboardImageAsset[];
  comicPages: ComicPageAsset[];
}
