// let likeIcon=document.('post__likes')
posts.forEach((post) => {
	let svg = document.querySelector(`#p_${post._id} .likeBtn`);
	if (post.isLiked) svg.classList.toggle("liked");
});

const comments = posts[0].comments;
comments.forEach((comment) => {
	let svg = document.querySelector(`#c_${comment._id} .likeBtn`);
	if (comment.isLiked) svg.classList.toggle("liked");
});

let postsElements = Array.from(document.querySelectorAll(".posts .post"));
postsElements.forEach((postElement) => {
	postElement.onclick = (e) => {
		console.log(e.target);
		let post_id = postElement.id.split("_")[1];
		if (e.target.classList[0] == "likeBtn") {
			// console.log("Like btn clicked");
			// * Change likBtn style
			document
				.querySelector(`#p_${post_id} .likeBtn`)
				.classList.toggle("liked");
			fetch(`/post/${post_id}/like`, {
				method: "GET",
			})
				.then((res) => {
					// console.log(res);
					return res.json();
				})
				.then((data) => {
					// console.log(data);
					if (data.data === "liked") likePost(post_id);
					else if (data.data === "unliked") unlikePost(post_id);
				})
				.catch((err) => {
					// console.log("Error liking  the post");
				});
		} else {
			window.location.href = `/post/${post_id}`;
		}
	};
});

function likePost(post_id) {
	// document.querySelector(`#p_${post_id} .likeBtn`).classList.toggle("liked");
	let likesCounter = document.querySelector(`#p_${post_id} .post__like-count`);
	likesCounter.innerText = parseInt(likesCounter.innerText) + 1;
}
function unlikePost(post_id) {
	// document.querySelector(`#p_${post_id} .likeBtn`).classList.toggle("liked");
	let likesCounter = document.querySelector(`#p_${post_id} .post__like-count`);
	likesCounter.innerText = parseInt(likesCounter.innerText) - 1;
}
