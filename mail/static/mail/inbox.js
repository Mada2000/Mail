document.addEventListener('DOMContentLoaded', function() {

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
  if(mailbox === 'inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {

        // Iterate on every email and display it      
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          document.querySelector('#emails-view').append(element);
        });
        
    });
  }
  if(mailbox === 'archive'){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {

        // Iterate on every email and display it      
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          document.querySelector('#emails-view').append(element);
        });
        
    });
  }
  if(mailbox === 'sent'){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {

        // Iterate on every email and display it      
        emails.forEach(elemento => {
          const element = document.createElement('div');
          element.innerHTML = `${elemento.sender}  ${elemento.subject}  ${elemento.body}`;
          document.querySelector('#emails-view').append(element);
        });
        
    });
  }
}