# Game Journalist AI Chatbot

An interactive AI chatbot built with Next.js 16, featuring a beautiful UI and customizable question templates for gaming enthusiasts and journalists.

## ✨ Features

- 🤖 **AI-Powered Chat Interface** - Interactive chatbot with streaming line-by-line responses
- 🎮 **Game Journalism Focus** - Pre-configured responses about games, news, reviews, and industry trends
- 🍔 **Hamburger Menu** - Quick access to prefilled gaming questions
- 💾 **LocalStorage Support** - Save and manage your own custom question templates
- ⚡ **Streaming Responses** - Messages appear line-by-line with smooth transitions
- 📱 **Responsive Design** - Full viewport height layout that works on all screen sizes

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chatbot.

## 🎯 How to Use

1. **Ask Questions** - Type your gaming-related questions in the chat input
2. **Use Quick Questions** - Click the hamburger menu (☰) to access prefilled questions
3. **Add Custom Questions** - Create your own question templates that persist in localStorage
4. **Watch Responses Stream** - AI responses appear line-by-line with smooth transitions

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Server-side API endpoint for chat
│   ├── globals.css               # Global styles with background effects
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main page with chatbot
├── components/
│   ├── Chatbot.tsx               # Main chatbot component
│   ├── Chatbot.module.css        # Chatbot styles with shadow effects
│   ├── HamburgerMenu.tsx         # Quick questions menu
│   └── HamburgerMenu.module.css  # Menu styles
public/
└── vg_bg.jpg                     # Background image (video game themed)
```

## 🎨 UI Features

- **Gradient Design** - Purple gradient theme throughout the interface
- **Smooth Animations** - Slide-in, fade-in, and typing indicator animations
- **Message Streaming** - 150ms delay between each line for natural reading pace

## 🔧 Customization

### Update AI Responses

Edit `src/app/api/chat/route.ts` to customize the AI responses or integrate with real AI APIs:

```typescript
const generateAIResponse = async (message: string): Promise<string> => {
  // Add your custom logic or API calls here
}
```

### Integrate Real AI

Replace the mock responses with actual AI services like OpenAI, Anthropic, or Google Gemini:

```bash
npm install openai
```

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

### Change Colors

Update the gradient colors in `src/components/Chatbot.module.css`:

```css
.container {
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
}
```

## 🛠️ Technologies

- **Next.js 16** - React framework with App Router (Turbopack)
- **React 19** - UI library with modern hooks
- **TypeScript** - Type-safe development
- **CSS Modules** - Scoped component styling
- **LocalStorage API** - Client-side data persistence

## 📝 Default Questions

The chatbot comes with 5 default gaming questions:
1. What are the best games of 2024?
2. Tell me about the latest gaming news
3. What are the most anticipated upcoming games?
4. Compare different gaming consoles
5. What are the best indie games?

Custom questions can be added and will persist across sessions.

## 🚀 Deployment

Deploy easily on [Vercel](https://vercel.com/new):

```bash
npm run build
```

The app is optimized for production with server-side rendering and static optimization.

## 📄 License

MIT

---

Built with ❤️ for gaming enthusiasts and journalists

