//File: example/example-node.ts

import { z } from "zod";
import axios from "axios";

import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";

import {
  CardUIBuilder,
  TableUIBuilder,
  MapUIBuilder,
} from "@dainprotocol/utils";

const queryDatabaseConfig: ToolConfig = {
  id: "query-database",
  name: "Query Database",
  description: "Performs a database query operation",
  input: z
    .object({
      query: z.string().describe("The database query to execute"),
    })
    .describe("Input parameters for the database query"),
  output: z.string().describe("Query result message"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ query }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested database query: ${query}`
    );

    return {
      text: "Querying the database...",
      data: "Querying the database...",
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Database Query")
        .content("Querying the database...")
        .build(),
    };
  },
};

const getMeetingActionItemsConfig: ToolConfig = {
  id: "get-meeting-action-items",
  name: "Get Meeting Action Items",
  description: "Get action items from my most recent meeting",
  input: z.object({}).describe("No input required"),
  output: z
    .object({
      actionItems: z.string().describe("Description of meeting action items"),
    })
    .describe("Meeting action items and follow-up details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ meetingTitle }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested action items for meeting`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/e0243b5d-0f4a-4341-a57e-33ce9dddf1ac/run",
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    const responseJson = await response.json();
    const actionItems = responseJson.instructions || "";

    return {
      text: `Retrieved action items for ${meetingTitle}`,
      data: {
        actionItems,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title(`👨‍💻 Orchestrator Agent:`)
        .content(`## Instructions\n${actionItems}`)
        .build(),
    };
  },
};

const addToNotionConfig: ToolConfig = {
  id: "add-to-notion",
  name: "Add to Notion",
  description: "Adds a new task to Notion database",
  input: z
    .object({
      task: z.string().describe("Task description"),
      status: z.string().describe("Task status (e.g., doing, todo, done)"),
      date: z.string().describe("Due date for the task"),
    })
    .describe("Input parameters for creating a Notion task"),
  output: z
    .object({
      pageId: z.string().describe("ID of the created Notion page"),
      url: z.string().describe("URL of the created Notion page"),
    })
    .describe("Created Notion page details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ task, status, date }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested to add task to Notion: ${task}`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/0fae0e40-97cf-42d5-bd8c-40bc1a696c32/run",
      {
        method: "POST",
        body: JSON.stringify({
          task,
          status,
          date,
        }),
      }
    );

    const responseJson = await response.json();

    return {
      text: `Added task "${task}" to Notion`,
      data: {
        pageId: responseJson.id,
        url: responseJson.url,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Task Added to Notion")
        .content(
          `Successfully added task to Notion:\n\n- Task: ${task}\n- Status: ${status}\n- Due Date: ${date}\n\n[View in Notion](${responseJson.url})`
        )
        .build(),
    };
  },
};

const createCalendarEventConfig: ToolConfig = {
  id: "create-calendar-event",
  name: "Create Calendar Event",
  description: "Creates a new calendar event",
  input: z
    .object({
      task: z.string().describe("Event description or title"),
    })
    .describe("Input parameters for creating a calendar event"),
  output: z
    .object({
      calendarURL: z.string().describe("URL to the created calendar event"),
    })
    .describe("Calendar event details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ task }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested to create calendar event: ${task}`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/a02fc62a-a664-4e44-a2d8-79c2ac7c7779/run",
      {
        method: "POST",
        body: JSON.stringify({
          task,
        }),
      }
    );

    const responseJson = await response.json();

    return {
      text: `Created calendar event for "${task}"`,
      data: {
        calendarURL: responseJson.calendarURL,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Calendar Event Created")
        .content(
          `Successfully created calendar event:\n\n- Event: ${task}\n\n[Add to Calendar](${responseJson.calendarURL})`
        )
        .build(),
    };
  },
};

