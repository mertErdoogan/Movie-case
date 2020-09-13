$(function () {

    const apiKey = "87d2b660";
    let value = "";
    let isDataHave = false
    let historySearchData = [];
    let historyDataCount = 0;
    let $orders = $('#movie-container');
    let tempHistory = null;
    let favStore = [];
    let favBlock = $("#favBlock");

    $("#inputData").on("keyup change", () => {
        value = $("#inputData").val();
        if (value.replace(/\s+/g, '').length > 2) {
            $("#movieSearch").addClass("active");
        }
        if (value.replace(/\s+/g, '').length < 3) {
            $("#movieSearch").removeClass("active");
        }
    })

    $("#movieSearch").on("click", () => {
        getMovies();
    })

    const getMovieFromApi = (value) => {
        return $.ajax({
            type: 'GET',
            url: 'http://www.omdbapi.com/?s=' + value.replace(/\s+/g, '+') + '&apikey=' + apiKey + '',
            success: function (data) {
                $.each(data.Search, (i, item) => {
                    if(favStore.find(title => title === item.Title) === undefined) {
                        $orders.append('<div class="movies-item"><img src="' + item.Poster + '" alt="" /><p class="desc">' + item.Title + '</p><p>Çıkış Yılı: ' + item.Year + '</p><i class="favAdd fas fa-heart"></i></div>')
                    } else {
                        $orders.append('<div class="movies-item"><img src="' + item.Poster + '" alt="" /><p class="desc">' + item.Title + '</p><p>Çıkış Yılı: ' + item.Year + '</p><i class="active fas fa-heart favAdd"></i></div>')
                    }
                })
            }
        });
    }

    const getMovies = () => {
        if (isDataHave) {
            $(".movies-item").remove();
            isDataHave = false;
        }
        let isIsInputDataUnique = historySearchData.find(item => item === value);

        getMovieFromApi(value);

        if (isIsInputDataUnique === undefined) {
            setHistorySearchData(value);
        }

        value = "";
        isDataHave = !isDataHave;
        $('#inputData').val('');
        $("#movieSearch").removeClass("active");
    }

    const historyMovieHandler = (e) => {
        let historyValue = e.target.textContent;
        if (isDataHave) {
            $(".movies-item").remove();
            isDataHave = false;
        }
        getMovieFromApi(historyValue);
        isDataHave = !isDataHave;

    }

    const historyDeleteHandler = (e) => {
        let tempHistoryData = e.target.parentElement;
        tempHistoryData.remove();
    }

    const setHistorySearchData = (data) => {
        let $favMovies = $("#favMovies");
        historySearchData.push(data);
        if (historyDataCount === 10) {
            historySearchData.shift();
            historyDataCount--;
            $('#favMovies').children().last().remove();
        }
        historyDataCount++;

        tempHistory = '<div class="fav-item"><p class="movieTitle">' + data + '</p><i class="delete-icon fas fa-times"></i></div>'
        $favMovies.prepend(tempHistory);

    }

    const handleAddFavItem = (e) => {
        if(favStore.length >= 0 ) {
            if(favStore.find(item => item === e.target.parentElement.children[1].textContent) !== undefined) {
                handleRemoveFavItem(e);
                $(e.target).removeClass("active");
            } else {
                favStore.push(e.target.parentElement.children[1].textContent);
                favBlock.append('<div class="favorites-item">\n' +
                    '                    <img src="'+ e.target.parentElement.children[0].src +'" alt="movie-img">\n' +
                    '                    <p class="desc">'+e.target.parentElement.children[1].textContent+'</p>\n' +
                    '                    <p>'+e.target.parentElement.children[2].textContent+'</p>\n' +
                    '                    <i class="favAdd fas fa-heart active">'+e.target.parentElement.children[3].textContent+'</i>\n' +
                    '                </div>');
                $(e.target).addClass("active");
            }
        }
    }

    const handleRemoveFavItem = (e) => {
        const index = favStore.indexOf(e.target.parentElement.children[1].textContent);
        $(".favorites-item")[index].remove();
        favStore.splice(index, 1);
        $(e.target).removeClass("active");
        for(let i=0; i<$(".movies-item > p.desc").length; i++) {
            let moviesItemTitle = $(".movies-item > p.desc");
            let movies = $(".movies-item");
            if(moviesItemTitle[i].innerText === e.target.parentElement.children[1].textContent) {
                console.log("aaaaaaaa",);
                $(movies[i].lastChild).removeClass("active");
            }
        }
        console.log($(".movies-item > p.desc").length);
    }

    $(document).on("click", "p.movieTitle", (e) => {
        historyMovieHandler(e);
    });

    $(document).on("click", "i.delete-icon", (e) => {
        historyDeleteHandler(e);
        historyDataCount--;
    })

    $(document).on("click", "i.favAdd", (e) => {
        handleAddFavItem(e);
        // handleAddFavItem(e.target.parentElement.children[0].src);
        if(favStore.length === 1) {
            $(".favorites-container > h2").addClass("active");
        } else if(favStore.length === 0){
            $(".favorites-container > h2").removeClass("active");
        }
    })

})

