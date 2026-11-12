# 🤖 Gemini AI Website Builder Agent

An AI-powered Website Builder Agent built using Node.js and Google Gemini API. It understands user requirements and helps create frontend applications by executing terminal commands.

## 🚀 Features

- AI-powered website building
- Natural language understanding
- Google Gemini API integration
- Function calling implementation
- Terminal command execution
- Automatic folder and file creation
- Frontend project setup
- Error handling
- Operating system detection
- Interactive command confirmation
- Conversation context management

## 🛠️ Technologies Used

- JavaScript (ES6+)
- Node.js
- Google Gemini API
- @google/genai
- readline-sync
- Child Process
- Promisify
- dotenv

## ⚙️ Installation and Setup

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to Project

```bash
cd gemini-ai-website-builder-agent
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure API Key

Create a `.env` file in the root directory.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 5. Run the Agent

```bash
node index.js
```

## 💡 Example Usage

Ask the AI Agent:

- Create a React Calculator application.
- Create a responsive portfolio website.
- Create a modern landing page.
- Explain JavaScript concepts.

The agent can use terminal commands to create and manage project files after user confirmation.

## 🧠 How It Works

1. User enters a request.
2. Gemini AI understands the request.
3. Gemini decides whether a terminal function is needed.
4. The agent asks for command execution confirmation.
5. Node.js executes the approved command.
6. The execution result is sent back to Gemini.
7. Gemini provides the final response.

## 📁 Project Structure

```text
gemini-ai-website-builder-agent/
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

## 🔐 Security

- Store API keys in environment variables.
- Never upload `.env` to GitHub.
- Review terminal commands before execution.
- Avoid executing unknown or destructive commands.

## 🎯 Learning Objectives

This project demonstrates:

- Building AI Agents
- LLM integration
- Gemini Function Calling
- Node.js automation
- Asynchronous JavaScript
- Terminal command execution
- AI-powered frontend development

## 👩‍💻 Author

Ankita

## 📄 License

MIT License