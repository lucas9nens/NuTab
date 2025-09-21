// To-Do List

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("task-collection");
const taskComplete = false;

initWeeklyTracker();


inputBox.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (inputBox.value === '') {
      alert("You must write something!");
    } else {
      addTaskToDOM(inputBox.value);
    }
 
    inputBox.value = '';
    saveData();
  }
});

function addTaskToDOM(taskText) {
    let li = document.createElement("li");
    li.classList.add('task');

    let check = document.createElement("span");
    check.classList.add("check-circle");

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("task-text");
    input.value = taskText;
    input.id = "listItem";

    let remove = document.createElement("i");
    remove.classList.add("fa", "fa-remove");
    remove.style.color = "#8C8C8C";
    remove.hidden = true;

    
    input.addEventListener("focus", () => {
    remove.hidden = false;
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
        if (!li.contains(document.activeElement)) remove.hidden = true;
        saveData();
        }, 0);
    });

    remove.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        li.remove();
        saveData();
    });

    // save on blur or Enter inside task
    input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            input.blur();
        }
    });

    li.appendChild(check);
    li.appendChild(input);
    li.appendChild(remove);
    
    listContainer.appendChild(li);
};


listContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('check-circle')){
        const li = e.target.closest('li');

        e.target.classList.toggle("checked");
        setTaskDone();
        displayTracker();

        setTimeout(() => {
            li.remove();
            saveData();
        }, 1000);
    }
}, false);

function saveData() {
    let tasks = [];
    document.querySelectorAll("#task-collection li").forEach(li => {
        const input = li.querySelector(".task-text");
        tasks.push({ text: input.value });
        });
  localStorage.setItem("data", JSON.stringify(tasks));
}


function showTask() {
  let tasks = JSON.parse(localStorage.getItem("data")) || [];
  listContainer.innerHTML = "";

  tasks.forEach(task => {
    addTaskToDOM(task.text); 
  });
}

showTask(); 


// Settings exit/enter

document.querySelector('.settings-exit').addEventListener('click', function(e){
    document.getElementById('settings').setAttribute("hidden", "");
});

document.querySelector('.mini-button, .fa-gear').addEventListener('click', function(e){
    document.getElementById('settings').removeAttribute("hidden");
});

// Background code

const slot = document.querySelector(".slot");
const input = slot.querySelector('input[type="file"]');
const img = slot.querySelector("img");

window.addEventListener("load", () => {
    const savedImage = JSON.parse(localStorage.getItem("backgroundImage"));
    if (savedImage) {
        img.src = savedImage.base64Data;
        slot.classList.add("uploaded");
        setBackground(savedImage);
    }
});


// Background darkness

const rangeInput = document.getElementById('range4');
const rangeOutput = document.getElementById('rangeValue');

  // Set initial value
  rangeOutput.textContent = rangeInput.value;

  rangeInput.addEventListener('input', function() {
    rangeOutput.textContent = this.value;

    let stored = JSON.parse(localStorage.getItem("backgroundImage"));
    if (stored) {
        stored.darkness = this.value;
        localStorage.setItem("backgroundImage", JSON.stringify(stored));
    }
    setBackground();
});



input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const base64Data = e.target.result;

            img.src = base64Data;
            slot.classList.add("uploaded");

            let background = {base64Data: base64Data, darkness: rangeInput.value};

            localStorage.setItem("backgroundImage", JSON.stringify(background));


            setBackground();
        };

        reader.readAsDataURL(file);
    }
});

// setting background along with darkness levels
function setBackground() {
    const bg = document.querySelector(".background");
    const stored = JSON.parse(localStorage.getItem("backgroundImage"));
    
    if(stored) {
        bg.style.backgroundImage = `url(${stored.base64Data})`;
        bg.style.backgroundSize = "cover";
        bg.style.backgroundPosition = "center";
        bg.style.backgroundRepeat = "no-repeat";
        bg.style.filter = `brightness(${stored.darkness}%)`;
        img.style.filter = `brightness(${stored.darkness}%)`;
        rangeInput.value = stored.darkness;
        rangeOutput.textContent = stored.darkness;
    } else {
        bg.style.backgroundImage = 'none';
    }

}

slot.addEventListener("mouseenter", () => {
    if (slot.classList.contains("uploaded")) {
        slot.classList.add("delete-mode");
    }
});

slot.addEventListener("mouseleave", () => {
    slot.classList.remove("delete-mode");
});

slot.addEventListener("click", () => {
    if (slot.classList.contains("uploaded")) {
        img.src = "";
        slot.classList.remove("uploaded", "delete-mode");
        localStorage.removeItem("backgroundImage");
    }

    const bg = document.querySelector(".background");
    setBackground();
});






