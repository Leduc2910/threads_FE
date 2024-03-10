let pop_up = document.getElementById("popup_option");
let pop_up_button = document.getElementById("popup_button");
document.addEventListener("click", function (event) {
    let isClickInsidePopup = pop_up.contains(event.target);
    let isClickButton = pop_up_button.contains(event.target);
    if (!isClickInsidePopup && !isClickButton) {
        closePopup();
    }
});

function openPopup() {
    pop_up.classList.add("open_popup");
}

function closePopup() {
    pop_up.classList.remove("open_popup");
}



function openSettingPopup() {
    let setting_popup = document.getElementById('popup_setting_thread');
    if (setting_popup.classList.contains('open_popup_setting_thread')) {
        setting_popup.classList.remove("open_popup_setting_thread");
    } else {
        setting_popup.classList.add("open_popup_setting_thread");
    }

}

const modalElement = document.getElementById("modal_create");
const newThreadElement = document.getElementById("new_thread");
const navCreate = document.getElementById("navCreate");
document.addEventListener("click", function (event) {
    let isClickInsideModal = newThreadElement.contains(event.target);
    let isClickInNavCreate = navCreate.contains(event.target);
    if (!isClickInsideModal && !isClickInNavCreate) {
        closeModal();
    }
});

function openModal() {
    modalElement.classList.add("open_modal_create")
    document.body.classList.add("turn-off-scroll");
}

function closeModal() {
    document.getElementById('editableParagraph').innerHTML = '';
    if (document.getElementById('create_img') != null) {
        document.getElementById('create_img').remove();
    }
    modalElement.classList.remove("open_modal_create")
    document.body.classList.remove("turn-off-scroll");
    document.getElementById('postThread').style.backgroundColor = '#b2b2b2';
    document.getElementById('postThread').disabled = true;
}

const modalFollow = document.getElementById("modal_follow");

function openFollowModal() {
    modalFollow.classList.add("open_modal_follow")
    document.body.classList.add("turn-off-scroll");
}

function closeFollowModal() {
    modalFollow.classList.remove("open_modal_follow")
    document.body.classList.remove("turn-off-scroll");
}

const modalReply = document.getElementById("modal_reply");
let currentThreadID;

function openReplyModal(threadId) {
    currentThreadID = threadId;
    modalReply.classList.add("open_modal_reply")
    document.body.classList.add("turn-off-scroll");
}

function closeReplyModal() {
    currentThreadID = null;
    document.getElementById('editComment').innerHTML = '';
    modalReply.classList.remove("open_modal_reply");
    document.body.classList.remove("turn-off-scroll");
    document.getElementById('postComment').style.backgroundColor = '#b2b2b2';
    document.getElementById('postComment').disabled = true;
}

let preProfile;

function getTimeDiff(createTime) {
    let currentTime = new Date().getTime();
    let postTime = new Date(createTime).getTime();
    let diffTimeInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (diffTimeInSeconds >= 86400) {
        return Math.floor(diffTimeInSeconds / 86400) + ' ngày';
    } else if (diffTimeInSeconds >= 3600) {
        return Math.floor(diffTimeInSeconds / 3600) + ' giờ';
    } else if (diffTimeInSeconds >= 60) {
        return Math.floor(diffTimeInSeconds / 60) + ' phút';
    } else {
        return diffTimeInSeconds + ' giây';
    }
}


