function showFormSearch() {
    let html = `<div class="contain_search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm kiếm" id="result_input" oninput="searchUser()">
        </div>
        <div class="contain_result" id="contain_result"></div>`;
    getUnflUser();

    document.getElementById('main-content').innerHTML = html;

}

function getUnflUser() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let html = ``;

    axios.all([
        axios.get(`http://localhost:8080/users/expect/${currentUser.id}`),
        axios.get(`http://localhost:8080/relationship/following?id=${currentUser.id}`)
    ]).then(axios.spread((userResponse, followingResponse) => {
        let listUser = userResponse.data;
        let listRelaFollowing = followingResponse.data;

        let followedUserIds = listRelaFollowing.map(relation => relation.user2.id);

        for (let i = 0; i < listUser.length; i++) {
            if (!followedUserIds.includes(listUser[i].id)) {
                html += `<div class="result_user">
                    <div class="result_avatar"><img src="/elements/${listUser[i].avatar}" alt="" onclick="getProfile(${listUser[i].id})"></div>
                    <div class="result_right">
                        <div class="result_top">
                            <div class="result_info"  onclick="getProfile(${listUser[i].id})">
                                <div class="result_username"><span>${listUser[i].username}</span></div>
                                <div class="result_name"><span>${listUser[i].name}</span></div>
                            </div>
                            <div class="result_button">
                                <button id="follow_button_${listUser[i].id}" onclick="sendFollowFromSearch(${currentUser.id}, ${listUser[i].id})">Theo dõi</button>
                                <button id="followed_button_${listUser[i].id}" onclick="delFollowFromSearch(${currentUser.id}, ${listUser[i].id})" style="display: none">Đang theo dõi</button>
                            </div>
                        </div>
                        <div class="result_bottom"><span id="countFollower_${listUser[i].id}">0</span><span> người theo dõi</span></div>
                    </div>
                </div>`;
                countFollower(listUser[i].id)
            }
        }
        document.getElementById('contain_result').innerHTML = html;

    }));
}

function countFollower(targetID) {
    axios.get(`http://localhost:8080/relationship/follower?id=${targetID}`).then((response) => {
        let listFollower = response.data;
        document.getElementById(`countFollower_${targetID}`).innerHTML = listFollower.length;
    })

}

function sendFollowFromSearch(currentID, targetID) {
    let relationship = {
        user1: {
            id: currentID
        },
        user2: {
            id: targetID
        }
    }
    axios.post('http://localhost:8080/relationship', relationship).then((response) => {
        document.getElementById(`follow_button_${targetID}`).style.display = 'none';
        document.getElementById(`followed_button_${targetID}`).style.display = 'block';
    })
}

function delFollowFromSearch(currentID, targetID) {
    axios.delete(`http://localhost:8080/relationship?id1=${currentID}&id2=${targetID}`).then((response) => {
        document.getElementById(`follow_button_${targetID}`).style.display = 'block';
        document.getElementById(`followed_button_${targetID}`).style.display = 'none';
    })
}

function searchUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let q = document.getElementById('result_input').value;
    if (q === '') {
        getUnflUser();
    } else {
        axios.all([
            axios.get(`http://localhost:8080/users/search?q=${q}`)
        ]).then(axios.spread((userResponse) => {
            let listUser = userResponse.data;
            let html = ``;
            for (let i = 0; i < listUser.length; i++) {
                if (listUser[i].id !== currentUser.id) {
                    html += `<div class="result_user">
                    <div class="result_avatar" ><img src="/elements/${listUser[i].avatar}" alt="" onclick="getProfile(${listUser[i].id})"></div>
                    <div class="result_right">
                        <div class="result_top">
                            <div class="result_info" onclick="getProfile(${listUser[i].id})">
                                <div class="result_username"><span>${listUser[i].username}</span></div>
                                <div class="result_name"><span>${listUser[i].name}</span></div>
                            </div>
                            <div class="result_button">
                                <button id="follow_button_${listUser[i].id}" onclick="getProfile(${listUser[i].id})">Xem</button>
                          
                            </div>
                        </div>
                        <div class="result_bottom"><span id="countFollower_${listUser[i].id}">0</span><span> người theo dõi</span></div>
                    </div>
                </div>`;
                    countFollower(listUser[i].id)
                }
            }
            document.getElementById('contain_result').innerHTML = html;
        }))
    }
}
