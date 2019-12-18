function search() {
    let input = document.getElementById('search');
    let filter = input.value.toUpperCase();
    let gameCards = document.querySelectorAll('.card-deck');

    for (let i = 0; i < gameCards.length; i++) {
        let title = gameCards[i].querySelector('.card-title');
        let textValue = title.innerHTML;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            gameCards[i].style.display = "";
        }
        else {
            gameCards[i].style.display = "none";
        }
    }
}