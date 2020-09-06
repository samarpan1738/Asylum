// let likeIcon=document.('post__likes')
let my_id = user._id;
users.forEach((user) => {
	let followBtn = document.getElementById(user._id).children[1].children[0]
		.children[1];
	if (user.isFollowing) {
		followBtn.classList.add("following");
		followBtn.innerText = "Following";
	}
	if (user._id === my_id) followBtn.remove();
	// if (post.isLiked) svg.classList.toggle("liked");
});
