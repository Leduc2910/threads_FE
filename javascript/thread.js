function getAllThread() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let html = ``
    axios.all([axios.get('http://localhost:8080/thread')]).then(axios.spread((threadResponse) => {
        let threads = threadResponse.data;
        for (let i = 0; i < threads.length; i++) {
            let diffTime = getTimeDiff(threads[i].create_at);
            html += `
            <div class="thread"">
                <div class="contain_avatar">
                    <img onclick="getProfile(${threads[i].user.id})" src="elements/${threads[i].user.avatar}" alt=""/>
                </div>
                <div class="contain_content">
                    <div class="content_top">
                        <div class="username_top"><button onclick="getProfile(${threads[i].user.id})">${threads[i].user.username}</button></div>
                        <div class="time"><span>${diffTime}</span></div>
                        <div class="option_thread"><i class="fa-solid fa-ellipsis" id="option_thread" onclick="openSettingPopup()"></i></div>
                        <div class="popup_setting_thread" id="popup_setting_thread">
                        <div class="thread_edit">
                        <button style="border-radius: 10px 10px 0 0">Chỉnh sửa</button>
</div>
                        <div class="thread_saved">
                        <button>Lưu</button>
</div>
                        <div class="thread_pin"><button>Ghim lên trang cá nhân</button></div>
                        <div class="thread_author"><button>Ai có thể trả lời</button></div>
                        <div class="thread_delete" ><button onclick="deleteThread(${threads[i].id})" style="border-radius: 0 0 10px 10px; color: red">Xóa</button></div></div>
                    </div>
                    <div class="content_middle" onclick="getDetailThread(${threads[i].id})">
                        <div class="content_text">
                        <span>${threads[i].content}</span>
                        </div>`
            if (threads[i].usedImageSet[0] != null) {
                html += `<div class="content_image"><img src="/elements/${threads[i].usedImageSet[0].source}"/></div>`
            }
            html += `</div>
                <div class="content_function">
                    <button id="liked_${threads[i].id}" onclick="likedPost(${threads[i].id})">`
            let isLiked = false;
            for (let j = 0; j < threads[i].likedSet.length; j++) {
                if (currentUser.id === threads[i].likedSet[j].user.id) {
                    isLiked = true;
                    break;
                }
            }
            if (isLiked) {
                html += `<i class="fa-solid fa-heart" style="color: #ff0000;font-size: 21px"></i>`;
            } else {
                html += `<i class="fa-regular fa-heart" style="font-size: 21px"></i>`;
            }
            html += `
                    </button>
                    <button onclick="openReplyModal(${threads[i].id})"><i class="fa-regular fa-comment" style="font-size: 21px"></i></button>
                    <button><i class="fa-solid fa-repeat" style="font-size: 19px"></i></button>
                    <button><i class="fa-regular fa-paper-plane" style="font-size: 19px"></i></button>
                </div>
                <div class="content_activity">
                    <span>${threads[i].commentSet.length}</span><span> thread trả lời</span>
                    <span>&nbsp·&nbsp</span>
                    <span id="totalLiked_${threads[i].id}">${threads[i].likedSet.length}</span><span> lượt thích</span>
                </div>
            </div>
            </div>
                        <hr>
                `
        }
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
    }));
}

function likedPost(threadID) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    axios.get(`
                http://localhost:8080/thread/${threadID}`).then(function (response) {
        let thread = response.data;
        let isLiked = false;
        let liked;
        for (let i = 0; i < thread.likedSet.length; i++) {
            if (currentUser.id === thread.likedSet[i].user.id) {
                isLiked = true;
                liked = thread.likedSet[i];
                break;
            }
        }
        if (isLiked) {
            axios.delete(`http://localhost:8080/liked/${liked.id}`).then(function (response) {
                document.getElementById(`totalLiked_${threadID}`).innerHTML = thread.likedSet.length - 1;
                updateLikeButton(threadID, isLiked)
            })
        } else {
            let newLike = {
                user: {
                    id: currentUser.id
                }
            }
            thread.likedSet.push(newLike)
            axios.put(`http://localhost:8080/thread/${thread.id}`, thread).then(function (response) {
                document.getElementById(`totalLiked_${threadID}`).innerHTML = thread.likedSet.length;
                updateLikeButton(threadID, isLiked)
            })
        }
    })
}

function updateLikeButton(threadID, isLiked) {
    const button = document.getElementById(`liked_${threadID}`);
    if (button) {
        button.innerHTML = !isLiked ? '<i class="fa-solid fa-heart" style="color: #ff0000;font-size: 21px"></i>' : '<i class="fa-regular fa-heart" style="font-size: 21px"></i>';
    }
}

function preImage(event) {
    const {files} = event.target;
    if (files.length > 0) {
        document.getElementById('postThread').style.backgroundColor = '#000000';
        document.getElementById('postThread').disabled = false;
    }
    let img = document.getElementById("create_img");
    if (img != null) {
        img.remove()
    }
    let preImage = document.createElement("img");
    preImage.id = 'create_img';
    preImage.src = `/elements/${files[0].name}`;
    document.getElementById('contain_create_img').appendChild(preImage);

}

function isInputContent() {
    let postButton = document.getElementById('postThread');
    let editableParagraph = document.getElementById('editableParagraph').innerHTML;
    if (editableParagraph.trim() === '') {
        postButton.style.backgroundColor = '#b2b2b2'
        postButton.disabled = true;
    } else {
        postButton.style.backgroundColor = '#000000'
        postButton.disabled = false;
    }
}

