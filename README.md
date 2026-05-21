# Tools Issue Management System

A robust React + Vite frontend application designed to streamline tool inventory tracking, mechanic registration, tool issuing, and return workflows. 

This project was developed as a technical assignment for the Frontend Developer role to demonstrate production-ready component architecture, state management, and user workflow handling.

---

## 🚀 Project Overview

The Tools Issue Management System simulates a real-world workshop environment where:
*   **Mechanics** can register, log in, browse available tools, issue them for tasks, and return them.
*   **Admins** can manage the tool inventory, track stock levels, and view global issue records.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** React.js (v18+)
*   **Build Tool:** Vite (for ultra-fast development and bundling)
*   **Routing:** React Router DOM (for seamless page navigation)
*   **State Management:** React Context API + Local Storage (for data persistence across reloads)
*   **Styling:** Tailwind CSS / Custom CSS
*   **Data Layer:** Mock Data & LocalStorage CRUD operations

---

## ✨ Features Implemented

### 1. Authentication Module
*   **Mechanic Registration:** Collects Name, Email, Mobile Number, Password, Profile Picture, and Experience Level (*Expert, Medium, New Recruit, Trainee*).
*   **Dual Login System:** Dedicated access views for both Mechanics and Admins.
*   **Strict Form Validations:**
    *   *Email:* Format validation and uniqueness checks.
    *   *Mobile:* Fixed 10-digit validation and uniqueness checks.
    *   *Password:* Requires a mix of alphabets, numbers, and special characters (e.g., `Test@123`).

### 2. Admin Panel (Inventory Management)
*   **Add & Manage Tools:** Create new tool profiles with core attributes: *Tool Name, Category, Tool Image, Inventory Number, and Total Quantity*.
*   **Real-time Tracking:** Monitor global stock levels and immediate availability status.
*   **Pre-defined Categories:** Supports structured classifications like *Screwdrivers, Wrenches, Pliers, Hammers*, etc.

### 3. Mechanic Dashboard
*   **Browse Catalog:** View all tools currently available in the workshop.
*   **Issue Workflow:** Select and borrow tools for maintenance work (automatically updates inventory counts).
*   **Return Workflow:** Return currently held tools back to the inventory system.
*   **Issue History:** A personal activity log detailing past issued and returned items.

### 4. Global Issue Register
*   A centralized system log that keeps chronological records of all transaction loops (Who issued what, when, and if it has been returned).

---

## 📂 Project Folder Structure

The project follows a clean, modular architecture separating layout, logic, and state:

```text
src/
│
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI elements (Buttons, Inputs, Cards)
├── context/         # React Context files (Global State for Auth & Inventory)
├── data/            # Static mock data configurations
├── layouts/         # Shared page wrappers (Navbar, Sidebar layouts)
├── pages/           # Core view components (Login, Register, Dashboards)
├── routes/          # Client-side routing definitions (Protected routes)
├── utils/           # Helper functions (Validation logic, formatters)
├── App.jsx          # Root application component
└── main.jsx         # Application entry point
```

## 🔄 System Workflow
graph TD
    A[Step 1: Registration] --> B[Step 2: Login Admin/Mechanic]
    B --> C{User Role?}
    C -->|Admin| D[Step 3: Inventory Management - Add/Edit Tools]
    C -->|Mechanic| E[Step 4: Tool Issue - Check out tools]
    E --> F[Step 5: Tool Return - Check in tools]
    D --> G[Step 6: Central Issue Register - Global Logs]
    F --> G

*   Registration: Mechanics sign up with their profile data and skill level.
*   Login: Users authenticate into their specific dashboard experience.
*   Inventory Adjustment: Admin seeds or updates tool counts.
*   Tool Check-out: Mechanic issues a tool; available stock drops by 1.
*   Tool Check-in: Mechanic returns the tool; available stock increases by 1.
*   Audit Trail: The system logs every state change in the main register.

### 💻 Running the Project Locally
Follow these quick steps to get the development environment running on your local machine:

### 1. Clone the repository
```text
git clone <repository-url>
cd tools-issue-management
```
### 2. Install dependencies
```text
npm install
```
### 3. Start the development server
```text
npm run dev
```
The app should now be running smoothly at http://localhost:5173 (or the port specified in your terminal).

## 🔮 Future Enhancements
While built completely on the client side to meet frontend assignment requirements, the app is architected to scale into the following upgrades easily:

*   Full Backend integration utilizing Node.js & Express.
*   Persistent data warehousing using MongoDB.
*   Secure JWT (JSON Web Tokens) session tracking.
*   Strict backend Role-Based Access Control (RBAC).
*   Advanced global Search, multi-category Filtering, and sorting.
*   Data analytics dashboard visualizations for tool usage metrics.
*   Fully optimized responsive UI variants for mobile devices.

## 🧑‍💻 Author
Developed with ❤️ by Atul Kumar as a technical assignment submission for the Frontend Developer role.








