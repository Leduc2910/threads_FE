function getAllThread() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let html = ``
    axios.all([
        axios.get('http://localhost:8080/thread'),
        axios.get('http://localhost:8080/liked')
    ]).then(axios.spread((threadResponse, likedResponse) => {
        let threads = threadResponse.data;
        let likedSet = likedResponse.data;
        for (let i = 0; i < threads.length; i++) {
            let diffTime = getTimeDiff(threads[i].create_at);
            html += `

            <div class="thread">
                <div class="contain_avatar">
                    <img src="elements/${threads[i].user.avatar}" alt=""/>
                </div>
                <div class="contain_content">
                    <div class="content_top">
                        <div class="username_top"><a href="#">${threads[i].user.username}</a></div>
                        <div class="time"><span>${diffTime}</span></div>
                        <div class="option_thread"><i class="fa-solid fa-ellipsis"></i></div>
                    </div>
                    <div class="content_middle">
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
                    <button><i class="fa-regular fa-comment" style="font-size: 21px"></i></button>
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
        }
    )
}

function updateLikeButton(threadID, isLiked) {
    const button = document.getElementById(`liked_${threadID}`);
    if (button) {
        button.innerHTML = !isLiked
            ? '<i class="fa-solid fa-heart" style="color: #ff0000;font-size: 21px"></i>'
            : '<i class="fa-regular fa-heart" style="font-size: 21px"></i>';
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
                },
                content: content,
                usedImageSet: [{
                    source: usedImage
                }]
            }
        } else {
            thread = {
                user: {
                    id: currentUser.id
                },
                content: content
            }
        }
    } else if (usedImage != null) {
        thread = {
            user: {
                id: currentUser.id
            },
            content: content,
            usedImageSet: [{
                source: usedImage
            }]
        }

    }
    axios.post('http://localhost:8080/thread', thread).then(function (response) {
        getAllThread();
        closeModal();
    });
}