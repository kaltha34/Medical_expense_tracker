# MediTrack - Medical Expense Tracker

MediTrack is a comprehensive web application designed to help individuals and families track their medical expenses, manage insurance claims, and prepare for tax deductions. With an intuitive interface and practical features, MediTrack simplifies the often complex process of managing healthcare costs.

## Latest Updates

- **Sri Lankan Rupee (LKR) Support**: The application now fully supports Sri Lankan Rupee (LKR) for all financial transactions and displays
- **Modern UI Improvements**: Enhanced user interface with consistent styling and proper indentation
- **Localized Tax Information**: Updated tax deduction information specific to Sri Lanka

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
git clone https://github.com/kaltha34/Medical_Expense_Tracker.git
cd Medical_Expense_Tracker
```

2. Install dependencies for both client and server
```
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Start the development servers
```
# Start both client and server with concurrently
npm start

# Or start them separately
# Terminal 1 - Start the backend server
node server/server.js

# Terminal 2 - Start the React frontend
cd client
npm start
```

4. Access the application
```
The application will be available at http://localhost:3000
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
