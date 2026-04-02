export const chapterAnalysisJsonSchema = {
  name: "chapter_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string" },
      scenes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            location: { type: ["string", "null"] },
            mood: { type: ["string", "null"] },
            characters: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["title", "summary", "location", "mood", "characters"],
        },
      },
      storyboards: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            sceneTitle: { type: "string" },
            panelNo: { type: "number" },
            shot: { type: "string" },
            description: { type: "string" },
            dialogue: { type: ["string", "null"] },
            emotion: { type: ["string", "null"] },
          },
          required: [
            "sceneTitle",
            "panelNo",
            "shot",
            "description",
            "dialogue",
            "emotion",
          ],
        },
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            aliases: {
              type: "array",
              items: { type: "string" },
            },
            action: {
              type: "string",
              enum: ["reuse", "update", "create"],
            },
            matchedCharacterId: {
              type: ["number", "null"],
            },
            matchType: {
              type: "string",
              enum: ["id", "alias", "name", "fuzzy", "none"],
            },
            confidence: { type: "number" },
            roleInChapter: { type: ["string", "null"] },
            changeSummary: { type: "string" },
            extractedProfile: {
              type: "object",
              additionalProperties: false,
              properties: {
                gender: { type: ["string", "null"] },
                ageRange: { type: ["string", "null"] },
                appearance: { type: ["string", "null"] },
                personality: { type: ["string", "null"] },
                background: { type: ["string", "null"] },
                ability: { type: ["string", "null"] },
                relationships: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      targetName: { type: "string" },
                      relation: { type: "string" },
                    },
                    required: ["targetName", "relation"],
                  },
                },
              },
              required: [
                "gender",
                "ageRange",
                "appearance",
                "personality",
                "background",
                "ability",
                "relationships",
              ],
            },
            evidence: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "name",
            "aliases",
            "action",
            "matchedCharacterId",
            "matchType",
            "confidence",
            "roleInChapter",
            "changeSummary",
            "extractedProfile",
            "evidence",
          ],
        },
      },
    },
    required: ["summary", "scenes", "storyboards", "characters"],
  },
} as const;
