const createTable = (obj,arr,root) => {
  const tbl = createElement("table","table",root); // создаем таблицу
  const th = createElement("th","table-header",tbl); // добавляем заголовку th
  const tbody = createElement("tbody","t-body",tbl); // создаем tbody
  const rightDiv = createElement("div","rightDiv",root); //добавляем  div правой части Таблицы

  for (let objKey in obj) {
    //перебираем заголовки и добавляем 2 событии к каждому ,
    // сортировка по возрастанию(click) и по убиванию(double click)
    let td = createElement("td","table-data",th);
    let spanSorting = createElement("span","span-sorting",td,obj[objKey])
    spanSorting.addEventListener("click",() => sortingColumnAsc(objKey,arr,tbody,rightDiv));
    spanSorting.addEventListener("dblclick",() => sortingColumnDesc(objKey,arr,tbody,rightDiv));

    // создаем иконку "--" (без всяких дополнительных подключенний),
    // добавляем событие для показа и скрытия колонок
    let span = createElement("span","span-header",td,"--");
    span.className += ` ${objKey}`; // класс для всей колонки , чтобы различать колонки
    span.className += ` show`;
    // добавляем класс show для показа и скрытия колонок
    // в css реализовано совсем чуть чуть
    span.onclick = () => hiddenBlock(objKey);
    // добавляем событие для показа и скрытия
  }
  addRowsToTable(arr,tbody,rightDiv);
  // добавляем данные в таблицу
  return tbl;
};
const addRowsToTable = (arr,tbody,rightDiv) => {
  let page = ""; //номер страницы
  // div для номеров пагинации
  let pageDiv = createElement("div","paginator");
  // будет отображаться наверху данных , можно было добавить в tbody снизу

  const cnt = 10; // количество отображаемых элементов на странице
  const countPages = Math.ceil(arr.length / cnt);//количество страниц
  for (let i = 0; i < countPages; i++) {
    //page += "<span data-page=" + i * cnt + "  id=\"page" + (i + 1) + "\">" + (i + 1) + "</span>";
    page += `<span data-page=${i * cnt}
                    id=page${i + 1}
                    class=page-span>
                ${i + 1}
            </span>`;
  }
  //содержимое pageDiv, добавляем событие для динамического пагинации
  pageDiv.innerHTML = page; // добавляем в див
  pageDiv.onclick = (e) => pagination(e,cnt,countPages);

  //перебираем массив с данными и для каждого создаем отдельную строку в tbody с классом table-row,
  //добавляем событие которое будет изменять нашу строку
  for(let i = 0; i < arr.length; i++) {
    let tr = createElement("tr","table-row", tbody );
    tr.addEventListener("click",() => editCell(i,arr,tbody,rightDiv));
    // ототбражаем столько сколько изначально было написано
    if(i < cnt){
      //по умолчанию дисплэй у них None
      tr.style.display = "flex";
    }
    for (let objKey in arr[i]) {
      //перебираем каждый объект элемента массива
      if (objKey === "id") {
        //так как id нам особо не нужно
        continue;
      }
      // если в ячейке много 30и символа ,
      // вместо общего текста печатает 27 символов + ...
      // если меньше 30и то добавляет ячейкам текст

      if (arr[i][objKey].length > 40) {
        let textarea = createElement("td", "table-data", tr);
        let span = createElement("span", "span-textarea",textarea,textTruncate(arr[i][objKey]));
        span.className += " " + objKey;
      } else {
        let td = createElement("td", "table-data", tr);
        let span = createElement("span", "span-td", td, arr[i][objKey]);
        span.className += " " + objKey;
        // для колнки цвет глаз изменяет значение добавляя цвет в фон
        if (objKey === "eyeColor") {
          td.style.backgroundColor = arr[i][objKey];
          span.textContent = "";
        }
      }
    }
  }
  tbody.appendChild(pageDiv)
  return tbody;
};
const changeInfoToCell = (e,index,arr,tbody,rightDiv) => {
  e.preventDefault(); // чтобы не перезагрузился браузер
  let editObj = {
    id:null,
    firstName:null,
    lastName:null,
    about:null,
    eyeColor:null,
    phone:null
  } ;
  // объект с именами  элементов формы
  //получаем каждый элемент добавляем в соответствующую переменную

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
    editObj.id = arr[index].id;
  }
  arr = [...arr.slice(0,index),editObj,...arr.slice(index+1)];
  //деструкттуризация es6
  // резаем массив от 0ого элемента до изменяемого элемента ,
  // добавляем новый объект , а в конце добавляем остальную часть
  deleteTextContent(tbody);// удаляем содержание tbody,rightDiv
  deleteTextContent(rightDiv)
  addRowsToTable(arr,tbody,rightDiv); // добавляем новые даннэ с массива
}
const createElement = (elementName,className = null,parent = null,value = null) => {
  //Принимает html элемент первым параметром ,
  // имя класса , родительский элемент, и значение , по умолчанию они null
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
};
const deleteTextContent = (element) => {
  element.textContent = "";
};
const editCell = (index,arr,tbody,rightDiv) => {
  deleteTextContent(rightDiv);
  const form = createElement("form","form-group",rightDiv);
  createElement("h3",null,form,"Change Cell Information",);

  for (let key in arr[index]) {
    if(arr[index][key].length > 30 ){
      createElement("textarea","edit-textarea",form,arr[index][key]);
    }else{
      if(key === "id"){
        continue;
      }
      let input = createElement("input","edit-input",form);
      input.type = "text";
      input.value = arr[index][key];
    }
  }
  const btn = createElement("button","btn",form,"Change");
  btn.type = "submit"
  btn.addEventListener("click",(e) => changeInfoToCell(e,index,arr,tbody,rightDiv))
  rightDiv.append(form);
}
const hiddenBlock = (objKey) => {
  //принимает один аргумент имя (класс) колонки
  //по умолчанию все показывается
  //
  const allBlocks = document.querySelectorAll("."+objKey)
  let isShow = true;
  const headerClassList = allBlocks[0].className.split(" ");
  for (let i = 0; i < headerClassList.length; i++) {
    //если у элемента есть класс show,изменяет "--" на + добавляет класс hidden
    // тем самым скрывая колонку и выходя из цикла
    //аналогичным способом делается и обратное действие
    if(headerClassList[i] === "show"){
      allBlocks[0].textContent = "+";
      allBlocks[0].className = "span-header ";
      allBlocks[0].className += ` ${objKey}`;
      allBlocks[0].className += ` hidden`;
      isShow = false;
      break;
    }
    if(headerClassList[i] === "hidden"){
      allBlocks[0].textContent = "--";
      allBlocks[0].className = "span-header ";
      allBlocks[0].className += ` ${objKey}`;
      allBlocks[0].className += ` show`;
      isShow = true;
      break;
    }
  }
  //перебираем данные без заголовка,скрываем или показваем колонки
  for (let i = 1; i < allBlocks.length; i++) {
    if(isShow){
      allBlocks[i].style.display = "flex";
      allBlocks[i].style.justifyContent = "space-evenly";
    }else{
      allBlocks[i].style.display = "none";
    }
  }
};
const pagination = (event,cnt,countPages) => {
  let target = event.target;
  let id = target.id; // текущий pageId
  let num_id = id.substr(4);// текущая страница
  for (let i = 1; i <= countPages; i++) {
    //бегаем по количеству страниц и
    // смотрим который был нажат того даём красный цвет остальным черный
    let idItem = `page${i}`;
    let el = document.getElementById(idItem);
    if(+num_id === i){
      el.style.color = "red";
    }else{
      el.style.color = "black";
    }
  }

  let data_page = +target.dataset.page;
  //получаем все строки данных таблицы
  //те которые больше или меньше нашей желаемой страницы не показываем
  let arrElements = document.querySelectorAll(".table-row");
  let j = 0;
  for (let i = 0; i < arrElements.length; i++) {
    if (i <= data_page || i >= data_page)
      arrElements[i].style.display = "none";
  }
  for (let i = data_page; i < arrElements.length; i++) {
    if (j >= cnt) break;
    arrElements[i].style.display = "flex";
    j++;
  }
};
const sortingColumnAsc = (item,arr,tbody,rightDiv) => {
// принимает 3 параметра элемент сортировки , массив данных и тело таблицы
  deleteTextContent(tbody); // очищаем тело таблицы
  // сортируем массив по возрастанию с помощью Bubble Sort
  // можно сортировать Quick, Merge и другими алгоритмами
  for (let i = 0; i < arr.length; i+=1) {
    for (let j = 0; j < arr.length-1-i; j+=1) {
      if(arr[j][item] > arr[j+1][item]){
        let tmp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = tmp;
      }
    }
  }
  addRowsToTable(arr,tbody,rightDiv); // тело заполняем новым сортированным массивом
  // аналогичным образом будет работать сортировка по убиванию для double Click
};
const sortingColumnDesc = (item,arr,tbody,rightDiv) => {
  deleteTextContent(tbody);
  for (let i = 0; i < arr.length; i+=1) {
    for (let j = 0; j < arr.length-1-i; j+=1) {
      if(arr[j][item] < arr[j+1][item]){
        let tmp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = tmp;
      }
    }
  }

  addRowsToTable(arr,tbody,rightDiv);
};
const textTruncate = (str, length= 40, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

export {
  createTable
}