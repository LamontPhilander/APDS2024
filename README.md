This is a university project for the module: APDS7312

---

# **International Payment System**

This is an internal international payment system designed to handle secure transactions between customers and employees for a banking application. It integrates with various services and processes payments using SWIFT (for South Africa) and other international payment providers. This project includes features for logging in employees and customers, managing payments, and verifying transactions using secure authentication and validation mechanisms.

---

## **Features**

### **Customer Features:**

- Customer login and registration.
- View payment history and transaction details.
- Initiate a payment by entering the amount, selecting a currency, and choosing a provider.
- Provide receiver account details and SWIFT code for payment processing.
- Finalize payment by clicking on the "Pay Now" button.

#### **Test Login Credentials:**

- username: Lamont Philander | accountNumber: CAP1234567 | password: password123
- username: John Doe | accountNumber: ACC1234566 | password: custpassword1
- username: Jane Smith | accountNumber: ACC6543211 | password: custpassword2

### **Employee Features:**

- Employee login and authentication.
- View transactions and manage employee details.
- Approve and verify transaction details before submission for SWIFT payment processing.

#### **Test Login Credentials:**

- username: employee1 | password: password123
- username: employee2 | password: password123

### **Shared Features:**

- Role-based access control for customers and employees.
- JWT-based authentication for secure login sessions.
- Error handling for common authentication issues and failed transactions.

---

## **Technologies Used**

- **Frontend:**

  - ReactJS for building dynamic and responsive user interfaces.
  - Axios for making API calls to the backend.
  - CSS/SCSS for styling components.

- **Backend:**

  - Node.js with Express.js to handle server-side logic.
  - Mongoose for interacting with MongoDB.
  - bcrypt for password encryption.
  - JSON Web Tokens (JWT) for secure authentication.
  - Supertest for API testing.

- **Other:**
  - CircleCI for continuous integration and delivery.
  - SonarQube for static code analysis and ensuring code quality.

---

## **Installation**

### **Backend Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/LamontPhilander/APDS2024.git
   cd APDS2024
   ```

2. Install dependencies:

   ```bash
   cd BACKEND
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `BACKEND` directory and add the following:
     ` ATLAS_URI="mongodb+srv://lamont_llp:KMqGYY1eHB1PmEgW@cluster0.eaymm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=37a6f4dcfa37a470b3f8c03cb2b9d20272828c4c2277bc386d30e19068cd56f6
`

4. Start the server:
   ```bash
   npm run dev
   ```

### **Frontend Setup**

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

---

## **Running Tests**

### **Backend Tests:**

To run backend tests using Jest and Supertest:

1. Install testing dependencies:

   ```bash
   npm install --save-dev jest supertest
   ```

2. Run tests:
   ```bash
   npm run test
   ```

### **Frontend Tests:**

For React components and API testing:

1. Install testing libraries:

   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom
   ```

2. Run frontend tests:
   ```bash
   npm test
   ```

---

## **CI/CD Setup**

### **CircleCI:**

- This project is integrated with CircleCI for continuous integration and deployment.
- CircleCI runs tests on every commit and deploys the application after a successful build.
- The pipeline includes a SonarQube scan for static code analysis, checking for hotspots and code smells.

---

## **Code Quality**

- **SonarQube:** The code is regularly analyzed by SonarQube to identify potential issues such as code smells, security vulnerabilities, and maintainability problems.

## **Contact**

For inquiries or support, please contact:

- **Lamont Philander**  
  Email: st10092647@imconnect.edu.za  
  GitHub: [@LamontPhilander](https://github.com/LamontPhilander)

---
