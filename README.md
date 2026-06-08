# 🔖 LinkVault | Bookmark Manager

A modern bookmark manager that lets you save, organize, edit, delete, and reorder bookmarks with cloud synchronization powered by Google Sheets.

## ✨ Features

* Add bookmarks with name and URL
* Edit existing bookmarks
* Delete bookmarks with confirmation
* Cloud synchronization using Google Sheets
* Automatic favicon fetching
* Modern glassmorphism UI
* Responsive design
* Custom modal dialogs
* Loading screen with cloud sync status

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Google Apps Script
* Google Sheets API

## 📂 Project Structure

```text
LinkVault-bookmark-manager/
│
├── Bookmark.html
├── Bookmark.css
├── Bookmark.js
└── GoogleAppsScript.js
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Papia-tech/LinkVault.git
cd linkvault
```

### 2. Create Google Sheet

Create a Google Sheet with the following headers:

| Name | URL |
| ---- | --- |

### 3. Deploy Google Apps Script

1. Open Extensions → Apps Script.
2. Paste the Apps Script code.
3. Deploy as a Web App.
4. Set access to "Anyone".
5. Copy the Web App URL.

### 4. Configure the Project

In `Bookmark.js`, replace:

```javascript
const WEB_APP_URL = 'YOUR_WEB_APP_URL';
```

with your deployed Google Apps Script URL.

### 5. Run the Application

Open `Bookmark.html` in your browser.

## 📸 Preview

<img width="1792" height="1079" alt="image" src="https://github.com/user-attachments/assets/79070fdc-b240-43bb-97f6-c0752cc64a84" />


## 🌟 Future Improvements

* Search bookmarks
* Bookmark categories
* Dark/Light theme toggle
* User authentication
* Import/Export bookmarks
* Browser extension support

## Author

Made with <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Revolving%20Hearts.png" alt="Revolving Hearts" width="25" height="25" /> by Papia
