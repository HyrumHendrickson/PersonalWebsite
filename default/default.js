

// Fetch the content of another HTML file and insert it into the div with id "header"
fetch('../default/header.html')
.then(response => response.text())
.then(data => {
    document.getElementById('header').innerHTML = data;
});

// Fetch the content of another HTML file and insert it into the div with id "footer"
fetch('../default/footer.html')
.then(response => response.text())
.then(data => {
    document.getElementById('footer').innerHTML = data;
});

