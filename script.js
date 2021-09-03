const arr = ["Name","LastName","About","Eye Color"];

//const root = document.getElementById("root");
const root = document.querySelector("#root");

const div_top = document.createElement("div");
root.appendChild(div_top);

let ul = document.createElement("ul");
for (let i = 0; i < arr.length; i++) {
  let li = document.createElement("li");
  let content = document.createTextNode(arr[i]);
  li.appendChild(content);
  ul.appendChild(li);
}

div_top.appendChild(ul);