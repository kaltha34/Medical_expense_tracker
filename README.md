# MediTrack - Medical Expense Tracker

MediTrack is a web application that helps users track their medical expenses, manage insurance claims, and prepare for tax deductions.

## Features

### MVP Features
- **User Authentication**: Register and login functionality
- **Dashboard**: Overview of expenses, claims, and tax deductions
- **Expense Management**: Add, view, edit, and delete medical expenses
- **Receipt Upload**: Upload and store receipts for medical expenses
- **Insurance Claim Tracking**: Track the status of insurance claims
- **Tax Report Generation**: Generate reports for tax deductible medical expenses

### Premium Features (Future Implementation)
- Automated claim submission to insurance providers
- Claim status notifications
- Insurance policy coverage analysis
- Automated tax form generation
- Integration with tax preparation software
- Year-over-year tax deduction analysis

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- LocalStorage for data persistence (MVP only)
- CSS for styling

### Backend
- Node.js
- Express.js
- In-memory data store (MVP only)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies for the client
```
cd medical-expense-tracker/client
npm install
```

3. Install dependencies for the server
```
cd ../server
npm install
```

### Running the Application

1. Start the server
```
cd medical-expense-tracker/server
npm run dev
```

2. Start the client
```
cd ../client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
medical-expense-tracker/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # React components
│       ├── App.js          # Main App component
│       └── index.js        # Entry point
├── server/                 # Backend Node.js/Express application
│   ├── server.js           # Express server
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Monetization Strategy

MediTrack follows a freemium business model:

1. **Free Tier**: Basic expense tracking, manual insurance claim management, and simple tax reporting
2. **Premium Tier**: Advanced features like automated claim submission, tax form generation, and integrations with insurance providers and tax software

## Future Enhancements

- Mobile application (iOS and Android)
- OCR for automatic receipt scanning and data extraction
- Direct integration with major insurance providers
- Personalized tax saving recommendations
- Family account management
- Healthcare provider directory and appointment scheduling

## License

This project is licensed under the MIT License.
