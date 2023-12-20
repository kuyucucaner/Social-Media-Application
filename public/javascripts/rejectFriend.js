// rejectFriend.js

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.reject-friend-button').forEach(rejectButton => {
      rejectButton.addEventListener('click', function () {
        const requestId = this.getAttribute('data-requestid');
        rejectFriendRequest(requestId);
      });
    });
  });
  
  function rejectFriendRequest(requestId) {
    // fetch ile POST isteği gönderme
    fetch(`/rejectFriendRequest/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Arkadaşlık isteği reddedilirken bir hata oluştu.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        alert('Arkadaşlık isteği reddedildi!');
        window.location.href='/home'
      })
      .catch(error => {
        console.error('Error rejecting friend request:', error.message);
        alert('Arkadaşlık isteği reddedilirken bir hata oluştu.');
      });
  }
  