// ===============================
// DATA
// ===============================

const STORAGE_KEY = "ultimate_quiz_questions";

let questions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
{
    question: "Manakah bahasa pemrograman yang sering digunakan untuk AI?",
    options: ["Assembly","Python","Machine Code","Cobol"],
    answer: 1
},
{
    question: "Siapa penemu World Wide Web?",
    options: ["Bill Gates","Steve Jobs","Tim Berners-Lee","Elon Musk"],
    answer: 2
}
];

let currentQuestion = 0;
let userAnswers = [];
let reviewMode = false;
let quizFinished = false;
let editIndex = null;



// ===============================
// SAVE LOCAL STORAGE
// ===============================

function saveToStorage(){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(questions)
    );
}

// ===============================
// TAB NAVIGATION
// ===============================

document.querySelectorAll("nav a").forEach(link=>{

    link.addEventListener("click",(e)=>{

        e.preventDefault();

        document
        .querySelectorAll("nav a")
        .forEach(a=>a.classList.remove("active"));

        document
        .querySelectorAll(".container")
        .forEach(c=>c.classList.remove("active"));

        link.classList.add("active");

        document
        .getElementById(link.dataset.tab)
        .classList.add("active");

        if(link.dataset.tab === "manager"){
            renderQuestionList();
        }

    });

});

// ===============================
// LOAD QUESTION
// ===============================

function loadQuestion(){

    if(questions.length === 0){

        document.getElementById("questionText")
        .innerText = "Belum ada soal.";

        document.getElementById("optionsContainer")
        .innerHTML = "";

        document.getElementById("navDots")
        .innerHTML = "";

        return;
    }

    const q = questions[currentQuestion];

    document.getElementById(
        "questionCounter"
    ).innerText =
    `Question ${currentQuestion+1} of ${questions.length}`;

    document.getElementById(
        "questionText"
    ).innerText = q.question;

    let html = "";

    q.options.forEach((option,index)=>{

    let className = "option-btn";

    if(userAnswers[currentQuestion] === index){
        className += " selected";
    }

    if(reviewMode){

    if(index === q.answer){
        className += " correct-answer";
    }

    if(
        userAnswers[currentQuestion] === index &&
        index !== q.answer
    ){
        className += " wrong-answer";
    }

}

    html += `
    <button
    class="${className}"
    onclick="selectAnswer(${index})">

    ${String.fromCharCode(65+index)}.
    ${option}

    ${
    reviewMode && index === q.answer
    ? ' ✅'
    : ''
    }

    ${
    reviewMode &&
    userAnswers[currentQuestion] === index &&
    index !== q.answer
    ? ' ❌'
    : ''
    }

    </button>
    `;

});

    document.getElementById(
        "optionsContainer"
    ).innerHTML = html;

    renderDots();
    updateProgress();
}

// ===============================
// ANSWER
// ===============================

function selectAnswer(index){

    if(quizFinished){
        return;
    }

    userAnswers[currentQuestion] = index;

    loadQuestion();

}

// ===============================
// NAVIGATION
// ===============================

document.getElementById("nextBtn")
.addEventListener("click",()=>{

    if(currentQuestion < questions.length-1){

        currentQuestion++;

        loadQuestion();

    }

});

document.getElementById("prevBtn")
.addEventListener("click",()=>{

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();

    }

});

// ===============================
// DOTS
// ===============================

function renderDots(){

    let html = "";

    questions.forEach((q,index)=>{

        let classes = "dot";

        if(index === currentQuestion){
            classes += " active";
        }

        if(userAnswers[index] !== undefined){
            classes += " answered";
        }

        if(reviewMode){

        if(userAnswers[index] === q.answer){

            classes += " correct";

        }else{

            classes += " wrong";

        }

}

        html += `
        <div
        class="${classes}"
        onclick="jumpQuestion(${index})">

        ${index+1}

        </div>
        `;

    });

    document.getElementById("navDots").innerHTML = html;

}

function jumpQuestion(index){

    currentQuestion = index;

    loadQuestion();

}

// ===============================
// PROGRESS BAR
// ===============================

function updateProgress(){

    const percent =
    ((currentQuestion+1)
    / questions.length) * 100;

    document.getElementById(
        "progressBar"
    ).style.width = percent + "%";

}

// ===============================
// FINISH QUIZ
// ===============================

document
.getElementById("finishBtn")
.addEventListener("click",finishQuiz);

function finishQuiz(){

    reviewMode = true;

    let benar = 0;
    let salah = 0;

    questions.forEach((q,index)=>{

        if(userAnswers[index] === q.answer){

            benar++;

        }else{

            salah++;

        }

    });

    let nilai = Math.round(
        (benar / questions.length) * 100
    );

    document.getElementById("resultBox").innerHTML = `

    <div class="result-card">

        <h3>📖 Mode Review</h3>

        <div class="result-item">
            ✅ Benar : <b>${benar}</b>
        </div>

        <div class="result-item">
            ❌ Salah : <b>${salah}</b>
        </div>

        <div class="result-item">
            📊 Nilai Saat Ini : <b>${nilai}</b>
        </div>

        <div class="result-item">
            Anda masih bisa mengubah jawaban.
        </div>

        <button
        class="btn btn-primary"
        style="margin-top:10px;width:100%;"
        onclick="submitFinalQuiz()">

        Submit Final

        </button>

    </div>

    `;

    renderDots();
    loadQuestion();

}

