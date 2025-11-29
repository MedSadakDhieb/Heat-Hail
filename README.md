# React Globe Project

A React application featuring an interactive 3D globe with chatbot integration and Google Maps functionality.

## Features

- 🌍 Interactive 3D Globe using `react-globe.gl`
- 💬 AI-powered Chatbot with Gemini API integration
- 🗺️ Google Maps integration
- ⚡ Built with Vite for fast development
- 🎨 Smooth scrolling with Lenis

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file and add your API keys:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   
   > **Note:** Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
project/
├── public/          # Static assets
├── src/
│   ├── componets/   # React components
│   │   ├── ChatBot.jsx
│   │   ├── GoogleMap.jsx
│   │   └── LoginPanel.jsx
│   ├── data/        # JSON data files
│   ├── App.css      # Main styles
│   └── ...
├── .env.example     # Environment variables template
├── .gitignore       # Git ignore rules
└── package.json     # Project dependencies
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **react-globe.gl** - 3D globe visualization
- **Lenis** - Smooth scrolling
- **Gemini API** - AI chatbot integration

## Environment Variables

This project uses environment variables to store sensitive information like API keys. 

**Important:** Never commit your `.env` file to GitHub. It's already included in `.gitignore` to prevent accidental commits.

Required environment variables:
- `VITE_GEMINI_API_KEY` - Your Gemini API key for the chatbot functionality

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (Recommended)

The project uses GitHub Actions to automatically deploy when you push to the `main` branch.

**Setup Steps:**

1. **Add your API key as a GitHub Secret:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Click **Add secret**

2. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Push your changes:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push
   ```

4. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be live at: `https://medsadakdhieb.github.io/Heat-Hail/`

### Manual Deployment

Alternatively, you can deploy manually:

```bash
npm run deploy
```

This will build your project and push it to the `gh-pages` branch.

### Live Site

Once deployed, your application will be available at:
**https://medsadakdhieb.github.io/Heat-Hail/**

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Support

For issues or questions, please open an issue in the GitHub repository.
