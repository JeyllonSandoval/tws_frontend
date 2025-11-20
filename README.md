# Twilio WhatsApp Sandbox Frontend (TWS Frontend)

Frontend web application developed with React and TypeScript to manage and visualize product reviews collected through WhatsApp conversations via Twilio. The application features a modern, minimalistic design inspired by shadcn/ui with dark/light theme support.

## 📋 Description

This project is a frontend application that connects to the TWS Backend API to display, edit, and delete product reviews. The reviews are collected through WhatsApp conversations managed by the backend, which processes messages via Twilio webhooks.

## ✨ Features

- **View Reviews**: Display all product reviews in a clean, card-based grid layout
- **Edit Reviews**: Update existing reviews with form validation
- **Delete Reviews**: Remove reviews with a confirmation dialog
- **Dark/Light Theme**: Toggle between dark and light themes with automatic persistence
- **Auto-refresh**: Automatically updates the reviews list every minute
- **Manual Refresh**: Refresh button to manually update reviews
- **Form Validation**: Real-time validation with error messages displayed in red
- **Responsive Design**: Fully responsive layout for mobile and desktop
- **Time Zone Detection**: Automatically displays dates and times in the user's local timezone
- **API Status Indicator**: Real-time API connection status

## 🛠️ Technologies Used

- **React 19.2.0**: UI library
- **TypeScript 5.9.3**: Type safety
- **Vite 7.2.2**: Build tool and dev server
- **React Icons 5.5.0**: Icon library (HeroIcons v2)
- **CSS3**: Custom styling with CSS variables for theming

## 📦 Prerequisites

Before starting, make sure you have installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for cloning the repository

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tws_frontend.git
cd tws_frontend
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://tws-backend-jssr.up.railway.app
```

> **Note:** If `VITE_API_BASE_URL` is not set, the application will use the default backend URL: `https://tws-backend-jssr.up.railway.app`

### 4. Start the Development Server

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
tws_frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images and static files
│   ├── components/         # React components
│   │   ├── ConfirmDialog.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ReviewList.tsx
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── ThemeContextValue.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useTheme.ts
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript type definitions
│   │   └── review.ts
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite environment types
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore rules
├── index.html              # HTML template
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # TypeScript app configuration
├── tsconfig.node.json      # TypeScript node configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🎨 Features Details

### Theme System

- **Dark Mode** (default): Black and gray color scheme
- **Light Mode**: White and light gray color scheme
- **Automatic Persistence**: Theme preference saved in localStorage
- **Smooth Transitions**: Seamless theme switching with CSS transitions

### Form Validation

The edit form includes comprehensive validation:

- **Contact Number**: Required, valid phone format (+1234567890)
- **User Name**: Required, 2-128 characters, letters/spaces/hyphens/apostrophes only
- **Product Name**: Required, 2-256 characters
- **Product Review**: Required, 10-5000 characters
- **Preferred Contact Method**: Required only if "Wants to be contacted again" is checked

All validation errors are displayed in red below the respective field.

### Auto-refresh

- **Automatic**: Reviews list refreshes every 60 seconds
- **Manual**: Refresh button in the header to update immediately
- **Smart Loading**: Shows loading spinner during data fetch

### Date Display

- Automatically converts UTC dates from the database to the user's local timezone
- Formatted in a user-friendly format (e.g., "January 15, 2024, 02:30 PM")

## 🔌 API Integration

The application connects to the TWS Backend API:

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Endpoints Used**:
  - `GET /` - Health check
  - `GET /reviews/` - Get all reviews
  - `GET /reviews/{id}` - Get single review
  - `PUT /reviews/{id}` - Update review
  - `DELETE /reviews/{id}` - Delete review

## 📝 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server on port 3000 with hot module replacement.

### Build

```bash
npm run build
```

Builds the application for production. Outputs to `dist/` directory.

### Preview

```bash
npm run preview
```

Previews the production build locally.

### Lint

```bash
npm run lint
```

Runs ESLint to check code quality.

## 🎯 Usage

### Viewing Reviews

1. When you open the application, you'll see all available reviews in a grid layout
2. Each review card displays:
   - User name and contact number
   - Product name
   - Product review text
   - Contact preferences (if user wants future contact)
   - Creation and update dates

### Editing a Review

1. Click the edit icon (✏️) on any review card
2. Modify the fields in the form
3. Form validation will show errors in red if there are issues
4. Click "Update" to save changes or "Cancel" to discard

### Deleting a Review

1. Click the delete icon (🗑️) on any review card
2. A confirmation dialog will appear
3. Confirm the deletion to remove the review

### Changing Theme

1. Click the theme toggle button (☀️/🌙) in the header
2. The theme will switch between dark and light modes
3. Your preference is saved automatically

### Refreshing Reviews

- **Automatic**: Reviews refresh every minute automatically
- **Manual**: Click the "Refresh" button next to the "Reviews" title

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-api-url.com
```

> **Important:** In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

### Vite Configuration

The development server is configured to run on port 3000. You can modify this in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Change this to your preferred port
  }
})
```

## 🎨 Design System

### Colors

**Dark Theme:**
- Background: `#0a0a0a` (primary), `#171717` (secondary)
- Text: `#ffffff` (primary), `#a3a3a3` (secondary)
- Borders: `#262626`, `#404040`

**Light Theme:**
- Background: `#ffffff` (primary), `#f9fafb` (secondary)
- Text: `#000000` (primary), `#6b7280` (secondary)
- Borders: `#e5e7eb`, `#d1d5db`

### Typography

- Font Family: System UI fonts
- Font Sizes: Responsive scaling from 0.75rem to 1.5rem
- Font Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 🐛 Troubleshooting

### Error: "VITE_API_BASE_URL is not defined"

**Solution:** Create a `.env` file in the project root with:
```env
VITE_API_BASE_URL=https://tws-backend-jssr.up.railway.app
```

### Error: "Cannot find module"

**Solution:** Run `npm install` to install all dependencies.

### Port 3000 already in use

**Solution:** Change the port in `vite.config.ts` or stop the process using port 3000.

### Theme not persisting

**Solution:** Clear browser localStorage and reload the page. The theme preference should save automatically.

## 📄 License

This project is open source and available under the MIT license.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Developed by **Jeyllon Sandoval**

- LinkedIn: [Jeyllon Sandoval](https://www.linkedin.com/in/jeyllon-slon-sandoval-rosario-bb2292320/)
- Backend API: [TWS Backend API](https://tws-backend-jssr.up.railway.app/)

---

**Built with ❤️ using React, TypeScript, and Vite**
