
/*******************************
*********QUIZ CONTROLLER********
*******************************/

var quizController = (function() {

    //*********Question Constructor*********/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection');
        }
    }
    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress = {
        questionIndex: 0
    };
    return {
        getQuizProgress: quizProgress,
        getQuestionLocalStorage: questionLocalStorage,
        addQuestionOnLocalStorage: function(newQuestText, opts) {

            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];

            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }


            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;

            } else {
                questionId = 0;
            }
            if(newQuestText.value !== "") {
                if(optionsArr.length > 1) {
                    if(isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestText.value = "";
                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;
                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options');
                    return false;
                }
            } else {
                alert('Please, Insert Question');

                return false;
            }
        },
        checkAnswer: function(ans) {
            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {

                return true;
            } else {

                return false;
            }
        }
    };

})();

/*******************************
**********UI CONTROLLER*********
*******************************/
var UIController = (function() {

    var domItems = {
        //*******Admin Panel Elements********/
        questInsertBtn: document.getElementById('question-insert-btn'), // 6
        newQuestionText: document.getElementById('new-question-text'), // 15
        adminOptions: document.querySelectorAll('.admin-option'), // 16
        adminOptionsContainer: document.querySelector(".admin-options-container"), // 65
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"), // 83
        questUpdateBtn: document.getElementById('question-update-btn'), // 133
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        //*******Quiz Section Elements*********/
        askedQuestText: document.getElementById('asked-question-text'), // 204
        quizoptionsWrapper: document.querySelector('.quiz-options-wrapper'), // 208
        progressBar: document.querySelector('progress'), // 219
        progressPar: document.getElementById('progress') // 222
    };

    return {
        getDomItems: domItems,
        addInputsDynamically: function() {
            var addInput = function() {

                var inputHTML, z;

                z = document.querySelectorAll(".admin-option").length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function(getQuestions) {
            var questHTML, numberingArr;

            numberingArr = [];

            domItems.insertedQuestsWrapper.innerHTML = "";
            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);
                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;
            if('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList = storageQuestList.getQuestionCollection();
                for(var i = 0; i < getStorageQuestList.length; i++) {
                    if(getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';
                for(var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="'+ foundItem.options[x] + '"></div>';
                }
                // 129
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';

                addInpsDynFn();

                var backDefaultView = function() {
                    // 185
                    var updatedOptions;

                     domItems.newQuestionText.value = '';
                     // 186
                     updatedOptions = document.querySelectorAll('.admin-option');
                     for(var i = 0; i < updatedOptions.length; i++) {
                         updatedOptions[i].value = '';
                         updatedOptions[i].previousElementSibling.checked = false;
                     }
                     // 172
                     domItems.questDeleteBtn.style.visibility = 'hidden';
                     // 173
                     domItems.questUpdateBtn.style.visibility = 'hidden';
                     domItems.questInsertBtn.style.visibility = 'visible';
                     domItems.questsClearBtn.style.pointerEvents = '';
                     updateQuestListFn(storageQuestList);
                }
                // 141
                var updateQuestion = function() {
                    var newOptions, optionEls;
                    newOptions = [];
                    optionEls = document.querySelectorAll('.admin-option');
                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';
                    for(var i = 0; i < optionEls.length; i++) {
                        if(optionEls[i].value !== '') {
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;
                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== '') {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                backDefaultView();
                            } else {
                                // 167
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                        // 163
                        } else
                        // 164
                        alert('You must insert at least two options');
                    // 160
                    } else {
                        // 161
                        alert('Please, insert question');
                    }

                }
                domItems.questUpdateBtn.onclick = updateQuestion;
                var deleteQuestion = function() {

                   getStorageQuestList.splice(placeInArr, 1);
                   storageQuestList.setQuestionCollection(getStorageQuestList);
                   backDefaultView();
                }
                domItems.questDeleteBtn.onclick = deleteQuestion;

            }

        },
        // 190
        clearQuestList: function(storageQuestList) {
            //199
            if(storageQuestList.getQuestionCollection() !== null) {

                if(storageQuestList.getQuestionCollection().length > 0) {
                    // 194
                    var conf = confirm('Warning! You will lose entire question list');

                    if(conf) {
                        // 197
                        storageQuestList.removeQuestionCollection();
                        // 198
                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },
        // 200
        displayQuestion: function(storageQuestList, progress) {
            // 211                         // 213
            var newOptionHTML, characterArr;
            // 214
            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if(storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizoptionsWrapper.innerHTML = '';
                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    // 212
                    newOptionHTML = '<div class="choice-' + i +'"><span class="choice-' + i +'">' + characterArr[i] + '</span><p  class="choice-' + i +'">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    // 215
                    domItems.quizoptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        displayProgress: function(storageQuestList, progress) {

            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
        }
    };

})();

/********************************
***********CONTROLLER*********
********************************/
// 3
var controller = (function(quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    selectedDomItems.questInsertBtn.addEventListener('click', function() {
        var adminOptions = document.querySelectorAll('.admin-option');
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        if(checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }

    });

    // 103
    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
        // 105                                                    // 131                        // 132
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);// 177
    });

    // 189
    selectedDomItems.questsClearBtn.addEventListener('click', function() {
        // 191
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });
    // 201
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    // 217
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    // 224
    selectedDomItems.quizoptionsWrapper.addEventListener('click', function(e) {

        var updatedOptionsDiv = selectedDomItems.quizoptionsWrapper.querySelectorAll('div');
        // 227
        for(var i = 0; i < updatedOptionsDiv.length; i++) {
            // 228
            if(e.target.className === 'choice-' + i) {

                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                // 232
                quizCtrl.checkAnswer(answer);
            }
        }
    });

})(quizController, UIController);
