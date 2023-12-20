// getComments.js
async function getCommentsForPost(postId) {
    try {
        const response = await fetch(`/getCommentsForPost/${postId}`);
        const result = await response.json();

        if (result.comments) {
            const commentsContainer = document.getElementById(`commentsContainer${postId}`);
            
            // Yorumları HTML içinde göster
            commentsContainer.innerHTML = '<h3>Comments:</h3>';
            const commentsList = document.createElement('ul'); // Yorumları içeren bir <ul> elementi oluştur
            result.comments.forEach(comment => {
                const commentItem = document.createElement('li'); // Her yorum için bir <li> elementi oluştur
                commentItem.textContent = comment.ContentText; // <li> içeriğine yorumu ekle
                commentsList.appendChild(commentItem); // <ul> içine <li> ekle
            });
            commentsContainer.appendChild(commentsList); // Yorumları içeren <ul> elementini <div> içine ekle
        }
    } catch (error) {
        console.error(error);
    }
}
