function getProfile(userID) {
    preProfile = userID;
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    axios.all([
        axios.get(`http://localhost:8080/users/${userID}`),
        axios.get(`http://localhost:8080/thread/user/${userID}`),
        axios.get(`http://localhost:8080/relationship/check?id1=${currentUser.id}&id2=${userID}`),
        axios.get(`http://localhost:8080/relationship/follower?id=${userID}`),
        axios.get(`http://localhost:8080/relationship/following?id=${userID}`)
    ]).then(axios.spread((userResponse, threadUserResponse, relaResponse, followerResponse, followingResponse) => {
        let user = userResponse.data;
        let threadList = threadUserResponse.data;
        let relationship = relaResponse.data;
        let listFollower = followerResponse.data;
        let listFollowing = followingResponse.data;
        document.getElementById('count_follower').innerHTML = listFollower.length;
        document.getElementById('count_following').innerHTML = listFollowing.length;
        let html = `<div class="detail-profile">
            <div class="detail-top">
                <div class="detail-left">
                    <div class="detail-name"><span>${user.name}</span></div>
                    <div class="detail-username"><span>${user.username}</span></div>
                </div>
                <div class="detail-right">

                    <img src="/elements/${user.avatar}" alt="">
                </div>
            </div>
            <div class="detail-middle"><span>${user.description}</span></div>
            <div class="detail-bot"><span id="list_follow" onclick="openFollowModal()"><span>${listFollower.length}</span> người theo dõi</span></div>
        </div>
        <div class="setting-profile">`
        if (currentUser.id === userID) {
            html += `<button class="button_setting">Chỉnh sửa trang cá nhân</button>`
        } else {
            if (relationship === "") {
                html += `<button onclick="sendFollow(${currentUser.id},${userID})" class="button_follow">Theo dõi</button>`
            } else {
                html += `<button onclick="delFollow(${currentUser.id},${userID})" class="button_setting">Đang theo dõi</button>`
            }
        }
        html += `</div>
        <div class="title-thread">
            <div class="my-thread">
                <button>Thread</button>
            </div>
            <div class="my-comment">
                <button>Thread trả lời</button>
            </div>
            <div class="my-rethread">
                <button>Bài đăng lại</button>
            </div>
        </div>
        <div class="contain-thread">`
        for (let i = 0; i < threadList.length; i++) {
            let timeDiff = getTimeDiff(threadList[i].create_at);
            html += `<div class="thread">
                <div class="contain_avatar">
                    <img src="/elements/${user.avatar}" alt="">
                </div>
                <div class="contain_content">
                    <div class="content_top">
                        <div class="username_top"><button>${user.username}</button></div>
                        <div class="time"><span>${timeDiff}</span></div>
                        <div class="option_thread"><i class="fa-solid fa-ellipsis"></i></div>
                    </div>
                    <div class="content_middle">
                        <div class="content_text">
                            <span>${threadList[i].content}</span>
                        </div>
                        <div class="content_image">`
            if (threadList[i].usedImageSet[0] != null) {
                html += `<img src="/elements/${threadList[i].usedImageSet[0].source}" alt="">`;
            }
            html += `</div>
                        <div class="content_function">
                            <button id="liked_${threadList[i].id}" onclick="likedPost(${threadList[i].id})">`
            let isLiked = false;
            for (let j = 0; j < threadList[i].likedSet.length; j++) {
                if (user.id === threadList[i].likedSet[j].user.id) {
                    isLiked = true;
                    break;
                }
            }
            if (isLiked) {
                html += `<i class="fa-solid fa-heart" style="color: #ff0000;font-size: 21px"></i>`;
            } else {
                html += `<i class="fa-regular fa-heart" style="font-size: 21px"></i>`;
            }
            html += `</button>
                            <button><i class="fa-regular fa-comment" style="font-size: 21px"></i></button>
                            <button><i class="fa-solid fa-repeat" style="font-size: 19px"></i></button>
                            <button><i class="fa-regular fa-paper-plane" style="font-size: 19px"></i></button>
                        </div>
                        <div class="content_activity">
                            <span >${threadList[i].commentSet.length}</span><span> thread trả lời</span>
                            <span>&nbsp·&nbsp</span>
                            <span id="totalLiked_${threadList[i].id}">${threadList[i].likedSet.length}</span><span> lượt thích</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr>`
        }
        html += `</div>`
        document.getElementById('main-content').innerHTML = html;
        getFollower(userID);

        // getFollowing(userID);
        closeFollowModal();
    }));
}

