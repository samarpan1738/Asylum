let followBtn = document.getElementsByClassName("follow-btn")[0];

if (user.isMe) {
	followBtn.remove();
}
if (user.isFollowing) {
	followBtn.innerText = "Following";
	followBtn.classList.add("following");
} else {
	followBtn.innerText = "Follow";
	followBtn.classList.add("not-following");
}
followBtn.onclick = () => {
	let path = window.location.pathname + "/follow";
	fetch(path, { method: "GET" })
		.then(() => {
			window.location.href = `/user/${user.username}`;
		})
		.catch((error) => {
			console.error("Error:", error);
		});
};
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

