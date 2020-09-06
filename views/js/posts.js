// let likeIcon=document.('post__likes')
posts.forEach((post) => {
	let svg = document.getElementById(post._id).children[1].children[2]
		.children[0].children[0].children[0];
	if (post.isLiked) svg.classList.toggle("liked");
	
});
