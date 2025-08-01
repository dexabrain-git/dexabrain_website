# Dexabrain NRX Event Page

A modern, responsive event registration page for the Neuro Reset Awareness Seminar hosted by Dexabrain, built according to the official Dexabrain Brand Book v1.1.

## 🎯 Features

- **Brand-Compliant Design**: Follows Dexabrain Brand Book v1.1 specifications
- **ZenEasy-Style Lighting**: Natural, warm glow effects with amber accents
- **Responsive Design**: Mobile-first approach with clean, modern UI
- **Event Registration**: Form with validation and confirmation
- **Calendar Integration**: Add to Google Calendar or download ICS file
- **Email Confirmation**: Mock email confirmation system
- **WhatsApp Sharing**: Share event details via WhatsApp
- **Professional Design**: Healthcare-focused aesthetic with custom branding

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom brand tokens
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Deployment**: Vercel (planned)

## 🎨 Brand Implementation

### Colors
- **Primary Gradient**: `#1DE9B6` to `#2979FF` (Logo gradient)
- **Solid Primary**: `#2A72C4` (UI elements and buttons)
- **Amber Glow**: `#FDBA74` (ZenEasy-inspired lighting)
- **Neutrals**: `#F5F5F5` (background), `#1F2937` (dark), `#FFFFFF` (white)

### Typography
- **Primary Font**: AXIS Extra Bold Regular (H1s, major titles)
- **Secondary Font**: Inter (body copy, labels)
- **Usage**: Uppercase for H1s and CTAs, sentence case for body text

### UI Elements
- **Buttons**: Rounded-full with gradient backgrounds
- **Cards**: White background with soft shadows and rounded-xl corners
- **Forms**: Clear labels with ample spacing and brand focus rings
- **Animations**: Smooth transitions with hover effects and glow animations

## 📁 Project Structure

```
src/
├── app/
│   ├── event/
│   │   └── neuro-reset-awareness-seminar/
│   │       └── page.tsx          # Main event page
│   ├── globals.css               # Global styles with brand tokens
│   ├── layout.tsx                # Root layout with brand metadata
│   └── page.tsx                  # Home page (redirects to event)
├── components/
│   ├── CalendarButton.tsx        # Calendar integration with brand styling
│   ├── ConfirmationModal.tsx     # Success modal with amber glow
│   ├── EventDetails.tsx          # Event information with brand icons
│   ├── EventHero.tsx             # Hero section with ZenEasy lighting
│   └── EventRegisterForm.tsx     # Registration form with brand styling
└── utils/
    ├── calendar.ts               # Calendar utilities
    └── emailConfirmation.ts      # Email confirmation logic
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dexabrain-nrx-event
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Event Details

- **Event**: Neuro Reset Awareness Seminar
- **Date**: September 7, 2025
- **Time**: 3:00 PM - 4:30 PM
- **Venue**: West Forum, Trehaus, Funan L3, City Hall
- **Speakers**: Prof Andy Hsu & Dr Diana Chan
- **Capacity**: 50 participants

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for production settings:

```env
# Google Apps Script Web App URL (for production)
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=your_script_url_here

# Email service configuration
EMAIL_SERVICE_API_KEY=your_email_service_key
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with brand tokens:

```ts
theme: {
  extend: {
    colors: {
      primary: '#2A72C4',
      gradientStart: '#1DE9B6',
      gradientEnd: '#2979FF',
      amberGlow: '#FDBA74',
      background: '#F5F5F5',
      dark: '#1F2937',
    },
    fontFamily: {
      sans: ['"AXIS Extra Bold Regular"', 'Inter', 'sans-serif'],
    },
    boxShadow: {
      card: '0 10px 15px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(253, 186, 116, 0.3)',
    },
  },
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

## 🎨 Brand Features

### ZenEasy-Style Lighting
- Animated glow effects using amber accent color
- Natural, warm lighting that creates a calming atmosphere
- Subtle animations that enhance the user experience

### Professional Healthcare Aesthetic
- Clean, minimal design with focus on readability
- Trustworthy color scheme with scientific foundation
- Human-centered approach with warm interactions

### Accessibility
- High contrast ratios for readability
- Focus indicators using brand colors
- Keyboard navigation support
- Screen reader friendly markup

## 🔮 Future Enhancements

- [ ] Google Apps Script integration for form submission
- [ ] Sanity CMS integration for content management
- [ ] Real email service integration
- [ ] Analytics tracking
- [ ] SEO optimization
- [ ] Multi-language support
- [ ] Admin dashboard for registration management
- [ ] Advanced brand animations
- [ ] Dark mode support

## 📱 Responsive Design

The page is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🎯 User Journey

1. **Landing**: Hero section with ZenEasy lighting and event overview
2. **Details**: Comprehensive event information with brand styling
3. **Registration**: Form with validation and brand-consistent design
4. **Confirmation**: Success modal with amber glow and calendar options
5. **Sharing**: WhatsApp integration for social sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the brand guidelines
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to Dexabrain. All rights reserved.

## 📞 Support

For questions or support, contact:
- Email: info@dexabrain.com
- Phone: +65 1234 5678

---

Built with ❤️ for Dexabrain following Brand Book v1.1