const getTranscriptConfig: ToolConfig = {
  id: "get-zoom-meeting",
  name: "Get Zoom Meeting",
  description: "Gets most recent zoom meeting",
  input: z.object({}).describe(""),
  output: z
    .object({
      transcript: z.string().describe("Zoom meeting transcript"),
    })
    .describe("Zoom meeting transcript"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ input }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested zoom meeting for: ${input}`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/3d16aa92-7b25-415a-ad37-b5f9a33815a6/run",
      {
        method: "POST",
        body: JSON.stringify({
          input,
        }),
      }
    );

    const responseJson = await response.json();

    return {
      text: `Generated transcript for "${input}"`,
      data: {
        transcript: responseJson.transcript,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Generated Transcript")
        .content(`${responseJson.transcript}`)
        .build(),
    };
  },
};

const generatePresentationConfig: ToolConfig = {
  id: "generate-presentation",
  name: "Generate Presentation",
  description: "Generates a presentation from a Zoom meeting transcript",
  input: z
    .object({
      presentationInstructions: z
        .string()
        .describe("The presentation instructions"),
    })
    .describe("Input parameters for generating a presentation"),
  output: z
    .object({
      presentationUrl: z.string().describe("URL to the generated presentation"),
    })
    .describe("Generated presentation details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ presentationInstructions }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested to generate presentation from transcript`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/e5b710f4-9d2e-4493-ba09-81f98eb9523b/run",
      {
        method: "POST",
        body: JSON.stringify({
          presentationInstructions,
        }),
      }
    );

    const responseJson = await response.json();

    return {
      text: "Generated presentation",
      data: {
        presentationUrl: responseJson.presentationUrl,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Presentation Generated")
        .content(
          `## Generated Presentation
          
Your presentation has been successfully generated from the meeting transcript. You can view it below or [open in full screen](${responseJson.presentationUrl}).

![Presentation](${responseJson.presentationUrl})

*Tip: Click the presentation and use arrow keys to navigate slides*`
        )
        .build(),
    };
  },
};

const textToSpeechConfig: ToolConfig = {
  id: "generate-audio",
  name: "Generate Audio",
  description:
    "Generates audio from text input with customizable voices and styles",
  input: z
    .object({
      text: z.string().describe("The text to convert to speech"),
    })
    .describe("Input parameters for text-to-speech conversion"),
  output: z
    .object({
      audioUrl: z.string().describe("URL to the generated audio file"),
    })
    .describe("Generated audio details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ text }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested text-to-speech conversion: ${text}`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/5ce6905a-e6aa-47c7-854d-f40c5c14e1e2/run",
      {
        method: "POST",
        body: JSON.stringify({ text }),
      }
    );

    const responseJson = await response.json();

    return {
      text: `Converted text to speech`,
      data: {
        audioUrl: responseJson.audioUrl,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Text to Speech")
        .content(
          `Your text has been converted to speech. Listen below:

[Download Audio](${responseJson.audioUrl})`
        )
        .build(),
    };
  },
};

const generateAudioConfig: ToolConfig = {
  id: "generate-audio",
  name: "Generate Audio",
  description:
    "Generates audio from text input with customizable voices and styles",
  input: z
    .object({
      text: z.string().describe("The text to convert to audio"),
    })
    .describe("Input parameters for audio generation"),
  output: z
    .object({
      audioUrl: z.string().describe("URL to the generated audio file"),
    })
    .describe("Generated audio details"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ text }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested audio generation: ${text}`
    );

    const response = await fetch(
      "https://magicloops.dev/api/loop/5ce6905a-e6aa-47c7-854d-f40c5c14e1e2/run",
      {
        method: "POST",
        body: JSON.stringify({ text }),
      }
    );

    const responseJson = await response.json();

    return {
      text: `Generated audio`,
      data: {
        audioUrl: responseJson.audioUrl,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title("Audio Generated")
        .content(
          `Your audio has been successfully generated. Listen below:

[Download Audio](${responseJson.audioUrl})`
        )
        .build(),
    };
  },
};

const dainService = defineDAINService({
  metadata: {
    title: "Flow Pilot Zoom Agent",
    description:
      "A DAIN service providing various productivity tools for task management, meetings, and calendar events",
    version: "1.0.0",
    author: "Your Name",
    tags: ["productivity", "tasks", "calendar", "meetings"],
    // logo: "https://lime-fantastic-carp-546.mypinata.cloud/files/bafkreigx6v6hzxeys6lfvrb3wtbczus7uf3lg3ugtkh35lh72yvx3obu6m?X-Algorithm=PINATA1&X-Date=1739708207&X-Expires=30&X-Method=GET&X-Signature=32bb51df63e5a44ec020a34bed76e56df0a333709e94ee7254b826d32add9b79",
    logo: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png",
  },
  exampleQueries: [
    {
      category: "Tasks",
      queries: [
        "Add a task to Notion: Review project proposal by Friday",
        "Schedule a team meeting for tomorrow",
        "Get action items from my last meeting",
      ],
    },
  ],
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [
    queryDatabaseConfig,
    getMeetingActionItemsConfig,
    addToNotionConfig,
    createCalendarEventConfig,
    getTranscriptConfig,
    generatePresentationConfig,
    textToSpeechConfig,
    generateAudioConfig,
  ],
});

dainService.startNode({ port: 2022 }).then(() => {
  console.log("Weather DAIN Service is running on port 2022");
});
