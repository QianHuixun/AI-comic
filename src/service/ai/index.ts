// utils/dashscope.ts
import DashScope from "dashscope"

export const dashscope = new DashScope({
  apiKey: process.env.DASHSCOPE_API_KEY!
})