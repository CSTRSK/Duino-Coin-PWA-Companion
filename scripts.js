// Loaded Eventlistener
window.addEventListener('load', () => {
    // Call Service Worker Register
    registerSW();
});

// Register the Service Worker
async function registerSW() {
    // Is Browser Compatibale with Service Workers?
    if ('serviceWorker' in navigator) {
        try {
            // Load Service Worker Script
            await navigator
                .serviceWorker
                .register('service_worker.js');
        }
        catch (e) {
            // ERROR CATCH SERVICE WORKER
            console.log('SW registration failed');
        }
    }
}

function loadDUCOData(UserName){
    // DUCO Balance URL
    const balance_url = 'https://server.duinocoin.com/balances/'+UserName;
    // DUCO Miners URL
    const miners_url = 'https://server.duinocoin.com/miners/'+UserName;
    // DUCO Chain Statistics
    const stats_url = 'https://server.duinocoin.com/statistics';

    // Getting Json from REST-API
    var getJSON = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    };

    // Getting User Balance
    getJSON(balance_url,
        function (err, data) {
            if (err !== null) {
                // Called when resived no Data.
                alert('Something went wrong: ' + err);
            } else {
                var user_html = "";
                // If data is including message then it's a error message likely account isn't available
                if (data.message) {
                    user_html += '<div class="w3-row"><div class="w3-rest">' + data.message + '</div></div><div class="w3-bar hr"></div>';
                } else {
                    // UNIX to date time
                    var date = new Date(data.result.stake_date * 1000);
                    // Generating UI stuff
                    user_html += '<div class="w3-row">';
                    user_html += '<div class="w3-half w3-container">Username: ' + data.result.username;
                    user_html += '<br>Balance: ' + data.result.balance + " ᕲ DUCO";
                    user_html += '<br>Staked: ' + data.result.stake_amount + " ᕲ DUCO</div>";
                    user_html += '<div class="w3-half w3-container">Verified: ' + data.result.verified;
                    user_html += '<br>End stake date: ' + date + "</div>";
                    user_html += '</div>';
                }
                // Adding UI stuff to user DIV
                document.getElementById("user").innerHTML = user_html;
            }
        });

    // Getting Users Active Miners
    getJSON(miners_url,
        function (err, data) {
            if (err !== null) {
                // Called when resived no Data.
                alert('Something went wrong: ' + err);
            } else {
                var miners_html = "";
                // Count for onclick "Accordions" Opening and adding a uniqe ID
                var miner_count = 0;
                if (data.message) {
                    // If data is including message then it's a error message likely account isn't available
                    miners_html += '<div class="w3-row"><div class="w3-col inactive_dot"></div><div class="w3-rest">' + data.message + '</div></div>';
                } else {
                    // HTML UI Stuff
                    miners_html += '<div class="w3-row"><div class="w3-col active_dot"></div><div class="w3-rest">Mining active</div></div>';
                    miners_html += "<ul class='w3-ul'>";
                    // Loop in inner JSON Array for Miners
                    data.result.forEach(item => {
                        // HTML UI stuff
                        miners_html += '<button onclick="open_Miner(' + miner_count + ')" class="w3-button w3-block w3-left-align miner_hover">' + item.identifier + '</button><div id="' + miner_count + '" class="w3-animate-bottom w3-container w3-hide w3-row"><div class="w3-half w3-container"><p>Hashrate: ' + item.hashrate + '</p><p>Software: ' + item.software + '</p></div><div class="w3-half w3-container"><p>Accepted: ' + item.accepted + '</p><p>Rejected: ' + item.rejected + '</p></div></div>';
                        // Adding +1 for onclick "Accordions" Opening and adding a uniqe ID
                        miner_count++;
                    });
                    miners_html += '</ul>';
                }
                // Adding UI stuff to miners DIV
                document.getElementById("miners").innerHTML = miners_html;
            }
        });

    // Getting Chain statistics
    getJSON(stats_url,
        function (err, data) {
            if (err !== null) {
                // Called when resived no Data.
                alert('Something went wrong: ' + err);
            } else {
                var stat_html = "";
                if (data.message) {
                    // If data is including message then it's a error message likely isn't available
                    stat_html += '<div class="w3-row"><div class="w3-rest">Error loading statistics</div></div><div class="w3-bar hr"></div>';
                } else {
                    // Needs to Stringify the resived JSON has a weird format
                    const myObj = JSON.stringify(data);
                    // Parsing it to a array for better looping in the Json
                    const myObj2 = JSON.parse(myObj);

                    // HTML UI stuff
                    stat_html += '<ul class="w3-ul">';
                    // JSON Loop 
                    for (var key in myObj2) {
                        // Ignoring more deeper Arrays (Work on it!)
                        if (myObj2[key] == '[object Object]') {
                        } else {
                            // HTML UI stuff getting data from the Loop key and data
                            stat_html += '<li>' + (key + ': ' + myObj2[key]) + '</li>';
                        }
                    }
                    stat_html += '</ul>'
                }
                // Adding UI stuff to statistics DIV
                document.getElementById("statistics").innerHTML = stat_html;
            }
        });
}

// Miner "Accordions" opening script uniqe with ID
function open_Miner(id) {
    //Getting UI element
    var x = document.getElementById(id);
    // Is  UI element visible?
    if (x.className.indexOf("w3-show") == -1) {
        // Show UI element
        x.className += " w3-show";
    } else {
        // Remove UI element
        x.className = x.className.replace(" w3-show", "");
    }
}

// ONWORK 
const input = document.querySelector('input');

input.addEventListener('keydown', logKey);

function logKey(e) {
    loadDUCOData(input.value);
}