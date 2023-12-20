async function likePost(postId, userId) {
  try {
    const response = await fetch('/createLike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, userId }),
    });

    const result = await response.json();

    if (result.error) {
      console.error(result.error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      return;
    }

    if (result.success) {
      alert('Like added successfully.');
      console.log('Like added successfully');
      location.reload();
    } else {
      alert('Post already liked by the user.');
      console.log('Post already liked by the user');
    }
  } catch (error) {
    console.error(error);
  }
}
