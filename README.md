## Schema Design

---

- User

  - displayName - **String**
  - username - **String**
  - email - **String**
  - password - **String**
  - displayPic - **String**
  - followers - **[ User ]**
  - following - **[ User ]**
  - posts - **[ Post ]**
  - followerCount - **Number**
  - followingCount - **Number**
  - postsCount - **Number**

- Post

  - author - **User**
  - content - **String**
  - likes - **[ User ]**
  - likes - **[ User ]**
  - comments - **[ Comment ]**
  - commentCount - **Number**

- Comment
  - author - **User**
  - post - **Post**
  - likes - **[ User ]**
  - likeCount - **Number**

## API Routes

---

- / auth
  - / login - **GET & POST**
  - / signup - **GET & POST**
  - / logout - **GET**
- / user
  - / - GET
  - / :username - **GET**
  - / :username / follow - **GET**
- / post
  - / - **GET & POST**
  - / :postId - **GET**
  - / :postId / like - **GET**
  - / :postId / comment - **POST**
  - / :postId / comment / :commentId / like - **GET**
