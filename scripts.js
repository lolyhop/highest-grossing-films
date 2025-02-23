let moviesData;

fetch('films.json')
    .then(response => response.json())
    .then(movies => {
        moviesData = movies;
        showChart('2005-2009');
    })
    .catch(error => console.error('Error loading films.json:', error));

function showChart(period) {
    const periods = {
        "2005-2009": [2005, 2009],
        "2010-2014": [2010, 2014],
        "2015-2019": [2015, 2019],
        "2020-2024": [2020, 2024]
    };

    const range = periods[period];
    const filteredMovies = moviesData.filter(movie => movie.release_year >= range[0] && movie.release_year <= range[1]);
    
    const labels = filteredMovies.map(movie => movie.title);
    const boxOfficeData = filteredMovies.map(movie => movie.box_office);
    const directors = filteredMovies.map(movie => movie.director);
    const releaseYears = filteredMovies.map(movie => movie.release_year);

    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelector(`button[onclick="showChart('${period}')"]`).classList.add('active');

    const ctx = document.getElementById("barChart").getContext("2d");
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Box Office Revenue ($)",
                data: boxOfficeData,
                backgroundColor: "#1abc9c",
                borderColor: "#16a085",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let index = tooltipItem.dataIndex;
                            return [
                                `Box Office: $${boxOfficeData[index].toLocaleString()}`,
                                `Director: ${directors[index]}`,
                                `Year: ${releaseYears[index]}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
