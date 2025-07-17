# SubjectSwap

SubjectSwap is a React application built with Vite that implements JWT cookie-based authentication. This project utilizes `react-router-dom` for routing and includes a custom context provider for managing authentication state.

## Features

- User authentication with JWT
- Protected routes for authenticated users
- User-friendly login and account creation forms
- Email verification for new accounts
- Responsive design

## Project Structure

```
SubjectSwap
├── src
│   ├── App.jsx                # Main application component with routing
│   ├── main.jsx               # Entry point of the application
│   ├── context
│   │   └── AuthProvider.jsx   # Context provider for authentication management
│   ├── routes
│   │   ├── Dashboard.jsx      # User dashboard component
│   │   ├── Login.jsx          # Login form component
│   │   ├── CreateAccount.jsx  # Account creation form component
│   │   ├── VerifyEmail.jsx    # Email verification component
│   │   └── ProtectedRoute.jsx  # Wrapper for protected routes
│   └── utils
│       └── jwt.js            # Utility functions for handling JWTs
├── public
│   └── index.html            # Main HTML file
├── package.json               # NPM configuration file
├── vite.config.js            # Vite configuration file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd SubjectSwap
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.