function submitFinalQuiz(){

    if(
        !confirm(
            "Setelah Submit Final, jawaban tidak dapat diubah lagi. Lanjutkan?"
        )
    ){
        return;
    }

    quizFinished = true;

    alert(
        "Quiz berhasil disubmit."
    );

}

// ===============================
// TIMER
// ===============================

setInterval(()=>{

    let minutes =
    Math.floor(timeLeft / 60);

    let seconds =
    timeLeft % 60;

    document.getElementById(
        "timer"
    ).innerText =
    `⏱ ${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    if(timeLeft > 0){

        timeLeft--;

    }

},1000);

// ===============================
// ADD / EDIT QUESTION
// ===============================

document
.getElementById("saveQuestionBtn")
.addEventListener("click",saveQuestion);

function saveQuestion(){

    const question =
    document.getElementById("questionInput").value;

    const a =
    document.getElementById("optionA").value;

    const b =
    document.getElementById("optionB").value;

    const c =
    document.getElementById("optionC").value;

    const d =
    document.getElementById("optionD").value;

    const answer =
    Number(
        document.getElementById(
            "correctAnswer"
        ).value
    );

    if(
        !question ||
        !a ||
        !b ||
        !c ||
        !d
    ){

        alert("Lengkapi semua data.");

        return;

    }

    const data = {

        question,

        options:[a,b,c,d],

        answer

    };

    if(editIndex === null){

        questions.push(data);

    }else{

        questions[editIndex] = data;

        editIndex = null;

        document
        .getElementById("designerTitle")
        .innerText =
        "Add New Question";

        document
        .getElementById("cancelEditBtn")
        .classList.add("hidden");

    }

    saveToStorage();

    clearForm();

    renderQuestionList();

    loadQuestion();

    alert("Soal berhasil disimpan.");

}

// ===============================
// CLEAR FORM
// ===============================

function clearForm(){

    document.getElementById(
        "questionInput"
    ).value = "";

    document.getElementById(
        "optionA"
    ).value = "";

    document.getElementById(
        "optionB"
    ).value = "";

    document.getElementById(
        "optionC"
    ).value = "";

    document.getElementById(
        "optionD"
    ).value = "";

}

// ===============================
// QUESTION LIST
// ===============================

function renderQuestionList(){

    let html = "";

    questions.forEach((q,index)=>{

        html += `

        <div class="list-item">

            <div class="list-question">

                <b>${index+1}.</b>

                ${q.question}

            </div>

            <div class="list-actions">

                <button
                class="btn btn-outline"
                onclick="editQuestion(${index})">

                Edit

                </button>

                <button
                class="btn btn-danger"
                onclick="deleteQuestion(${index})">

                Delete

                </button>

            </div>

        </div>

        `;

    });

    document.getElementById(
        "questionList"
    ).innerHTML = html;

}

// ===============================
// EDIT
// ===============================

function editQuestion(index){

    const q = questions[index];

    editIndex = index;

    document
    .getElementById("designerTitle")
    .innerText =
    "Edit Question";

    document
    .getElementById("questionInput")
    .value = q.question;

    document
    .getElementById("optionA")
    .value = q.options[0];

    document
    .getElementById("optionB")
    .value = q.options[1];

    document
    .getElementById("optionC")
    .value = q.options[2];

    document
    .getElementById("optionD")
    .value = q.options[3];

    document
    .getElementById("correctAnswer")
    .value = q.answer;

    document
    .getElementById("cancelEditBtn")
    .classList.remove("hidden");

    document
    .querySelector('[data-tab="designer"]')
    .click();

}

// ===============================
// CANCEL EDIT
// ===============================

document
.getElementById("cancelEditBtn")
.addEventListener("click",()=>{

    editIndex = null;

    clearForm();

    document
    .getElementById("designerTitle")
    .innerText =
    "Add New Question";

    document
    .getElementById("cancelEditBtn")
    .classList.add("hidden");

});

// ===============================
// DELETE
// ===============================

function deleteQuestion(index){

    if(
        !confirm(
            "Hapus soal ini?"
        )
    ) return;

    questions.splice(index,1);

    saveToStorage();

    if(currentQuestion >= questions.length){

        currentQuestion =
        Math.max(
            0,
            questions.length - 1
        );

    }

    renderQuestionList();

    loadQuestion();

}

// ===============================
// DELETE ALL
// ===============================

document
.getElementById("deleteAllBtn")
.addEventListener("click",()=>{

    if(
        !confirm(
            "Hapus semua soal?"
        )
    ) return;

    questions = [];

    userAnswers = [];

    saveToStorage();

    renderQuestionList();

    loadQuestion();

});

// ===============================
// EXPORT JSON
// ===============================

document
.getElementById("exportBtn")
.addEventListener("click",()=>{

    const blob =
    new Blob(
        [
            JSON.stringify(
                questions,
                null,
                2
            )
        ],
        {
            type:"application/json"
        }
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "questions.json";

    a.click();

});

// ===============================
// IMPORT JSON
// ===============================

document
.getElementById("importFile")
.addEventListener("change",(e)=>{

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(){

        try{

            questions =
            JSON.parse(
                reader.result
            );

            saveToStorage();

            renderQuestionList();

            loadQuestion();

            alert(
                "Import berhasil."
            );

        }catch{

            alert(
                "File JSON tidak valid."
            );

        }

    };

    reader.readAsText(file);

});

// ===============================
// INIT
// ===============================

renderQuestionList();
loadQuestion();