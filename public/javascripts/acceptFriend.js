document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.accept-friend-button').forEach(button => {
      button.addEventListener('click', function () {
        const requestId = this.getAttribute('data-requestid');
        acceptFriendRequest(requestId);
      });
    });
  });
  
  function acceptFriendRequest(requestId) {
    // fetch ile POST isteği gönderme
    fetch(`/acceptFriendRequest/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Arkadaşlık isteği kabul edilirken bir hata oluştu.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        alert('Arkadaşlık isteği kabul edildi!');
        window.location.href='/home'

      })
      .catch(error => {
        console.error('Error accepting friend request:', error.message);
        alert('Arkadaşlık isteği kabul edilirken bir hata oluştu.');
      });
  }
  