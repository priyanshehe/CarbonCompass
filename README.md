# 🌱 Carbon Compass

**Know Your Carbon Story. Change It One Habit At A Time.**

Carbon Compass is a privacy-first web application that helps users estimate, understand, and reduce their carbon footprint through personalized lifestyle assessments, simulations, and habit-based action plans.

---

## 🚀 Features

### 📊 Carbon Footprint Assessment

Users answer a guided lifestyle questionnaire covering:

* Transportation habits
* Weekly travel distance
* Dietary choices
* Home energy usage
* Flight frequency
* Shopping habits

The assessment generates a personalized carbon profile based on user behavior.

---

### 📈 Carbon Impact Simulator

Experiment with lifestyle changes and instantly see how different choices affect your estimated carbon footprint.

Examples:

* Switching to public transport
* Reducing flights
* Adopting a plant-based diet
* Using renewable energy

---

### ✅ Habit-Based Action Plans

Users can commit to sustainable habits such as:

* Walking or cycling more often
* Reducing energy consumption
* Shopping sustainably
* Reducing food waste

Progress is tracked locally in the browser.

---

### ♿ Accessibility Settings

Built with accessibility in mind:

* Theme selection
* Adjustable font sizes
* Reduced motion support
* Keyboard navigation support

---

### 🔒 Privacy First

Carbon Compass follows a **local-first architecture**.

* No user accounts required
* No personal data sent to servers
* Data stored locally in browser storage
* No tracking or analytics

---

## 🛠 Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript

### Validation & State Management

* Zod
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
├── components/
├── context/
├── domain/
├── __tests__/
└── middleware.ts
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/priyanshehe/CarbonCompass.git
```

Move into the project folder:

```bash
cd CarbonCompass
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## 🎯 Project Goals

The goal of Carbon Compass is to make sustainability more approachable by:

* Increasing awareness of personal carbon emissions
* Demonstrating the impact of everyday choices
* Encouraging long-term sustainable habits
* Providing a simple educational tool for climate-conscious decision making

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Assessment Flow
* Dashboard
* Simulator
* Action Plan
* Settings Page

---

GitHub: https://github.com/priyanshehe

---

## 📄 License

This project was created for educational and portfolio purposes.
