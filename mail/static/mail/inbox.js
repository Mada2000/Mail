document.addEventListener('DOMContentLoaded', function () {

  function onbuttonclicked(email_id){
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  function onbuttonclicked_unarchive(email_id){
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').innerHTML = '';




  // When the form is submitted
  document.querySelector('#compose-form').onsubmit = () => {

    // Collect the data of the form
    const form_recipient = document.querySelector('#compose-recipients').value;
    const form_subject = document.querySelector('#compose-subject').value;
    const form_body = document.querySelector('#compose-body').value;

    // Post the mail using the API
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: form_recipient,
        subject: form_subject,
        body: form_body
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
      });

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

    return false;
  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // make an api call to get all the emails
  if (mailbox === 'inbox') {
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {

        // hide the email
        document.querySelector('#email-view').innerHTML = '';

        // Iterate on every email and add event listener to it    
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          element.addEventListener('click', function () {
            fetch(`/emails/${elemento.id}`)
              .then(response => response.json())
              .then(email => {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    read: true
                  })
                })
                // hide the other div's and show the email block
                document.querySelector('#email-view').innerHTML = '';
                document.querySelector('#emails-view').style.display = 'none';
                document.querySelector('#email-view').style.display = 'block';

                // create new div's for the email 
                const email_from = document.createElement('div');
                const email_to = document.createElement('div');
                const email_subject = document.createElement('div');
                const email_timestamp = document.createElement('div');
                const email_body = document.createElement('div');
                var button1 = document.createElement("button");
                var t = document.createTextNode("Click me");
                button1.appendChild(t);


                email_from.innerHTML = `From: ${email.sender}`;
                email_to.innerHTML = `To: ${email.recipients}`;
                email_subject.innerHTML = `Subject: ${email.subject}`;
                email_timestamp.innerHTML = `Timestamp: ${email.timestamp}`;
                email_body.innerHTML = email.body;

                document.querySelector('#email-view').append(email_from);
                document.querySelector('#email-view').append(email_to);
                document.querySelector('#email-view').append(email_subject);
                document.querySelector('#email-view').append(email_timestamp);
                document.querySelector('#email-view').append(email_body);
                document.querySelector('#email-view').append(button1);
                
                button1.onclick = function(){
                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                  })
                  load_mailbox("inbox")
                }
              });
          });
          document.querySelector('#emails-view').append(element);
        });

      });
  }
  if (mailbox === 'archive') {
    fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {
        document.querySelector('#email-view').innerHTML = '';

        // Iterate on every email and add event listener to it    
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          element.addEventListener('click', function () {
            fetch(`/emails/${elemento.id}`)
              .then(response => response.json())
              .then(email => {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    read: true
                  })
                })
                // hide the other div's and show the email block
                document.querySelector('#email-view').innerHTML = '';
                document.querySelector('#emails-view').style.display = 'none';
                document.querySelector('#email-view').style.display = 'block';

                // create new div's for the email 
                const email_from = document.createElement('div');
                const email_to = document.createElement('div');
                const email_subject = document.createElement('div');
                const email_timestamp = document.createElement('div');
                const email_body = document.createElement('div');
                var button1 = document.createElement("button");
                var t = document.createTextNode("Unarchive");
                button1.appendChild(t);


                email_from.innerHTML = `From: ${email.sender}`;
                email_to.innerHTML = `To: ${email.recipients}`;
                email_subject.innerHTML = `Subject: ${email.subject}`;
                email_timestamp.innerHTML = `Timestamp: ${email.timestamp}`;
                email_body.innerHTML = email.body;

                email_from.innerHTML = `From: ${email.sender}`;
                email_to.innerHTML = `To: ${email.recipients}`;
                email_subject.innerHTML = `Subject: ${email.subject}`;
                email_timestamp.innerHTML = `Timestamp: ${email.timestamp}`;
                email_body.innerHTML = email.body;

                document.querySelector('#email-view').append(email_from);
                document.querySelector('#email-view').append(email_to);
                document.querySelector('#email-view').append(email_subject);
                document.querySelector('#email-view').append(email_timestamp);
                document.querySelector('#email-view').append(email_body);
                document.querySelector('#email-view').append(button1);
                button1.onclick = function(){
                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                  })
                  load_mailbox("inbox")
                }
              });
          });
          document.querySelector('#emails-view').append(element);
        });

      });
  }
  if (mailbox === 'sent') {
    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        document.querySelector('#email-view').innerHTML = '';

        // Iterate on every email and add event listener to it    
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          element.addEventListener('click', function () {
            // get the email information with the api 
            fetch(`/emails/${elemento.id}`)
              .then(response => response.json())
              .then(email => {
                // hide the other div's and show the email block
                document.querySelector('#email-view').innerHTML = '';
                document.querySelector('#emails-view').style.display = 'none';
                document.querySelector('#email-view').style.display = 'block';

                // create new div's for the email 
                const email_from = document.createElement('div');
                const email_to = document.createElement('div');
                const email_subject = document.createElement('div');
                const email_timestamp = document.createElement('div');
                const email_body = document.createElement('div');

                email_from.innerHTML = `From: ${email.sender}`;
                email_to.innerHTML = `To: ${email.recipients}`;
                email_subject.innerHTML = `Subject: ${email.subject}`;
                email_timestamp.innerHTML = `Timestamp: ${email.timestamp}`;
                email_body.innerHTML = email.body;

                document.querySelector('#email-view').append(email_from);
                document.querySelector('#email-view').append(email_to);
                document.querySelector('#email-view').append(email_subject);
                document.querySelector('#email-view').append(email_timestamp);
                document.querySelector('#email-view').append(email_body);

              });
          });
          document.querySelector('#emails-view').append(element);
        });

      });
  }
}