// My Sites

const siteName = document.getElementById('site-name');
const siteAddress = document.getElementById('site-address');
const addSite = document.getElementById('add-site')
const bookmarkContainer = document.getElementById('bookmarks')
const addedSiteContainer = document.getElementById('site-list-container');

function initBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

    if (!bookmarks) {
        bookmarks = [
            { name: "Gmail", url: "https://gmail.com" },
            { name: "Notion", url: "https://notion.com" },
            { name: "Calendar", url: "https://calendar.google.com" }
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }

    updateBookmarks();
}

function createBookmark(name, url) {
     if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    let newBookmark = { name, url };

    bookmarks.push(newBookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    updateBookmarks();
}

function updateBookmarks() {
    bookmarkContainer.innerHTML = ""; 
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.forEach((bookmark) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.href = bookmark.url;
        a.textContent = bookmark.name;
        a.target = "_blank";
        li.appendChild(a);
        bookmarkContainer.appendChild(li);
    });

    displayList();
}

function displayList(){
    addedSiteContainer.innerHTML = "";
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.forEach((bookmark, index) => {
        let li = document.createElement("li")
        li.textContent = `${bookmark.name}, ${bookmark.url}`;

        li.addEventListener("click", () => {
            bookmarks.splice(index, 1); // remove from array
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); // update storage
            displayList(); // re-render
            updateBookmarks();
        });


        addedSiteContainer.appendChild(li);
    });
}

initBookmarks();
updateBookmarks();

addSite.addEventListener('click', (e) => {
    e.preventDefault();

    if ((siteName.value === '') || (siteAddress.value === '')){
        alert("Error: Empty fields.")
    }
    else {
        createBookmark(siteName.value, siteAddress.value);
        siteName.value = '';
        siteAddress.value = '';
    }
});

// "Weekly task streak" code
let weekStreak = []
const deleteButton = document.getElementById("modalDelete");
let selectedIndex = null;
let tracker = JSON.parse(localStorage.getItem("weeklyTracker")) || [];

for(let i = 0; i < 7; i++){
    weekStreak.push(document.getElementById(`d${i}`)) 
}

weekStreak.forEach((weekTile, index) => {
    weekTile.addEventListener("mouseenter", () => {
        if (weekTile.classList.contains("active")) {
            weekTile.classList.add("delete-mode");
            
            weekTile.setAttribute("data-bs-toggle", "modal");
            weekTile.setAttribute("data-bs-target", "#exampleModal");

            selectedIndex = index;
        }
    });
    weekTile.addEventListener("mouseleave", () => {
        if (weekTile.classList.contains("delete-mode")) {
            weekTile.classList.remove("delete-mode");
            weekTile.classList.add("active");
        }
    });
});


deleteButton.addEventListener("click", () => {
    let trackerDates = JSON.parse(localStorage.getItem("weeklyTracker")) || [];
    if (selectedIndex != null){
        trackerDates.splice(selectedIndex, 1);
        localStorage.setItem("weeklyTracker", JSON.stringify(trackerDates));
        weekStreak[selectedIndex].classList.remove("active");
        selectedIndex = null;
        initWeeklyTracker();
        displayTracker();
    }
});



function getTodayDate(){
    return new Date().toISOString().slice(0,10);
}

function initWeeklyTracker(){
    const today = getTodayDate();
    let tracker = JSON.parse(localStorage.getItem("weeklyTracker")) || [];

    if (tracker.length === 0) {
        tracker.unshift({ date: today, done: false });
    } else {
    if (tracker[0].date !== today) {
        tracker.unshift({ date: today, done: false });
        }
    }

    localStorage.setItem("weeklyTracker", JSON.stringify(tracker));
}

function setTaskDone() {
  let tracker = JSON.parse(localStorage.getItem("weeklyTracker")) || [];
  const today = getTodayDate();

    if (tracker.length > 0 && tracker[0].date === today) {
        tracker[0].done = true;  
    }

  localStorage.setItem("weeklyTracker", JSON.stringify(tracker));
}

function displayTracker(){
    let tracker = JSON.parse(localStorage.getItem("weeklyTracker")) || [];
    for(let i = 0; i < tracker.length; i++){
        if(tracker[i].done){
            weekStreak[i].classList.add("active");
            weekStreak[i].setAttribute("data-bs-toggle", "modal");
            weekStreak[i].setAttribute("data-bs-target", "#exampleModal");
        }
        else{
            weekStreak[i].classList.remove("active")
        }
    }
}

displayTracker();

// The dynamic delete modal


function deleteItem(item, storageID){
    
}


