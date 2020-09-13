// let likeIcon=document.('post__likes')
let my_username = loggedInUser.username;
let activeNav = "nav-item-posts";

// Initially
$(".followers-tab").hide();
$(".following-tab").hide();

function setupBtn(user) {
	let followBtn = document.getElementById(user.username).children[1].children[0]
		.children[1];
	if (user.isFollowing) {
		followBtn.classList.add("is-following");
		followBtn.innerText = "Following";
	} else {
		followBtn.classList.add("not-following");
		followBtn.innerText = "Follow";
	}
	if (user.username === my_username) followBtn.remove();
}

function setupBtns() {
	users[0].followers.forEach((follower) => {
		let followBtn = document.querySelector(
			`.followers-tab .f_${follower._id} .follow-btn`
		);
		console.log(followBtn);
		if (follower.isFollowing) {
			followBtn.classList.toggle("is-following");
			followBtn.innerText = "Following";
		} else {
			followBtn.classList.toggle("not-following");
			followBtn.innerText = "Follow";
		}
		if (follower.isMe) followBtn.remove();
	});
	users[0].following.forEach((follower) => {
		let followBtn = document.querySelector(
			`following-tab .f_${follower._id} .follow-btn`
		);
		console.log(followBtn);
		if (follower.isFollowing) {
			followBtn.classList.toggle("is-following");
			followBtn.innerText = "Following";
		} else {
			followBtn.classList.toggle("not-following");
			followBtn.innerText = "Follow";
		}
		if (follower.isMe) followBtn.remove();
	});
}

users.forEach((user) => {
	setupBtn(user);
});

let profiles = Array.from(document.getElementsByClassName("profile"));
profiles.forEach((profile) => {
	profile.onclick = (e) => {
		console.log(e.target);
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
		} else if (e.target.classList == "profile__stats__followers") {
			showFollowers();
		} else if (e.target.classList == "profile__stats__following") {
			showFollowing();
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

// $(".profile__stats")
// 	.children()
// 	.each((idx, stats) => {
// 		stats.onclick = (e) => {
// 			let type = e.currentTarget.classList[0];
// 			if (type == "profile__stats__followers") {
// 				showFollowers();
// 			} else if (type == "profile__stats__following") {
// 				showFollowing();
// 			}
// 		};
// 	});

$(".nav-item").each((idx, btn) => {
	// console.log(btn);
	btn.onclick = (e) => {
		// console.log(e.currentTarget.classList);
		let clickedNav = e.currentTarget.classList[1];
		if (clickedNav == "nav-item-posts") {
			$(".posts").show();
			$(".followers-tab").hide();
			$(".following-tab").hide();
		} else if (clickedNav == "nav-item-followers") {
			$(".posts").hide();
			$(".followers-tab").show();
			$(".following-tab").hide();
		} else if (clickedNav == "nav-item-following") {
			$(".posts").hide();
			$(".followers-tab").hide();
			$(".following-tab").show();
		}
		$(`.${activeNav}`).toggleClass("nav-active");
		$(`.${clickedNav}`).toggleClass("nav-active");
		activeNav = clickedNav;
	};
	// btn = $(btn);
	// btn.hover(
	// 	() => {
	// 		$(".nav-active").toggleClass("nav-active");
	// 		btn.toggleClass("nav-active");
	// 		// if (btn.text() == "Following") btn.text("Unfollow");
	// 	},
	// 	() => {
	// 		$(".nav-active").toggleClass("nav-active");
	// 		$(`.${activeNav}`).toggleClass("nav-active");

	// 		// if (btn.text() == "Unfollow") btn.text("Following");
	// 	}
	// );
});

function showFollowers() {
	console.log("Show followers");
}
function showFollowing() {
	console.log("Show following");
}
