// let likeIcon=document.('post__likes')
let my_username = loggedInUser.username;
users.forEach((user) => {
	let followBtn = document.getElementById(user.username).children[1].children[0]
		.children[1];
	if (user.isFollowing) {
		followBtn.classList.add("following");
		followBtn.innerText = "Following";
	} else {
		followBtn.classList.add("not-following");
		followBtn.innerText = "Follow";
	}
	if (user.username === my_username) followBtn.remove();
	// if (post.isLiked) svg.classList.toggle("liked");
});

let profiles = Array.from(document.getElementsByClassName("profile"));
profiles.forEach((profile) => {
	profile.onclick = (e) => {
		if (e.target.classList[0] == "follow-btn") {
			fetch(`/user/${profile.id}/follow`, {
				method: "GET",
			})
				.then(() => {
					window.location.href = window.location.href;
				})
				.catch((err) => {
					// console.log("Error following the user");
				});
		} else {
			window.location.href = `/user/${profile.id}`;
		}
	};
});

$(".follow-btn").each((idx, btn) => {
	btn = $(btn);
	btn.hover(
		() => {
			if (btn.text() == "Following") btn.text("Unfollow");
		},
		() => {
			if (btn.text() == "Unfollow") btn.text("Following");
		}
	);
});
