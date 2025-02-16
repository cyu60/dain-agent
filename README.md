# Productivity Tools DAIN Service

A DAIN protocol service providing various productivity tools for task management, meetings, and calendar events.

## Features

- Query databases
- Extract action items from meetings
- Add tasks to Notion
- Create calendar events
- Get Zoom meeting transcripts
- Generate presentations from meeting transcripts

## Prerequisites

- Node.js (v16 or higher)
- DAIN Protocol API key

## Installation

1. Clone the repository
2. Install dependencies:
3. Create a `.env` file in the root directory
4. Add your DAIN API key to the `.env` file:
   ```
   DAIN_API_KEY=your_api_key_here
   ```
5. Build the project:
   ```bash
   npm run build
   ```
6. Start the service:
   ```bash
   npm start
   ```