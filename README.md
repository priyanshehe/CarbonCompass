# 🌱 Carbon Compass

### Know Your Carbon Story. Change It One Habit At A Time.

Carbon Compass is a privacy-first sustainability platform that helps users measure, understand, and reduce their carbon footprint through personalized lifestyle assessments, impact simulations, and actionable habit recommendations.

Designed to make climate awareness practical and accessible, Carbon Compass transforms everyday lifestyle choices into meaningful environmental insights.

---

## 🚀 Highlights

* 📊 Personalized Carbon Footprint Assessment
* 📈 Real-Time Carbon Impact Simulator
* ✅ Habit-Based Sustainability Action Plans
* ♿ Accessibility-Focused Design
* 🔒 Local-First Privacy Architecture
* 🧪 Comprehensive Automated Testing
* ⚡ Fast, Responsive, Modern Web Experience

---

## 🏅 Quality Metrics

| Metric                | Status             |
| --------------------- | ------------------ |
| Production Build      | ✅ Passing          |
| TypeScript Validation | ✅ Passing          |
| ESLint Validation     | ✅ Clean            |
| Automated Tests       | ✅ 21 Tests Passing |
| Accessibility Support | ✅ Implemented      |
| Responsive Design     | ✅ Supported        |
| Local-First Privacy   | ✅ Implemented      |

---

## 🌍 The Problem

Many people want to live more sustainably but struggle to understand how their daily choices affect their environmental impact.

Most carbon calculators simply generate a number without explaining:

* Why emissions are high
* Which lifestyle factors matter most
* How improvements can be made
* What actions create meaningful reductions

Carbon Compass bridges this gap by combining assessment, education, simulation, and habit formation into a single user experience.

---

## 💡 Solution

Carbon Compass helps users:

1. Assess their current lifestyle emissions.
2. Understand major carbon contributors.
3. Simulate lifestyle changes instantly.
4. Commit to sustainable habits.
5. Track progress locally and privately.

The goal is not only awareness—but action.

---

## 📊 Personalized Carbon Footprint Assessment

Users complete a guided assessment covering:

### 🚗 Transportation

* Primary transportation method
* Weekly travel distance

### 🍽 Diet & Food

* Meat consumption
* Vegetarian and vegan lifestyles
* General eating habits

### ⚡ Home Energy

* Energy source selection
* Renewable energy usage

### ✈️ Travel

* Annual flight frequency

### 🛍 Consumption

* Shopping behavior
* Sustainable purchasing habits

The system generates a personalized carbon profile based on these lifestyle factors.

---

## 📈 Carbon Impact Simulator

The simulator allows users to explore "what-if" scenarios and instantly visualize potential carbon reductions.

Examples include:

* Switching to public transportation
* Driving fewer kilometers
* Taking fewer flights
* Adopting a plant-based diet
* Moving to renewable energy
* Reducing consumption habits

Changes are reflected immediately to help users understand their environmental impact.

---

## ✅ Habit-Based Action Plans

Carbon Compass provides practical recommendations that users can commit to.

Example habits include:

* Walking or cycling short trips
* Using public transportation
* Reducing food waste
* Lowering household energy usage
* Purchasing secondhand products
* Repairing instead of replacing items

Habit commitments and completion tracking are stored locally in the browser.

---

## ♿ Accessibility Features

Accessibility was a core consideration throughout development.

Features include:

* Keyboard navigation support
* Accessible form controls
* Adjustable font sizes
* Reduced motion support
* Multiple theme options
* High-contrast mode support
* Screen-reader-friendly content

The application aims to provide an inclusive experience for all users.

---

## 🔒 Privacy First

Carbon Compass follows a local-first architecture.

### No User Accounts

Users can use the application without creating an account.

### No Data Collection

Personal assessment data is never transmitted to external servers.

### No Tracking

No analytics, advertising trackers, or behavioral monitoring are used.

### Local Storage Only

Assessment results, commitments, and preferences remain on the user's device.

Your data stays under your control.

---

## 🏗 Architecture Overview

```text
User Assessment
       ↓
Validation Layer (Zod)
       ↓
Carbon Calculation Engine
       ↓
Dashboard & Insights
       ↓
Simulator
       ↓
Habit Recommendations
```

The architecture separates:

* UI Components
* Domain Logic
* Validation
* State Management
* Testing

making the application maintainable and scalable.

---

## 🛠 Technology Stack

### Frontend

* Next.js 15
* React 19
* TypeScript

### Validation

* Zod

### State Management

* React Context API

### Styling

* CSS Modules

### Testing

* Vitest
* Testing Library
* Playwright

### Deployment

* Vercel

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── assessment/
│   ├── dashboard/
│   ├── simulator/
│   ├── action-plan/
│   └── settings/
│
├── components/
│
├── context/
│
├── domain/
│
├── __tests__/
│
└── styles/
```

---

## 🧪 Testing & Quality Assurance

Carbon Compass includes multiple layers of testing.

### Unit Testing

Validates:

* Carbon calculations
* Validation schemas
* Domain logic

### Component Testing

Validates:

* Buttons
* Forms
* Interactive UI components

### Integration Testing

Validates:

* Assessment flow
* Dashboard functionality
* Action plan workflows

### End-to-End Testing

Validates:

* Complete user journeys
* Accessibility interactions
* State persistence

### Current Test Status

* ✅ 7 Test Suites Passing
* ✅ 21 Tests Passing
* ✅ Build Passing
* ✅ Lint Passing

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/priyanshehe/CarbonCompass.git
```

### Navigate to Project

```bash
cd CarbonCompass
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Available Commands

### Start Development

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

### Run Coverage

```bash
npm run test:coverage
```

### Run End-to-End Tests

```bash
npm run test:e2e
```

---

## 🎯 Project Goals

Carbon Compass was created to:

* Increase awareness of personal carbon emissions
* Educate users about sustainable lifestyle choices
* Demonstrate the impact of everyday decisions
* Encourage long-term environmental responsibility
* Make climate action more accessible and actionable

---

## 🌎 Why Carbon Compass?

Many sustainability tools focus solely on measurement.

Carbon Compass focuses on:

* Understanding
* Education
* Simulation
* Habit Formation
* Long-Term Change

The objective is not simply to calculate emissions, but to empower users to reduce them.

---

## 🏆 Built For

**PromptWar Virtual 2026**

A project focused on creating meaningful digital solutions that address real-world challenges through technology, accessibility, privacy, and user-centered design.

---

## 👨‍💻 Author

**Priyanshu Tiwary**

GitHub: https://github.com/priyanshehe

---

## 📄 License

This project was created for educational, portfolio, and competition purposes.
