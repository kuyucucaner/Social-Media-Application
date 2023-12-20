async function createComment(postId, contentText) {
    try {
      // Yorumu sunucuya gönder
      const response = await fetch('/createComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, contentText }),
      });
  
      const result = await response.json();
      console.log('result' ,result)
      if (result.message) {
        console.log(result.message);
        window.location.href='/post'
      } else {
        console.error('Comment creation failed:', result.errors);
        // Yorum oluşturma başarısız oldu, kullanıcıya bir hata mesajı gösterebilirsiniz.
      }
    } catch (error) {
      console.error('Error:', error);
      // İstek sırasında genel bir hata oluştu, kullanıcıya bir hata mesajı gösterebilirsiniz.
    }
  }
  
  function submitComment(postId) {
    const contentTextElement = document.getElementById(`contentText_${postId}`);
    console.log('Content Text Element:', contentTextElement);
  
    const contentText = contentTextElement.value.trim();
    console.log('Content Text:', contentText);
  
    if (!contentText) {
      console.error('Comment text cannot be empty!');
      return;
    }
  
    try {
      // Post ID ve contentText'i kullanarak yorumu oluştur
      createComment(postId, contentText);
    } catch (error) {
      console.error('Error during comment submission:', error);
    }
  }
  
  