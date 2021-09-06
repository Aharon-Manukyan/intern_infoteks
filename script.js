const state = {
  objHeader : {
    "firstName":"Имя",
    "lastName":"Фамилия",
    "about":"Описание ",
    "eyeColor":"Цвет глаз ",
    "phone":"Номер телефона"
  },
  dataArr: [],
  root: null,
  tbody:null,
  table:null,
  rightDiv:null
};
let {objHeader,dataArr,root,tbody,rightDiv} = state;


fetch("data.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      const {id,name,phone,about,eyeColor} = data[i];
      const {firstName,lastName}  = name;
      const item = {id,firstName, lastName, about, eyeColor, phone}
      dataArr.push(item);
    }
    addRowsToTable(dataArr)
  })


const createElement = (elementName,className = null,value = null,parent = null) => {
  let el = document.createElement(elementName);
  if(className !== null){
    el.className = className;
  }
  if(value !== null){
    el.textContent = value;
  }
  if(parent !== null){
    parent.appendChild(el);
  }
  return el;
}
const deleteTextContent = (element) => {
  element.textContent = "";
}

const createTable = (obj) => {
  const tbl = createElement("table","table",null,root);
  const th = createElement("th","table-header",null,tbl);

  for (let objKey in obj) {
    let td = createElement("td","table-data",obj[objKey],th);
    td.addEventListener("click",() => sortingColumnAsc(objKey));
    td.addEventListener("dblclick",() => sortingColumnDesc(objKey));
  }

  return tbl;
}
const addRowsToTable = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let tr = createElement("tr","table-row", null,tbody );
    tr.addEventListener("click",() => editCell(i));
    for (let objKey in arr[i]) {
      if(objKey === "id"){
        continue;
      }
      if(arr[i][objKey].length > 30){
        createElement("td","table-data",textTruncate(arr[i][objKey]),tr);
      }else{
        createElement("td","table-data",arr[i][objKey],tr);
      }
    }
  }
}

const textTruncate = (str, length = 40, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}
const sortingColumnAsc = (item) => {
  deleteTextContent(tbody);
  for (let i = 0; i < dataArr.length; i+=1) {
    for (let j = 0; j < dataArr.length-1-i; j+=1) {
      if(dataArr[j][item] > dataArr[j+1][item]){
        let tmp = dataArr[j];
        dataArr[j] = dataArr[j+1];
        dataArr[j+1] = tmp;
      }
    }
  }

  addRowsToTable(dataArr);

}
const sortingColumnDesc = (item) => {
  deleteTextContent(tbody);
  for (let i = 0; i < dataArr.length; i+=1) {
    for (let j = 0; j < dataArr.length-1-i; j+=1) {
      if(dataArr[j][item] < dataArr[j+1][item]){
        let tmp = dataArr[j];
        dataArr[j] = dataArr[j+1];
        dataArr[j+1] = tmp;
      }
    }
  }

  addRowsToTable(dataArr);
}

const editCell = (index) => {
  deleteTextContent(rightDiv);

  const form = createElement("form","form-group",null,rightDiv);

  createElement("h3",null,"Change Cell Information",form);

  for (let key in dataArr[index]) {
    if(dataArr[index][key].length > 30 ){
      createElement("textarea","edit-textarea",dataArr[index][key],form);
    }else{
      if(key === "id"){
        continue;
      }
      let input = createElement("input","edit-input",null,form);
      input.type = "text";
      input.value = dataArr[index][key];
    }
  }
  const btn = createElement("button","btn","Change",form);
  btn.type = "submit"
  btn.addEventListener("click",(e) => changeInfoToCell(e,index))

  rightDiv.appendChild(form);
}
const changeInfoToCell = (e,index) => {
 e.preventDefault();
  let editObj = {
    id:null,
    firstName:null,
    lastName:null,
    about:null,
    eyeColor:null,
    phone:null
  } ;
  
  for (let i = 0; i < e.srcElement.form.length; i++) {
    switch (i) {
      case 0:
        editObj.firstName = e.srcElement.form[i].value;
        break;
      case 1:
        editObj.lastName = e.srcElement.form[i].value;
        break;
      case 2:
        editObj.about = e.srcElement.form[i].value;
        break;
      case 3:
        editObj.eyeColor = e.srcElement.form[i].value;
        break;
      case 4:
        editObj.phone = e.srcElement.form[i].value;
        break;
      default:
        editObj.id = e.srcElement.form[i].value;
        break;
    }
  }
  if(editObj.hasOwnProperty("id")){
    editObj.id = dataArr[index].id;
  }
  dataArr = [...dataArr.slice(0,index),editObj,...dataArr.slice(index+1)];

  deleteTextContent(tbody);
  deleteTextContent(rightDiv)
  addRowsToTable(dataArr);
}






root = document.querySelector("#root"); // Получаем корень узел #root
table = createTable(objHeader); // Создаем таблицу с заголовками
tbody = createElement("tbody","t-body",null,table); // создаем tbody
rightDiv = createElement("div","rightDiv",null,root)




