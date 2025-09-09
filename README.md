# 🛡️ Ammunition Management System (DBMS Project)

A full-stack **DBMS-based web application** designed to **manage ammunition stock, distribution, and tracking**.  
Built using **Next.js + TypeScript + Tailwind (Frontend)** and **MySQL + Express (Backend)**.

---

## **📌 Project Overview**

The **Ammunition Management System** helps military or security organizations track:
- Total ammunition stock 📦
- Different ammo types (live, blank, FCC)
- Issuance of ammo to users/units
- Expiry dates and stock monitoring
- Reports and automated validations

This project includes:
- **Frontend:** A modern dashboard to view and manage inventory & issues.
- **Backend:** RESTful API built with **Express**.
- **Database:** MySQL relational database with optimized relationships.
- **Exception Handling:** Custom MySQL procedures, triggers, and SIGNAL-based validations.

---

## **🚀 Features**

### **1. Inventory Management**
- View, search, and sort stock records.
- Track lot numbers, stock dates, and expiry dates.
- Automatic **expired stock detection** with color-coded badges.
- Prevents **negative stock** using MySQL triggers and stored procedures.

### **2. Ammunition Types**
- Store and manage ammo categories (Rifle, LMG, HMG, Pistol).
- Handle multiple ammo classifications: **Live, Blank, FCC**.
- Junction table supports **mapping ammo to usage lines**.

### **3. Issue Management**
- Distribute ammunition to users or units.
- Prevent issuing more stock than available.
- Automatically deducts issued quantities from inventory.
- Tracks each issue against the correct lot and ammo type.

### **4. Real-Time Validations**
- MySQL **triggers + SIGNAL exceptions** ensure:
  - No negative stock.
  - Cannot issue expired ammo.
  - Prevents duplicate lots.
  - Ensures valid foreign key relationships.

### **5. Reporting**
- Monitor **available stock**, **issued stock**, and **remaining stock**.
- Quickly detect **low stock alerts**.
- Track ammo expiry dates at a glance.

---

## **🗄️ Database Schema**

### **Tables**
| Table | Description | Key Columns |
|--------|------------|-------------|
| **Ammunition** | Base stock info | rifle, lmg, hmg, pistol |
| **Ammo_type** | Live/Blank/FCC tracking | ammo_id, live, blank, fcc |
| **Line_type** | Usage classification | first_line, second_line, training |
| **Ammo_Type_Line** | Junction table linking ammo type + line | ammo_type_id, ammo_id, line_type_id |
| **Inventory** | Stock records by lot & expiry | user_id, quantity, lot_number, stock_date, expiry_date |
| **Issue** | Issued ammo tracking | inventory_stock_id, user_id, issue_date, issue_quantity, A_T_L_id |

### **Relationships**
- `Ammo_type.ammo_id → Ammunition.id`
- `Ammo_Type_Line.ammo_type_id → Ammo_type.id`
- `Ammo_Type_Line.ammo_id → Ammunition.id`
- `Ammo_Type_Line.line_type_id → Line_type.id`
- `Issue.inventory_stock_id → Inventory.id`

---

## **⚡ Tech Stack**

| Layer         | Technology |
|--------------|------------|
| **Frontend** | Next.js + TypeScript + TailwindCSS + shadcn/ui |
| **Backend**  | Express.js + Node.js |
| **Database** | MySQL (Triggers, Procedures, SIGNAL exceptions) |
| **API**      | RESTful endpoints |
| **Package Manager** | npm or yarn |

---

## **📂 Project Structure**


ammunition-management/
│── app/
│   ├── inventory/         # Inventory page
│   ├── issues/            # Issues page
│   ├── ammo-types/        # Ammo types dashboard
│   ├── line-types/        # Line types dashboard
│   ├── ammo-type-line/    # Junction table dashboard
│   ├── ammunition/        # Ammunition records
│── backend/
│   ├── server.js          # Express backend entry point
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic for API
│── database/
│   ├── schema.sql         # Table definitions
│   ├── procedures.sql     # Stored procedures
│   ├── triggers.sql       # Trigger-based validations
│── public/                # Static assets
│── .env.local             # Environment variables
│── package.json
│── README.md

````

---

## **🌐 API Endpoints**

### **Inventory**
```http
GET /api/inventory
````

**Returns:**

```json
[
  {
    "id": 1,
    "user_id": 5,
    "quantity": 500,
    "lot_number": "LOT-A1",
    "stock_date": "2025-01-05",
    "expiry_date": "2028-01-05"
  }
]
```

### **Issues**

```http
GET /api/issues
```

**Returns:**

```json
[
  {
    "id": 1,
    "inventory_stock_id": 2,
    "user_id": 5,
    "issue_date": "2025-02-01",
    "issue_quantity": 100,
    "A_T_L_id": 1
  }
]
```

---

## **⚠️ Exception Handling**

We use **MySQL SIGNAL** to throw custom exceptions. Examples:

### **Prevent issuing more than available**

```sql
IF v_qty < p_quantity THEN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Not enough stock available!';
END IF;
```

### **Prevent expired stock issuance**

```sql
IF p_issue_date > v_expiry THEN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Cannot issue from expired stock!';
END IF;
```

### **Prevent negative inventory**

```sql
IF NEW.quantity < 0 THEN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Inventory quantity cannot be negative!';
END IF;
```

---

## **⚙️ Setup Instructions**

### **1. Clone the Repo**

```bash
git clone https://github.com/your-username/ammunition-management.git
cd ammunition-management
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
```

### **3. Configure Environment**

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### **4. Run Backend**

```bash
cd backend
npm run start
```

### **5. Run Frontend**

```bash
npm run dev
```

Then visit: **[http://localhost:3000](http://localhost:3000)**

---

## **🎯 Future Enhancements**

* Add authentication & role-based access.
* Add downloadable PDF/Excel reports.
* Add email/SMS expiry alerts.
* Integrate charts for ammo usage trends.

---

## **👨‍💻 Author**

**Your Name**
DBMS Project — Ammunition Management System

```

---

If you want, I can also prepare a **complete visual project report** (PDF) with:  
- ER diagrams  
- Flowcharts  
- Schema diagrams  
- Screenshots  
- Triggers, functions, procedures  
- Working demo summary  

That’s often needed for DBMS **final submissions**.  

Do you want me to prepare that? It’ll make your project submission-ready.
```
