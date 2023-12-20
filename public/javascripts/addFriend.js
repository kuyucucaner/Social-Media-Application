document.addEventListener('DOMContentLoaded', function () {
  // Butona tıklandığında arkadaşlık isteği gönderme işlemi
  document.querySelectorAll('.add-friend-button').forEach(button => {
    button.addEventListener('click', function () {
      // Alıcı kullanıcının ID'sini öznitelikten al
      const receiverUserId = this.getAttribute('data-userid');
      // Arkadaşlık isteğini gönderme işlemi
      console.log('receiver : ' , receiverUserId);
      sendFriendRequest(receiverUserId);
    });
  });
});

  // Arkadaşlık isteği gönderme işlemi
  function sendFriendRequest(receiverUserId) {

    const senderUserId = getLoggedInUserId(); // Örnek: Oturum açmış kullanıcının ID'sini alır
    console.log('sender : ' , senderUserId);
    // Gönderilecek veriyi oluştur
    const requestData = {
      receiverUserId: receiverUserId,
      senderUserId: senderUserId
    };
  
    // fetch ile POST isteği gönderme
    fetch('/sendFriendRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Arkadaşlık isteği gönderilirken bir hata oluştu.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        alert('Arkadaşlık isteği gönderildi!');
        window.location.href='/home'

      })
      .catch(error => {
        console.error('Error sending friend request:', error.message);
        alert('Arkadaşlık isteği gönderilirken bir hata oluştu.');
      });
  }
  function getLoggedInUserId() {
    const idCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('id='));

    if (!idCookie) {
      console.error('ID çerezi bulunamadı.');
      return null;
    }

    const idValue = idCookie.split('=')[1];
    console.log('User ID:', idValue);
    return idValue;
}
  
  