// paste your copied Web App URL inside the single quotes below:
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz5vP9bzV9dEFI82Rdlj-7Y9_vgVJjsjpiZ6jntTEET6ZcHeguhVYjWvztfoS6fVpG9/exec';

// Get DOM elements
const nameInput = document.getElementById("bookmark_name");
const urlInput = document.getElementById("bookmark_url");
const addBtn = document.getElementById("add_bookmark");
const bookmarkList = document.getElementById("bookmark_list");

// Modal DOM elements
const mainContainer = document.getElementById("add_container");
const modalOverlay = document.getElementById("modal_overlay");
const modalIcon = document.getElementById("modal_icon");
const modalMessage = document.getElementById("modal_message");
const modalCancelBtn = document.getElementById("modal_cancel_btn");
const modalConfirmBtn = document.getElementById("modal_confirm_btn");

// Modal Edit DOM Form bindings
const modalEditInputs = document.getElementById("modal_edit_inputs");
const editNameInput = document.getElementById("edit_bookmark_name");
const editUrlInput = document.getElementById("edit_bookmark_url");

// Array to hold bookmarks
let bookmarks = [];

// Load bookmarks from Google Sheets Database when page displays
window.onload = () => {
  fetchBookmarksFromCloud();
};

// Function to fetch all bookmarks from your Google Sheet
function fetchBookmarksFromCloud() {
  const loadingScreen = document.getElementById("app_loading_screen");
  
  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
      bookmarks = data;
      renderBookmarks();
      
      // Smoothly dismiss the loading layer once data is successfully mounted
      if (loadingScreen) {
        loadingScreen.classList.add("fade_away");
      }
    })
    .catch(err => {
      console.error("Error loading cloud database:", err);
      // If a network connection error occurs, transform loader text to alert the user
      const loaderText = document.querySelector(".loading_text");
      if (loaderText) {
        loaderText.textContent = "Failed to sync with cloud database.";
        loaderText.style.color = "#f87171";
      }
      bookmarkList.innerHTML = `<div style="text-align:center;color:#f87171;font-size:14px;padding:20px;">Failed to sync with cloud.</div>`;
    });
}

// Reusable Focused Central Modal Controller
function openCustomModal({ message, type = "error", showCancel = false, isEdit = false, defaultName = "", defaultUrl = "", onConfirm }) {
  modalMessage.textContent = message;
  
  // Choose icon styles based on context state
  if (type === "delete") {
    modalIcon.textContent = "delete_sweep";
    modalIcon.style.color = "#f87171";
  } else if (type === "edit") {
    modalIcon.textContent = "edit_note";
    modalIcon.style.color = "#a855f7";
  } else {
    modalIcon.textContent = "error_outline";
    modalIcon.style.color = "#6366f1";
  }

  // Handle Edit Field Visibility
  if (isEdit) {
    modalEditInputs.style.display = "flex";
    editNameInput.value = defaultName;
    editUrlInput.value = defaultUrl;
  } else {
    modalEditInputs.style.display = "none";
  }

  modalCancelBtn.style.display = showCancel ? "inline-block" : "none";
  mainContainer.classList.add("blur_active");
  modalOverlay.classList.remove("modal_hidden");

  const freshConfirm = () => {
    if (isEdit) {
      const updatedName = editNameInput.value.trim();
      let updatedUrl = editUrlInput.value.trim();

      if (updatedName === "" || updatedUrl === "") {
        alert("Fields cannot be blank.");
        return;
      }
      if (!/^https?:\/\//i.test(updatedUrl)) {
        updatedUrl = 'https://' + updatedUrl;
      }
      
      closeCustomModal();
      if (onConfirm) onConfirm(updatedName, updatedUrl);
      cleanupListeners();
    } else {
      closeCustomModal();
      if (onConfirm) onConfirm();
      cleanupListeners();
    }
  };

  const freshCancel = () => {
    closeCustomModal();
    cleanupListeners();
  };

  function cleanupListeners() {
    modalConfirmBtn.removeEventListener("click", freshConfirm);
    modalCancelBtn.removeEventListener("click", freshCancel);
  }

  modalConfirmBtn.addEventListener("click", freshConfirm);
  modalCancelBtn.addEventListener("click", freshCancel);
}

function closeCustomModal() {
  mainContainer.classList.remove("blur_active");
  modalOverlay.classList.add("modal_hidden");
  modalEditInputs.style.display = "none"; // Reset edit inputs container state
}

