const state = {
  arr : ["firstName","lastName","about","eyeColor","phone"],
  dataArr: []
};
let {arr,dataArr} = state;

fetch("data.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      const {name,phone,about,eyeColor} = data[i];
      const {firstName,lastName}  = name;
      const item = {firstName, lastName, about, eyeColor, phone}
      dataArr.push(item);
    }
    for (let j = 0; j < dataArr.length; j++) {
      addRowToTable(dataArr[j],tbody,j)
    }
  })




const createTable = (arr,tbody) => {
  const tbl = document.createElement('table');
  tbl.className = "table";
  const th = document.createElement('th');
  th.className = "table-header";

  for (let i = 0; i < arr.length; i++) {
    let td = document.createElement("td");

    td.innerText = arr[i];
    td.className = "table-data";

    th.appendChild(td);
    td.addEventListener("click",() => sortingColumnAsc(arr[i],tbody) )
    td.addEventListener("dblclick",() => sortingColumnDesc(arr[i],tbody) )

  }
  tbl.appendChild(th);
  return tbl;
}
const addRowToTable = (obj,tbody,j) => {
  const tr = document.createElement("tr");
  tr.className = "table-row";
  tr.addEventListener("click",() => editCell(editDiv,j))
  for (let objKey in obj) {
    addCellToRow(obj[objKey],tr,j,objKey)
  }
  tbody.appendChild(tr)
};
const addCellToRow = (data,tr) => {
  const  td = document.createElement("td");

  if(data.length >= 30){
    td.innerText = textTruncate(data);
  }else{
    td.innerText = data;
  }
  td.className = "table-data";
  tr.appendChild(td);
};
const textTruncate = (str, length = 40, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

const editCell = (root,j) => {
  root.textContent = "";
  const form = document.createElement("div");
  form.className = "form-group";
  const h3 = document.createElement("h3");
  h3.textContent = "Change Cell Information"
  form.appendChild(h3)
  for (let key in dataArr[j]) {
    if(dataArr[j][key].length > 30 ){
      let textarea = document.createElement("textarea");
      textarea.value = dataArr[j][key];
      textarea.className = "edit-textarea"
      form.appendChild(textarea)
    }else{
      let input = document.createElement("input");
      input.value = dataArr[j][key];
      input.className = "edit-input";
      form.appendChild(input)
    }
  }
  const btn = document.createElement("button");
  btn.textContent = "Change";
  btn.className = "btn";
  form.appendChild(btn);
  root.appendChild(form);
}


const sortingColumnAsc = (item,tbody) => {
  tbody.innerText = "";
  for (let i = 0; i < dataArr.length; i+=1) {
    for (let j = 0; j < dataArr.length-1-i; j+=1) {
      if(dataArr[j][item] > dataArr[j+1][item]){
        let tmp = dataArr[j];
        dataArr[j] = dataArr[j+1];
        dataArr[j+1] = tmp;
      }
    }
  }
  for (let k = 0; k < dataArr.length; k++) {
    addRowToTable(dataArr[k],tbody,k)
  }
}
const sortingColumnDesc = (item,tbody) => {
  tbody.innerText = "";
  for (let i = 0; i < dataArr.length; i+=1) {
    for (let j = 0; j < dataArr.length-1-i; j+=1) {
      if(dataArr[j][item] < dataArr[j+1][item]){
        let tmp = dataArr[j];
        dataArr[j] = dataArr[j+1];
        dataArr[j+1] = tmp;
      }
    }
  }
  for (let k = 0; k < dataArr.length; k++) {
    addRowToTable(dataArr[k],tbody,k)
  }
}



const root = document.querySelector("#root");
const tbody = document.createElement("tbody");
const table = createTable(arr,tbody);
table.appendChild(tbody);
root.appendChild(table);

const editDiv = document.createElement("div");
editDiv.className = "editDiv";
root.appendChild(editDiv);


