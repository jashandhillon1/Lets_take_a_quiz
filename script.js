
/*******************************
*********QUIZ CONTROLLER********
*******************************/

var quizController = (function() {

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

        removeQuestionCollectino: function() {
            localStorage.removeItem('questionColection');
        }
    }

    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    return {

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
        questDeleteBtn: document.getElementById('question-delete-btn') // 134
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
        editQuestList: function(event, storageQuestList, addInpsDynFn) {
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
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questUpdateBtn.style.visibility = 'visible';

                domItems.questInsertBtn.style.visibility = 'hidden';

                addInpsDynFn();
            }

        }
    };

})();

/*******************************
***********CONTROLLER***********
*******************************/
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

    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically);
    });

})(quizController, UIController);








/****************************
*******QUIZ CONTROLLER*******
****************************/


var quizController=(function(){
    //*******Question Constructor****
     function Question(id,questionText,options,correctAnswer){
        this.id=id;
        this.questionText=questionText;
        this.options=options;
        this.correctAnswer=correctAnswer;
     }


     var questionLocalStorage={
       setQuestionCollection:function(newCollection){
         localStorage.setItem('questionCollection',JSON.stringify(newCollection));

       },
       getQuestionCollection: function(){
         return JSON.parse(localStorage.getItem('questionCollection'));
       },
       removeQuestionCollection: function(){
         localStorage.removeItem('questionCollection');
       }
     };
     if(questionLocalStorage.getQuestionCollection()===null){
       questionLocalStorage.setQuestionCollection([]);
     }
     return {
       getQuestionCollectionLocalStorage:questionLocalStorage,
       addQuestionOnLocalStorage:function(newQuestText,opts){
         var optionsArr,corrAns,questionId,newQuestion,getStoredQuests,isChecked;
         if(questionLocalStorage.getQuestionCollection()===null){
           questionLocalStorage.setQuestionCollection([]);
         }
         optionsArr=[];
         isChecked=false;
         questionId=0;
         for(var i=0;i<opts.length;i++){
           if(opts[i].value!==""){
             optionsArr.push(opts[i].value);
           }
           if(opts[i].previousElementSibling.checked && opts[i].value !==""){
             corrAns=opts[i].value;
             isChecked=true;
           }

         }
         if(questionLocalStorage.getQuestionCollection().length>0){
           questionId=questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length-1].id+1;
         }
         else{
           questionId=0;
         }
         if(newQuestText.value!=""){
           if(optionsArr.length>1){
             if(isChecked){
               newQuestion=new Question(questionId,newQuestText.value,optionsArr,corrAns);
               getStoredQuests=questionLocalStorage.getQuestionCollection();
               getStoredQuests.push(newQuestion);
               questionLocalStorage.setQuestionCollection(getStoredQuests);
               newQuestText.value="";
               for(var x=0;x<opts.length;x++){
                 opts[x].value="";
                 opts[x].previousElementSibling.checked=false;
               }

               console.log(questionLocalStorage.getQuestionCollection());
               return true;
             }
             else{
               alert("You missed to check correct answer ");
               return false;
                 }
         }
         else{
             alert("You have to insert two options");
             return false;
           }
           
         }

       else{
         alert('Please, Insert Question');
         return false;

       }
     }
   };
})();
