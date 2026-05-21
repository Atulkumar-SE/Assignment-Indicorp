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