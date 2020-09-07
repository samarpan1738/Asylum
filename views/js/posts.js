// let likeIcon=document.('post__likes')
posts.forEach((post) => {
	let svg = document.getElementById(post._id).children[1].children[2]
		.children[0].children[0].children[0];
	if (post.isLiked) svg.classList.toggle("liked");
});

let postsElements = Array.from(document.getElementsByClassName("post"));
postsElements.forEach((postElement) => {
	postElement.onclick = (e) => {
		console.log(e.target);
		if (e.target.classList[0] == "likeBtn") {
			fetch(`/post/${postElement.id}/like`, {
				method: "GET",
			})
				.then(() => {
					window.location.href = window.location.href;
				})
				.catch((err) => {
					console.log("Error liking  the post");
				});
		} else {
			window.location.href = `/post/${postElement.id}`;
		}
	};
});
