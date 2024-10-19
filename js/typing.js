function changeText(getTextFrom, type1, sendTextTo, type2) {
  var textbox = document.getElementById(sendTextTo);
  var text;
  if(type1 == "div") {
    text = document.getElementById(getTextFrom).innerHTML;
  } 
  if(type1 == "input") {
    text = document.getElementById(getTextFrom).value;
  }
  if(type2 == "div" ) {
    textbox.innerHTML = text;
  }
  if(type2 == "input") {
    textbox.value = text;
  }
}

function addText(getTextFrom, type1, sendTextTo, type2, start = "", end = "") {
  var textbox = document.getElementById(sendTextTo);
  var text;
  if(type1 == "div") {
    text = document.getElementById(getTextFrom).innerHTML;
  } 
  if(type1 == "input") {
    text = document.getElementById(getTextFrom).value;
  }
  if(type2 == "div" ) {
    textbox.innerHTML += start + text + end;
  }
  if(type2 == "input") {
    textbox.value += start + text + end;
  }
}