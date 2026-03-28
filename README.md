# Safar Sathi AI

**AI-Powered Travel Itinerary Generator**

Safar Sathi AI is a modern travel planning web application that uses **Google Gemini AI** to generate personalized travel itineraries with real-time images, weather forecasts, and budget breakdowns.

**Live Demo:** [safar-sathi-ai.vercel.app](https://safar-sathi-ai.vercel.app/)

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Itinerary Generation** | Powered by Google Gemini 2.5 Flash for intelligent trip planning |
| **Real-Time Images** | Dynamic images from Pexels API for places and activities |
| **Weather Forecasts** | 5-day weather predictions for your destination |
| **Budget Breakdown** | Visual cost analysis across accommodation, food, transport, activities |
| **Day-by-Day Plans** | Detailed daily activities with estimated costs |
| **Top Places** | Curated recommendations with ratings and categories |
| **Local Tips** | Insider tips for each destination |
| **Save Trips** | Save generated itineraries to your dashboard |
| **Authentication** | Secure sign-in with Supabase Auth |
| **Responsive Design** | Works seamlessly on desktop and mobile |

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + shadcn/ui
- Lucide Icons

**Backend:**
- Supabase (Database + Auth + Edge Functions)
- Google Gemini 2.5 Flash (AI)
- Pexels API (Images)

**Deployment:**
- Vercel (Frontend)
- Supabase Edge Functions (Serverless)

---

## Project Structure

```
safar-sathi-ai/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Supabase client setup
│   ├── pages/             # Application pages
│   │   ├── Index.tsx      # Landing page
│   │   ├── Planner.tsx    # AI trip planner
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── Auth.tsx       # Authentication
│   └── main.tsx           # App entry point
├── supabase/
│   ├── functions/
│   │   └── generate-itinerary/  # AI Edge Function
│   └── config.toml        # Supabase configuration
├── public/                # Static assets
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI Studio API key
- Pexels API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RelaxItsAryan/Safar-Sathi-AI.git
   cd Safar-Sathi-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Edge Function secrets**
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   npx supabase secrets set PEXELS_API_KEY=your_pexels_api_key
   ```

5. **Deploy Edge Functions**
   ```bash
   npx supabase functions deploy generate-itinerary
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

### Supabase Edge Functions (Secrets)

| Secret | Description |
|--------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `PEXELS_API_KEY` | Pexels API key for images |

---

## API Keys Setup

### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it as `GEMINI_API_KEY` in Supabase secrets

### Pexels API
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Create a free account and get API key
3. Add it as `PEXELS_API_KEY` in Supabase secrets

---

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repo to Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Deploy

### Supabase (Backend)

Edge Functions are automatically deployed when you run:
```bash
npx supabase functions deploy generate-itinerary
```

---

## How It Works

1. **User Input** - Enter destination, duration, and budget
2. **AI Generation** - Gemini AI creates a detailed itinerary
3. **Image Fetching** - Pexels API provides relevant images
4. **Display** - Results shown in organized tabs (Overview, Itinerary, Weather, Budget, Places)
5. **Save** - Optionally save to dashboard for later access

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Authors

Built by **Dilisha and Aryan**
