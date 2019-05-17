function getTrends() {

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', '/api/trends?' + window.location.search.slice(1), true);

    request.onload = function () {
        // Begin accessing JSON data here
        document.getElementById('trends').innerHTML = request.responseText;
    };

    // Send request
    request.send();
}


function getSites() {

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://api.mercadolibre.com/sites', true);

    request.onload = function () {
        // Begin accessing JSON data here

        var sites = JSON.parse(request.responseText);

        var select = document.getElementById('sitios');

        sites.forEach(function (site) {
            var opt = document.createElement('option');
            opt.value = site.id;
            opt.text = site.name;

            select.appendChild(opt);
        })

    };

    // Send request
    request.send();
}

function getCategories(el) {

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://api.mercadolibre.com/sites/' + el.selectedOptions[0].value + '/categories', true);

    request.onload = function () {
        // Begin accessing JSON data here

        var categories = JSON.parse(request.responseText);

        var select = document.getElementById('categorias');
        
        for (i = select.options.length - 1; i > 0; i--) {
            select.remove(i);
        }

        categories.forEach(function (category) {
            var opt = document.createElement('option');
            opt.value = category.id;
            opt.text = category.name;

            select.appendChild(opt);
        })

    };

    // Send request
    request.send();
}



// Bulma functions
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});