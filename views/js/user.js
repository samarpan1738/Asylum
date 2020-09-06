let followBtn = document.getElementById("follow-btn");

if (user.isMe) {
	followBtn.remove();
}
if (user.isFollowing) {
	followBtn.innerText = "Following";
	followBtn.classList.add("following");
}
followBtn.onclick = () => {
	let path = window.location.pathname + "/follow";
	fetch(path, { method: "GET" }).then((response) => {
		// response.json();
		console.log(response);
	});
	// .then((data) => {
	// console.log("Success:", data);
	//  TODO: Change followBtn style
	followBtn.classList
		.add("following")
		// })
		.catch((error) => {
			console.error("Error:", error);
		});
};
$("#follow-btn").hover(
	() => {
		if ($("#follow-btn").text() == "Following")
			$("#follow-btn").text("Unfollow");
	},
	() => {
		if ($("#follow-btn").text() == "Unfollow")
			$("#follow-btn").text("Following");
	}
);
