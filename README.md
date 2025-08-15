# Persona AI - AI-Powered Persona Chat Application

A modern web application that allows users to chat with AI personas, including pre-built personas like Hitesh Choudhary and Piyush Garg, or create their own custom personas. Built with Next.js, TypeScript, and integrated with multiple LLM providers.

## 🌟 Features

### Core Features

- **Pre-built Personas**: Chat with Hitesh Choudhary and Piyush Garg personas
- **Custom Persona Creation**: Create your own AI personas with custom personalities, expertise, and communication styles
- **Multi-LLM Support**: Integrate with OpenAI, Google Gemini, and Anthropic Claude
- **Rate Limiting**: Built-in rate limiting to prevent API credit exhaustion
- **Real-time Chat**: Smooth, responsive chat interface with message history

### Persona Management

- **Persona Profiles**: Each persona has detailed profiles including expertise, personality, and tone
- **Dynamic Creation**: Easy-to-use form for creating custom personas
- **Expertise Tags**: Add multiple areas of expertise for each persona
- **Communication Style**: Define how each persona communicates and responds

### LLM Integration

- **Multiple Providers**: Support for OpenAI GPT-4, Google Gemini Pro, and Claude
- **API Key Management**: Secure storage and management of API keys
- **Provider Switching**: Easily switch between different LLM providers
- **Usage Monitoring**: Track API usage and rate limits

### User Experience

- **Modern UI/UX**: Beautiful, intuitive interface built with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Toast Notifications**: User-friendly feedback for all actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys from your preferred LLM providers

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd persona-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **For production, build and start**

   ```bash
   npm run build
   npm run start
   # or use the combined command
   npm run build:start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Setting Up LLM Providers

1. **Open the Settings Modal**

   - Click the settings icon in the header
   - Navigate to the "LLM Providers" section

2. **Add Your Provider**

   - Click "Add Provider"
   - Enter provider name (e.g., "OpenAI GPT-4")
   - Enter model name (e.g., "gpt-4")
   - Add your API key
   - Click "Add Provider"

3. **Set as Active**
   - Click "Set Active" on your preferred provider
   - The active provider will be used for all chat interactions

### Creating Custom Personas

1. **Click "Create Custom Persona"**

   - Fill in the persona's name and description
   - Define their personality traits
   - Add areas of expertise
   - Specify their communication tone
   - Optionally add an avatar URL

2. **Start Chatting**
   - Your custom persona will appear in the persona grid
   - Click on it to start a conversation

## 📱 Usage Examples

### Chatting with Hitesh Choudhary

```
User: "Can you help me learn React?"
Hitesh: "Absolutely! I love helping developers learn React! 🚀

Let me break this down in a practical way. React is all about building reusable components and managing state efficiently.

Start with the basics:
1. JSX syntax
2. Components and props
3. State management with useState
4. Event handling

What's your current programming experience? This will help me tailor the explanation just for you!"
```

### Chatting with Piyush Garg

```
User: "What's the best way to optimize a Next.js app?"
Piyush: "Great question! Performance optimization in Next.js is crucial for user experience. Here are the key areas to focus on:

**Image Optimization:**
- Use Next.js Image component with proper sizing
- Implement lazy loading for below-the-fold images

**Code Splitting:**
- Leverage dynamic imports for route-based splitting
- Use React.lazy() for component-level splitting

**Caching Strategies:**
- Implement ISR (Incremental Static Regeneration)
- Use SWR or React Query for data fetching

Would you like me to dive deeper into any of these areas?"
```

### Creating a Custom Persona

```
Name: "Gwen Chen"
Description: "UX/UI Designer and Frontend Developer"
Personality: "Creative, detail-oriented, and passionate about user experience. Loves explaining design principles and helping developers understand the user perspective."
Expertise: ["User Experience Design", "UI/UI Design", "Frontend Development", "Design Systems", "User Research"]
Tone: "Friendly, encouraging, and practical. Uses visual examples and real-world scenarios to explain concepts."
```

## 🏗️ Architecture

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Zustand**: State management
- **React Hot Toast**: Toast notifications

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **LLM Service Layer**: Abstraction for multiple AI providers
- **Rate Limiting**: Built-in usage tracking and limits

### State Management

- **Zustand Store**: Centralized state management
- **Persistent Storage**: Local storage for user preferences
- **Real-time Updates**: Reactive UI updates

## 🔒 Security & Privacy

- **API Key Storage**: Keys are stored locally and never sent to external servers
- **Rate Limiting**: Built-in protection against API abuse
- **Input Validation**: Comprehensive validation of all user inputs
- **Secure Communication**: HTTPS-only communication

## 📊 Rate Limiting

The application includes built-in rate limiting to protect your API credits:

- **Requests per Hour**: Configurable per provider
- **Tokens per Hour**: Token usage tracking
- **Automatic Reset**: Hourly reset of usage counters
- **Usage Monitoring**: Real-time display of current usage

## 🎨 Customization

### Styling

- **Tailwind CSS**: Easy to customize colors, spacing, and components
- **CSS Variables**: Centralized color scheme management
- **Component Library**: Reusable UI components

### Persona Templates

- **Pre-built Templates**: Start with existing personas
- **Custom Fields**: Add new fields to persona profiles
- **Avatar Support**: Custom avatar images or generated initials

## 🚀 Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔮 Future Roadmap

- [ ] **Multi-modal Support**: Image and voice interactions
- [ ] **Persona Sharing**: Share custom personas with the community
- [ ] **Advanced Analytics**: Detailed usage and performance metrics
- [ ] **Mobile App**: Native mobile applications
- [ ] **API Integration**: Webhook support for external integrations
- [ ] **Team Collaboration**: Multi-user persona management

---

**Happy Chatting! 🚀**

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