// Add bookmark on button click
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  let url = urlInput.value.trim();

  if (name === "" || url === "") {
    openCustomModal({
      message: "Please enter both name and URL.",
      type: "error",
      showCancel: false
    });
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  addBtn.disabled = true;
  addBtn.textContent = "Saving...";

  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", name: name, url: url })
  })
  .then(() => {
    bookmarks.push({ name, url });
    renderBookmarks();
    nameInput.value = "";
    urlInput.value = "";
  })
  .catch(err => console.error("Database save error:", err))
  .finally(() => {
    addBtn.disabled = false;
    addBtn.textContent = "Add Bookmark";
  });
});

// Render bookmarks
function renderBookmarks() {
  bookmarkList.innerHTML = ""; 

  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = `<div style="text-align:center;color:#64748b;font-size:14px;padding:20px;">No bookmarks saved yet.</div>`;
    return;
  }

  bookmarks.forEach((bookmark, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.dataset.index = index;

    const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${bookmark.url}`;

    li.innerHTML = `
      <div class="bookmark_link_wrapper">
        <img class="bookmark_icon" src="${faviconUrl}" alt="" onerror="this.src='global';this.style.opacity=0.5;">
        <a href="${bookmark.url}" target="_blank" title="${bookmark.name}">${bookmark.name}</a>
      </div>
      <div style="display: flex; align-items: center;">
        <button class="edit_bookmark" data-index="${index}" title="Edit Bookmark">
          <span class="material-icons-outlined" style="font-size: 18px;">edit</span>
        </button>
        <button class="remove_bookmark" data-index="${index}" title="Delete Bookmark">
          <span class="material-icons-outlined" style="font-size: 18px;">delete</span>
        </button>
      </div>
    `;

    bookmarkList.appendChild(li);
  });

  // Edit Button Event Listener Integration Setup
  document.querySelectorAll(".edit_bookmark").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const btnElement = e.target.closest('.edit_bookmark');
      const index = Number(btnElement.getAttribute("data-index"));
      const currentItem = bookmarks[index];

      openCustomModal({
        message: "Update your bookmark details:",
        type: "edit",
        showCancel: true,
        isEdit: true,
        defaultName: currentItem.name,
        defaultUrl: currentItem.url,
        onConfirm: (newName, newUrl) => {
          // Mutate local array data schema values inline
          bookmarks[index] = { name: newName, url: newUrl };
          renderBookmarks();

          // Flash update collection data to the Google Sheets database rows
          syncFullCollectionToCloud();
        }
      });
    });
  });

  // Remove button functionality with cloud sync deletion pipeline
  document.querySelectorAll(".remove_bookmark").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const btnElement = e.target.closest('.remove_bookmark');
      const index = Number(btnElement.getAttribute("data-index"));
      
      openCustomModal({
        message: `Are you sure you want to delete "${bookmarks[index].name}"?`,
        type: "delete",
        showCancel: true,
        onConfirm: () => {
          bookmarks.splice(index, 1);
          renderBookmarks();
          syncFullCollectionToCloud();
        }
      });
    });
  });

  initDragAndDrop(); 
}

// Rewrites the Google Sheet whenever structural drops or deletes happen
function syncFullCollectionToCloud() {
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sync", fullData: bookmarks })
  }).catch(err => console.error("Cloud synchronization mismatch error:", err));
}

// Drag-and-drop functionality
function initDragAndDrop() {
  let draggedIndex = null;
  const items = bookmarkList.querySelectorAll("li");

  items.forEach(item => {
    item.addEventListener("dragstart", (e) => {
      draggedIndex = Number(e.currentTarget.dataset.index);
      e.currentTarget.classList.add("dragging");
    });

    item.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("dragging");
    });
  });

  bookmarkList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(bookmarkList, e.clientY);
    const dragging = document.querySelector(".dragging");
    if (!afterElement) {
      bookmarkList.appendChild(dragging);
    } else {
      bookmarkList.insertBefore(dragging, afterElement);
    }
  });

  bookmarkList.addEventListener("drop", () => {
    const dragging = document.querySelector(".dragging");
    if (!dragging) return;
    
    dragging.classList.remove("dragging");
    const newIndex = Array.from(bookmarkList.children).indexOf(dragging);

    if (newIndex !== draggedIndex && draggedIndex !== null) {
      const moved = bookmarks.splice(draggedIndex, 1)[0];
      bookmarks.splice(newIndex, 0, moved);
      renderBookmarks(); 
      syncFullCollectionToCloud();
    }

    draggedIndex = null;
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return (offset < 0 && offset > closest.offset)
      ? { offset, element: child }
      : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}