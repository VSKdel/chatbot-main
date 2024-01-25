const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const menuButton = document.querySelector(".menu-btn");
const studentResultButton = document.querySelector(".student-result-btn");

let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;
let schoolId = null; // Variable to store the school ID

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

menuButton.addEventListener("click", () => {
    userMessage = "Menu";
    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);

    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);

    setTimeout(() => {
        generateResponse(incomingChatLi);
    }, 600);
});

// Event listener for the "Student Result" button
studentResultButton.addEventListener("click", () => {
    userMessage = "Student Result";
    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);

    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);

    setTimeout(() => {
        generateResponse(incomingChatLi);
    }, 600);
});

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    if (userMessage.toLowerCase() === "menu") {
        // If the user selected "Menu," display the menu options with buttons
        const menuOptions = ["Student Result", "Other Option"];
        messageElement.textContent = "Please choose an option:";
        messageElement.appendChild(createButtons(menuOptions));




    } else if (userMessage.toLowerCase() === "student result") {
        // If the user selected "Student Result," ask for School ID
        askForSchoolId();
        chatElement.remove(); // Remove the "Thinking..." message
    } else if (chatElement.classList.contains("waiting-for-school-id")) {
        // If waiting for School ID, store the School ID and ask for Student ID
        const studentIdMessage = createChatLi("Please enter your Student ID:", "incoming");
        studentIdMessage.classList.add("waiting-for-student-id");
        chatbox.appendChild(studentIdMessage);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        chatElement.remove(); // Remove the "Thinking..." message
    } else if (chatElement.classList.contains("waiting-for-student-id")) {
        // If waiting for Student ID, store the Student ID and make the API call
        const studentId = userMessage;
        makeApiCall(schoolId, studentId, messageElement);
        chatElement.remove(); // Remove the "Thinking..." message
    } else {
        // Default behavior: echo the user's message
        messageElement.textContent = userMessage;
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
}

const createButtons = (options) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.style.marginTop = "7px";
        button.style.padding = "4px";

        // Add a line break after each button
        const lineBreak = document.createElement("br");

        button.addEventListener("click", () => handleButtonClick(option));
        buttonContainer.appendChild(button);

        // Append the line break after the button
        buttonContainer.appendChild(lineBreak);
    });

    return buttonContainer;
}

const handleButtonClick = (option) => {
    userMessage = option;
    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);

    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);

    setTimeout(() => {
        generateResponse(incomingChatLi);
    }, 600);
}

const askForSchoolId = () => {

    const schoolIdMessage = createChatLi("Please enter your School ID:", "incoming");
    schoolIdMessage.classList.add("waiting-for-school-id");
    chatbox.appendChild(schoolIdMessage);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Modify this part to automatically store the School ID
    const schoolIdInput = document.createElement("input");
    schoolIdInput.type = "text";
    schoolIdInput.style.marginLeft = '42px'
    schoolIdInput.addEventListener("input", (e) => {
        // Store the entered School ID in the variable
        schoolId = e.target.value.trim();
    });

    const sendSchoolIdBtn = document.createElement("button");
    sendSchoolIdBtn.textContent = "Send";
    sendSchoolIdBtn.addEventListener("click", () => {
        // Remove the input and button elements
        schoolIdInput.remove();
        sendSchoolIdBtn.remove();
        // Ask for the Student ID
        askForStudentId();
    });

    chatbox.appendChild(schoolIdInput);
    chatbox.appendChild(sendSchoolIdBtn);
}

let studentId = null; // Variable to store the student ID

const askForStudentId = (schoolIdInput) => {
    // Display the entered School ID message
    const enteredSchoolIdMessage = createChatLi(`School ID: ${schoolId}`, "outgoing");
    chatbox.appendChild(enteredSchoolIdMessage);

    // Ask for the Student ID using the same input box as the School ID
    const studentIdMessage = createChatLi("Please enter your Student ID:", "incoming");
    studentIdMessage.classList.add("waiting-for-student-id");
    chatbox.appendChild(studentIdMessage);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Update the placeholder and clear the previous input
    // schoolIdInput.placeholder = "Enter Student ID";
    // schoolIdInput.value = "";

    const studentIdInput = document.createElement("input");
    studentIdInput.type = "text";
    studentIdInput.style.marginLeft = '42px'
    // studentIdInput.addEventListener("input", (e) => {
    //     // Store the entered School ID in the variable
    //     schoolId = e.target.value.trim();
    // });


    const sendStudentIdBtn = document.createElement("button");
    sendStudentIdBtn.textContent = "Send";
    sendStudentIdBtn.addEventListener("click", () => {
        // Store the entered Student ID in the variable
        studentId = studentIdInput.value.trim();

        // Remove the button element
        studentIdInput.remove();
        sendStudentIdBtn.remove();

        const enteredstudentIdMessage = createChatLi(`Student ID: ${studentId}`, "outgoing");
        chatbox.appendChild(enteredstudentIdMessage);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Make the API call with both School ID and Student ID
        makeApiCall(schoolId, studentId, studentIdMessage.querySelector("p"));
    });

    chatbox.appendChild(studentIdInput);
    chatbox.appendChild(sendStudentIdBtn);
}


