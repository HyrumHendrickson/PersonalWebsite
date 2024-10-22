// Fetch the content of another HTML file and insert it into the div with id "header"
fetch('../pages/grid.html')
.then(response => response.text())
.then(data => {
    var list = "";
    for(i = 0; i < 180; i++) {list += "<div id='n" + i + "'></div>";}
    document.getElementById('mainGrid').innerHTML = list;

    var gridItems = document.querySelectorAll('#mainGrid div');

    for(let i = 0; i < gridItems.length; i++) {
        gridItems[i].addEventListener('click', () => {
            // Do something when the grid item is clicked
            console.log('Grid item number ' + i + ' clicked!');
          });
    }
});

// Get all the grid items
