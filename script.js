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
     return {
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
             }
             else{
               alert("You missed to check correct answer ");
                 }
         }
         else{
             alert("You have to insert two options");
           }
         }

       else{
         alert('Please, Insert Question');
       }
     }
   };
})();





/****************************
*******UI CONTROLLER*******
****************************/
var UIController=(function(){
  var domItems={
    //*****Admin panel*******
    questInsertBtn:document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions:document.querySelectorAll(".admin-option"),
    adminOptionsContainer:document.querySelector(".admin-options-container")

  };
  return{
    getDomItems:domItems,
    addInputsDynamically:function(){
    var addInput=function(){
      var inputHTML,z;
      z=document.querySelectorAll('.admin-option').length;
      inputHTML='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ z + '" name="answer" value="'+ z + '"><input type="text" class="admin-option admin-option-'+ z + '" value=""></div>';
      domItems.adminOptionsContainer.insertAdjacentHTML('beforeend',inputHTML);
      domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addInput);
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);
    }
    domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus',addInput);
}
  };


})();



/****************************
*******CONTROLLER***********
****************************/
var controller=(function(quizCtrl,UICtrl){
  var selectedDomItems=UICtrl.getDomItems;

  UICtrl.addInputsDynamically();
  selectedDomItems.questInsertBtn.addEventListener('click',function(){
    var adminOptions=document.querySelectorAll('.admin-option')
    quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText,adminOptions)

  });


})(quizController,UIController);