const makeApiCall = async (schoolId, studentId, messageElement) => {


    // Replace the following URL and parameters with the actual API endpoint and parameters

    const API_URL = `http://localhost:3001/api/school?schoolId=${schoolId}`;

    const requestOptions = {
        method: "GET",
    };

    try {
        // Send GET request to API, get response, and display the result
        const response = await fetch(API_URL, requestOptions);

        const data = await response.json();
        // console.log("API Response:", data);


        function getColumn1ByStudentId(studentId) {
            const entry = data.Cargo.find(item => item.studentid == studentId);
            return entry ? entry : null;
        }
        
        const studentIdToLookup = studentId;
        const studentdata = getColumn1ByStudentId(studentIdToLookup);

        if (studentdata !== null) {
            studentApiCall(schoolId, studentId, messageElement);
            // const resultMessage = createChatLi(`Class: ${studentdata.Class + '\n' + 'Year: ' + studentdata.Year + '\n' + 'Result: ' + studentdata.Column1}`, "outgoing");
            // chatbox.appendChild(resultMessage);
            // const menuOption = ["Student Result", "Other Option", "Another Option"];
            // chatbox.appendChild(createChatLi("Any more questions?"));
            // chatbox.appendChild(createButtons(menuOption));
        } else {
            const resultMessage = createChatLi(`Studentid ${studentIdToLookup} not found in the data.`, "outgoing");
            chatbox.appendChild(resultMessage);
            askForStudentId();
        }


        // Display the API response in the chatbox
        // messageElement.textContent = `Result: ${column1Value}`;

    } catch (error) {
        // Display an error message if the API call fails
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////

const studentApiCall = async (schoolId, studentId, messageElement) => {
    // Replace the following URL and parameters with the actual API endpoint and parameters

    // const API_URL = `http://localhost:3001/api/student?`;
    const API_URL = `http://localhost:3001/api/student?&studentId=${studentId}`;

    const requestOptions = {
        method: "GET",
    };

    try {
        // Send GET request to API, get response, and display the result
        const response = await fetch(API_URL, requestOptions);

        const studentdata = await response.json();
        // console.log(" Student API Response:", studentdata.Cargo[0]);
        if (studentdata !== null) {
            const resultMessage = createTableChatLi(studentdata.Cargo[0]);
            // const resultMessage = createChatLi(`Class: ${studentdata.Cargo[0].class_desc + '\n' + 'Session: ' + studentdata.Cargo[0].session + '\n' + 'Result: ' + studentdata.Cargo[0].Result + '\n' + studentdata.Cargo[0].Sub1 + studentdata.Cargo[0].Total1 + '\n' + studentdata.Cargo[0].Sub2 + studentdata.Cargo[0].Total2 + '\n' + studentdata.Cargo[0].Sub3 + studentdata.Cargo[0].Total3 + '\n' + studentdata.Cargo[0].Sub4 + studentdata.Cargo[0].Total4 + '\n' + studentdata.Cargo[0].Sub5 + studentdata.Cargo[0].Total5}`, "outgoing");
            chatbox.appendChild(resultMessage);
            const menuOption = ["Student Result", "Other Option"];
            chatbox.appendChild(createChatLi("Any more questions?"));
            chatbox.appendChild(createButtons(menuOption));
        } else {
            const resultMessage = createChatLi(`Studentid ${studentIdToLookup} not found in the data.`, "outgoing");
            chatbox.appendChild(resultMessage);
            askForStudentId();

            
        }

    } catch (error) {
        // Display an error message if the API call fails
        messageElement.classList.add("error");
        messageElement.textContent = " student   gegOops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};



const createTableChatLi = (data) => {
    const tableChatLi = document.createElement("li");
    tableChatLi.classList.add("chat", "outgoing");

    const tableContent = document.createElement("table");

    // Add rows for studentid, session, class_desc, Result, and Grand_Total
    const headerRows = ['Subject','Total'];
    
    const tableHeader=document.createElement("th");
    tableHeader.textContent="StudentId: "+data.studentid;
    tableContent.appendChild(tableHeader)

    try{
        const headerRow=document.createElement("tr");
    headerRows.forEach((header)=>{
        const headTd=document.createElement("td");
        headTd.textContent=header;
        headerRow.appendChild(headTd);
    })

    tableContent.appendChild(headerRow)

    }catch(error){
        console.log(error)
    }
    
    

    const tableBody = document.createElement("tbody");

    // Filter out keys that start with "Sub" and have non-null values
    const nonNullSubKeys = Object.keys(data)
        .filter((key) => key.startsWith("Sub") && data[key] !== null);

    let totalMarks=0;

    nonNullSubKeys.forEach((subKey) => {
        const totalKey = `Total${subKey.slice(3)}`;

        const row = document.createElement("tr");

        const subCell = document.createElement("td");
        subCell.textContent = data[subKey];

        const totalCell = document.createElement("td");
        totalCell.textContent = data[totalKey];
        totalMarks+=data[totalKey]
        row.appendChild(subCell);
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });

    
    
    tableContent.appendChild(tableBody);
    tableChatLi.appendChild(tableContent);


    const TotalMarksRow=document.createElement("tr");
    const TotalMarksTd1=document.createElement("td");
    const TotalMarksTd2=document.createElement("td");
    TotalMarksTd1.textContent="Grand Total";
    TotalMarksTd2.textContent=totalMarks;
    TotalMarksRow.appendChild(TotalMarksTd1);
    TotalMarksRow.appendChild(TotalMarksTd2);
    tableContent.appendChild(TotalMarksRow);



    return tableChatLi;
};





////////////////////////////////////////////////////////////////////////////////////////////////////




const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
