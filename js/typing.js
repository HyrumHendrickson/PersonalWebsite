

function changeText(getTextFrom, sendTextTo) {
  var textbox = document.getElementById(sendTextTo);
  textbox.value = document.getElementById(getTextFrom).value;
}