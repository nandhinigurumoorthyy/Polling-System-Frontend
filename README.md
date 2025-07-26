# Poll Management Frontend (React)

The Poll Management front-end interface for the Polling System Web App, where users can participate in polls and admins can manage them. Built using React.js and Tailwind CSS, it connects to a secure backend with JWT authentication.

---
## Deployed Links

- 👉 [Frontend Live URL](https://polling-system-ui.netlify.app/)
- 🌐 [Backend API](https://polling-system-backend-8q7m.onrender.com)
  
----

## GitHub Repositories

[Backend GitHub Repo](https://github.com/nandhinigurumoorthyy/Polling-System-Backend.git)

-----
## 🚀Features

### 🧑‍💼 **User Features**

* 🔐 **Authentication**: Secure login with JWT token-based authentication.
* 🗳️ **View Available Polls**:

  * Users can view all **public polls**.
  * Users can also access **private polls** they're invited to.
* ✅ **Voting**:

  * Users can vote on **active** polls only.
  * Real-time vote updates after submission.
  * Users can **view vote counts** during active polls.
  * After a poll expires, users can view **results** if they participated.
* ❌ Duplicate voting is **prevented**.
* 🧠 Smart handling of **token expiration** and **access restrictions**.

### 🛠️ **Admin Dashboard**

* ➕ **Create Polls**:

  * Set title, options, duration (up to 2 hours), visibility (public/private), and allowed users.
* 📝 **Edit Active Polls**:

  * Modify questions, options, or visibility (only before expiration).
* 🗑️ **Delete Polls**:

  * Fully remove polls created by the admin.
* 🔐 **Manage Poll Visibility**:

  * Choose between **public** (everyone can see) or **private** (only specific users can access).
* 📊 **View Statistics**:

  * Display total votes, option-wise breakdown, and poll status (active/expired).



### ⚠️ **Edge Case Handling**

* 🚫 Users can't vote on expired polls.
* 🔐 Private polls are restricted to selected users only.
* ✅ Validation of all input data: title, options, duration.
* 🔄 Front-end refreshes polls automatically after vote or edit.

---

## 🧰 Tech Stack

- React
- Axios
- React Router
- TailwindCSS
- Vite

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/nandhinigurumoorthyy/Polling-System-Frontend.git
cd Polling-System-Frontend
````

### 2. Install dependencies

```bash
npm install
```

---

## 🏃‍♂️ Run the App

```bash
npm run dev
```

---

## 🛠️ Folder Structure

```bash
src/
├── components/        # AdminDashboard, UserDashboard, Login, etc.
├── services/          # Axios API config
├── assets/            # Images and styles
├── App.jsx            # Main routing
└── main.jsx           # React root
```

---


## 🙋‍♂️ Authors

* [Nandhini](https://github.com/nandhinigurumoorthyy)
* Contributors welcome!