function delFollow(currenUserID, targetUserID) {
    axios.delete(`http://localhost:8080/relationship?id1=${currenUserID}&id2=${targetUserID}`).then((response) => {
        getProfile(targetUserID);
    })
}

function sendFollow(currenUserID, targetUserID) {
    let relationship = {
        user1: {
            id: currenUserID
        },
        user2: {
            id: targetUserID
        }
    }
    axios.post("http://localhost:8080/relationship", relationship).then((response) => {
        getProfile(targetUserID)
    })
}

function getFollower(userID) {
    axios.all([
        axios.get(`http://localhost:8080/users/${userID}`),
        axios.get(`http://localhost:8080/relationship/follower?id=${userID}`)
    ]).then(axios.spread((userResponse, followerResponse) => {
        let user = userResponse.data;
        let listFollower = followerResponse.data;
        let follow_middle = document.getElementById("follow_middle");
        while (follow_middle.firstChild) {
            follow_middle.removeChild(follow_middle.firstChild);
        }
        if (listFollower.length === 0) {
            let no_follower = document.createElement("div");
            no_follower.classList.add('no_follow');
            let span_no_follower = document.createElement("span")
            span_no_follower.innerHTML = `${user.username} chưa có ai theo dõi`;
            no_follower.appendChild(span_no_follower);
            follow_middle.appendChild(no_follower);
        } else {
            let html1 = ``;
            for (let i = 0; i < listFollower.length; i++) {
                html1 += `<div class="follow-user">
                    <div class="follow-left"><img onclick="getProfile(${listFollower[i].user1.id})" src="/elements/${listFollower[i].user1.avatar}" alt=""></div>
                    <div class="follow-right">
                        <div class="follow-username"><span onclick="getProfile(${listFollower[i].user1.id})">${listFollower[i].user1.username}</span></div>
                        </div>
                </div>`
            }
            document.getElementById('follow_middle').innerHTML = html1;
        }
    }));
}

function getFollowing(userID) {
    axios.all([
        axios.get(`http://localhost:8080/users/${userID}`),
        axios.get(`http://localhost:8080/relationship/following?id=${userID}`)
    ]).then(axios.spread((userResponse, followingResponse) => {
        let user = userResponse.data;
        let listFollowing = followingResponse.data;
        let follow_middle = document.getElementById("follow_middle");
        while (follow_middle.firstChild) {
            follow_middle.removeChild(follow_middle.firstChild);
        }
        if (listFollowing.length === 0) {
            let no_follower = document.createElement("div");
            no_follower.classList.add('no_follow');
            let span_no_follower = document.createElement("span")
            span_no_follower.innerHTML = `${user.username} chưa theo dõi ai`;
            no_follower.appendChild(span_no_follower);
            follow_middle.appendChild(no_follower);
        } else {
            let html = ``;
            for (let i = 0; i < listFollowing.length; i++) {
                html += `<div class="follow-user">
                    <div class="follow-left"><img onclick="getProfile(${listFollowing[i].user2.id})" src="/elements/${listFollowing[i].user2.avatar}" alt=""></div>
                    <div class="follow-right">
                        <div class="follow-username"><span onclick="getProfile(${listFollowing[i].user2.id})">${listFollowing[i].user2.username}</span></div>
                        </div>
                </div>`
            }
            document.getElementById('follow_middle').innerHTML = html;
        }
    }));
}