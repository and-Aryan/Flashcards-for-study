const boxx = document.getElementsByClassName("create-box")[0];
const flashcardsContainer = document.getElementsByClassName("flashcards")[0];
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const groupSelect = document.getElementById("group-select");

let cardArray = JSON.parse(localStorage.getItem('items')) || {};

// Create or get an existing group container
function createGroup(groupName) {
    let groupDiv = document.createElement("div");
    groupDiv.className = "flashcard-group";
    groupDiv.setAttribute("data-group", groupName);

    let groupTitle = document.createElement("h2");
    groupTitle.innerText = groupName;
    groupDiv.appendChild(groupTitle);

    flashcardsContainer.appendChild(groupDiv);
    return groupDiv;
}

// Get an existing group or create one if it doesn't exist
function getGroupDiv(groupName) {
    let existingGroup = document.querySelector(`.flashcard-group[data-group='${groupName}']`);
    return existingGroup || createGroup(groupName);
}

// Create or update a flashcard with multiple questions and answers under each group
function divMaker(cardData, groupName) {
    let groupDiv = getGroupDiv(groupName);

    // Check if the flashcard already exists, else create one
    let existingCard = groupDiv.querySelector('.flashcard');
    if (!existingCard) {
        existingCard = document.createElement("div");
        existingCard.className = 'flashcard';
        groupDiv.appendChild(existingCard);
    }

    // Create the question and answer list element inside the flashcard
    let questionList = existingCard.querySelector('.question-list');
    if (!questionList) {
        questionList = document.createElement("div");
        questionList.className = "question-list";
        existingCard.appendChild(questionList);
    }

    // Add the new questions and answers
    cardData.forEach(item => {
        let questionDiv = document.createElement("div");
        questionDiv.className = "question-item";
        questionDiv.innerHTML = `
            <strong>Question:</strong> ${item.myQuestion}<br>
            <strong>Answer:</strong> ${item.myAnswer}<br><br>
        `;
        questionList.appendChild(questionDiv);
    });
}

// Load flashcards from localStorage and display them (without duplication)
Object.keys(cardArray).forEach(group => {
    divMaker(cardArray[group], group);
});

// Add a new question to the selected group
function addCard() {
    let selectedGroup = groupSelect.value.trim();
    let questionText = question.value.trim();
    let answerText = answer.value.trim();

    if (!selectedGroup) {
        alert("Please select a group.");
        return;
    }
    if (!questionText || !answerText) {
        alert("Please enter both a question and an answer.");
        return;
    }

    let FlashObject = {
        'myQuestion': questionText,
        'myAnswer': answerText
    };

    // If the group doesn't exist, create it
    if (!cardArray[selectedGroup]) {
        cardArray[selectedGroup] = [];
    }

    // Add the new question to the existing flashcard (group)
    cardArray[selectedGroup].push(FlashObject);

    // Save the updated card array to localStorage
    localStorage.setItem('items', JSON.stringify(cardArray));

    // Update the group view with the new question
    divMaker([FlashObject], selectedGroup); // Pass only the new card data

    // Clear input fields
    question.value = '';
    answer.value = '';
}

// Delete all cards and clear storage
function delCard() {
    localStorage.removeItem('items');
    cardArray = {};
    flashcardsContainer.innerHTML = ''; // Clear all flashcards
}

// Show the create box
function hideBox() {
    boxx.style.display = 'none';
}

// Show the create box again
function newShown() {
    boxx.style.display = 'block';
}
