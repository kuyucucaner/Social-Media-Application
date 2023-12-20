document.addEventListener('DOMContentLoaded', function () {
    const receivedRequestItems = document.querySelectorAll('.received-request-item');
  
    receivedRequestItems.forEach(function (item) {
      const createdAtDate = new Date(item.getAttribute('data-createdat'));
      const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
      const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(createdAtDate);
  
      // textContent kullanarak içeriği değiştirin
      item.textContent = `${item.textContent} - Alınan Tarih: ${formattedDate}`;
    });
  });
  