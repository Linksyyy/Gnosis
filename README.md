
![Gnosis](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9XkC2zrLcpnjFqINHhOd5BhmoRCb4VVjsbQ&s)

# Gnosis

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](/LICENSE)

Gnosis is a Discord bot that integrates with the Google Gemini API, providing users with AI-powered search and chat capabilities. It also includes features for managing a local library of books.

## Features

*   **AI-powered chat:** Chat with the Google Gemini AI.
*   **Book management:** Manage a local library of books.
*   **Fuzzy search:** Find books in your library with fuzzy search.
*   **Slash commands:** All commands are available as slash commands.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Bun](https://bun.sh/)
*   [Node.js](https://nodejs.org/)
*   [Git](https://git-scm.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://www.github.com/linksyyy/gnosis
    ```
2.  Install the dependencies:
    ```sh
    bun install
    ```
3.  Create a `.env` file by copying the `.env.example` file:
    ```sh
    cp .env.example .env
    ```
4.  Add your environment variables to the `.env` file.
5.  Run the bot:
    ```sh
    bun run dev
    ```

## Usage

Here are some examples of how to use the bot's commands.

### `/avatar`

Shows the user's avatar.

```
/avatar
```

### `/gemini`

Talk to the Google AI.

```
/gemini input:Hello, world!
```

### `/library`

Access the community library.

```
/library search
```

### `/ping`

Checks the bot's latency.

```
/ping
```

### `/user`

Shows information about the user.

```
/user
```

## Dependencies

*   [@google/genai](https://www.npmjs.com/package/@google/genai)
*   [discord.js](https://www.npmjs.com/package/discord.js)
*   [drizzle-orm](https://www.npmjs.com/package/drizzle-orm)
*   [fuse.js](https://www.npmjs.com/package/fuse.js)
*   [pg](https://www.npmjs.com/package/pg)