function isInputCommentContent() {
    let postButton = document.getElementById('postComment');
    let editableParagraph = document.getElementById('editComment').innerHTML;
    if (editableParagraph.trim() === '') {
        postButton.style.backgroundColor = '#b2b2b2'
        postButton.disabled = true;
    } else {
        postButton.style.backgroundColor = '#000000'
        postButton.disabled = false;
    }
}

function createThread() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let content = document.getElementById('editableParagraph').innerHTML;
    let usedImage = null;
    if (document.getElementById('create_img') != null) {
        let srcImage = document.getElementById('create_img').src;
        usedImage = srcImage.split("/").pop();
    }
    let thread;
    if (content.trim() !== '') {
        if (usedImage !== null) {
            thread = {
                user: {
                    id: currentUser.id
                }, content: content, usedImageSet: [{
                    source: usedImage
                }]
            }
        } else {
            thread = {
                user: {
                    id: currentUser.id
                }, content: content
            }
        }
    } else if (usedImage != null) {
        thread = {
            user: {
                id: currentUser.id
            }, content: content, usedImageSet: [{
                source: usedImage
            }]
        }

    }
    axios.post('http://localhost:8080/thread', thread).then(function (response) {
        getAllThread();
        closeModal();
    });
}

function getDetailThread(threadID) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let html = ``;
    axios.all([axios.get(`http://localhost:8080/thread/${threadID}`),]).then(axios.spread((threadResponse) => {
        let thread = threadResponse.data;
        console.log(thread)
        let diffTime = getTimeDiff(thread.create_at);
        html += `<div class="contain-thread">
            <div class="thread">
                <div class="contain_avatar">
                    <img onclick="getProfile(${thread.user.id})" src="elements/${thread.user.avatar}" alt=""/>
                </div>
                <div class="contain_content">
                    <div class="content_top">
                        <div class="username_top">
                            <button onclick="getProfile(${thread.user.id})">${thread.user.username}</button>
                        </div>
                        <div class="time"><span>${diffTime}</span></div>
                        <div class="option_thread"><i class="fa-solid fa-ellipsis" id="option_thread" onclick="openSettingPopup()"></i></div>
                        <div class="popup_setting_thread" id="popup_setting_thread">
                        <div class="thread_edit">
                        <button style="border-radius: 10px 10px 0 0">Chỉnh sửa</button>
</div>
                        <div class="thread_saved">
                        <button>Lưu</button>
</div>
                        <div class="thread_pin"><button>Ghim lên trang cá nhân</button></div>
                        <div class="thread_author"><button>Ai có thể trả lời</button></div>
                        <div class="thread_delete" ><button onclick="deleteThread(${thread.id})" style="border-radius: 0 0 10px 10px; color: red">Xóa</button></div></div>
                    </div>
                    <div class="content_middle">
                        <div class="content_text">
                            <span>${thread.content}</span>
                        </div>
                        <div class="content_image">`
        if (thread.usedImageSet.length !== 0) {
            html += `<img src="/elements/${thread.usedImageSet[0].source}"/>`
        }
        html += `</div>
                    </div>
                    <div class="content_function">
                        <button id="liked_${thread.id}" onclick="likedPost(${thread.id})">`
        let isLiked = false;
        for (let j = 0; j < thread.likedSet.length; j++) {
            if (currentUser.id === thread.likedSet[j].user.id) {
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
                        <button onclick="openReplyModal(${thread.id})"><i class="fa-regular fa-comment" style="font-size: 21px"></i></button>
                        <button><i class="fa-solid fa-repeat" style="font-size: 19px"></i></button>
                        <button><i class="fa-regular fa-paper-plane" style="font-size: 19px"></i></button>
                    </div>
                    <div class="content_activity">
                        <span>${thread.commentSet.length}</span><span> thread trả lời</span>
                        <span>&nbsp·&nbsp</span>
                        <span id="totalLiked_${thread.id}">${thread.likedSet.length}</span><span> lượt thích</span>
                    </div>
                </div>
            </div>
            <hr>
        </div><div class="contain-comment">
`
        for (let i = 0; i < thread.commentSet.length; i++) {
            let timeDiff = getTimeDiff(thread.commentSet[i].create_at);
            html += `<div class="comment">
                <div class="contain_avatar">
                    <img onclick="getProfile(${thread.commentSet[i].user.id})" src="elements/${thread.commentSet[i].user.avatar}" alt=""/>
                </div>
                <div class="contain_content">
                    <div class="content_top">
                        <div class="username_top">
                            <button onclick="getProfile(${thread.commentSet[i].user.id})">${thread.commentSet[i].user.username}</button>
                        </div>
                        <div class="time"><span>${timeDiff}</span></div>
                        <div class="option_thread"><i class="fa-solid fa-ellipsis"></i></div>
                    </div>
                    <div class="content_middle">
                        <div class="content_text">
                            <span>${thread.commentSet[i].content}</span>
                        </div>
                    </div>
                </div>
            </div>
<hr>`
        }
        html += `</div>`
        document.getElementById('main-content').innerHTML = html;
    }));
}

function postComment() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    axios.get(`http://localhost:8080/thread/${currentThreadID}`).then((response) => {
        let thread = response.data;
        let inputText = document.getElementById('editComment').innerHTML;
        let comment = {
            user: {
                id: currentUser.id
            },
            content: inputText
        }
        thread.commentSet.push(comment);
        axios.put(`http://localhost:8080/thread/${currentThreadID}`, thread).then((response) => {
            getDetailThread(currentThreadID);
            closeReplyModal();
        })
    })
}

function deleteThread(threadID) {
    axios.delete(`http://localhost:8080/thread/${threadID}`).then((response) => {
        openSettingPopup();
        getAllThread();
    })
}