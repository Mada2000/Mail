document.addEventListener('DOMContentLoaded', function () {

  
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

        // assign the email html to empty string
        document.querySelector('#email-view').style.display = 'none';

        // Iterate on every email and add event listener to it    
        emails.forEach(elemento => {
          let element = document.createElement('div');
          element.classList.add("d-flex");
          if(elemento.read === true){
            element.id = 'email_row_read';
          }else{
            element.id = 'email_row';
          }
          
          element.innerHTML = `<strong>${elemento.sender}</strong> <div id='email_row_subject'>${elemento.subject}</div>  <div id="email_row_timestamp">${elemento.timestamp}</div>`;
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
                const break_line = document.createElement('hr');
                const email_subject = document.createElement('div');
                const email_timestamp = document.createElement('div');
                const email_body = document.createElement('div');
                var button1 = document.createElement("button");
                var t1 = document.createTextNode("Achieve");
                button1.classList.add("btn");
                button1.classList.add("btn-sm");
                button1.classList.add("btn-outline-primary");
                var button2 = document.createElement("button"); 
                button2.classList.add("btn");
                button2.classList.add("btn-sm");
                button2.classList.add("btn-outline-primary");
                var t2 = document.createTextNode("Reply");
                button1.appendChild(t1);
                button2.appendChild(t2);

                // fill the divs with data and append them to the parent div 
                email_from.innerHTML = `<strong>From: </strong>${email.sender}`;
                email_to.innerHTML = `<strong>To: </strong>${email.recipients}`;
                email_subject.innerHTML = `<strong>Subject</strong>: ${email.subject}`;
                email_timestamp.innerHTML = `<div id='email_timestamp'><strong>Timestamp: </strong>${email.timestamp}</div>`;
                email_body.innerHTML = `<div id='email_body'>${email.body}</div>`;

                document.querySelector('#email-view').append(email_from);
                document.querySelector('#email-view').append(email_to);
                document.querySelector('#email-view').append(email_subject);
                document.querySelector('#email-view').append(email_timestamp);
                document.querySelector('#email-view').append(button1);
                document.querySelector('#email-view').append(button2);
                document.querySelector('#email-view').append(break_line);
                document.querySelector('#email-view').append(email_body);
                
                // when the button is clicked it puts the email in the achieved section
                button1.onclick = function(){
                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                    
                  })
                  // only when the fetch call completes execute the function to eliminate the the problem of not updating the inbox 
                  .then( response => {
                    load_mailbox('inbox')
                  })
                }


                // call the compose email function and fill the inputs fields with the sent email data
                button2.onclick = function(){
                  compose_email()
                  // set a variable to the first 3 characters in the subject string 
                  let email_subject = email.subject;
                  let first_three = email_subject.substring(0, 3);
                  
                  // If first three char's aren't Re: the add it to the beggining of the subject 
                  if(first_three === 'Re:'){
                    document.querySelector('#compose-subject').value = email.subject;
                  }else{
                    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
                  }
                  
                  // fill the body and the recipint with the email sender
                  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
                  document.querySelector('#compose-recipients').value = email.sender;
                  

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
        document.querySelector('#email-view').style.display = 'none';

        // Iterate on every email and add event listener to it    
        emails.forEach(elemento => {
          let element = document.createElement('div');
          element.classList.add("d-flex");
          if(elemento.read === true){
            element.id = 'email_row_read';
          }else{
            element.id = 'email_row';
          }
          element.innerHTML = `<strong>${elemento.sender}</strong> <div id='email_row_subject'>${elemento.subject}</div>  <div id="email_row_timestamp">${elemento.timestamp}</div>`;
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
                const break_line = document.createElement('hr');
                const email_to = document.createElement('div');
                const email_subject = document.createElement('div');
                const email_timestamp = document.createElement('div');
                const email_body = document.createElement('div');
                var button1 = document.createElement("button");
                var t1 = document.createTextNode("Unachieve");
                button1.classList.add("btn");
                button1.classList.add("btn-sm");
                button1.classList.add("btn-outline-primary");
                var button2 = document.createElement("button"); 
                button2.classList.add("btn");
                button2.classList.add("btn-sm");
                button2.classList.add("btn-outline-primary");
                var t2 = document.createTextNode("Reply");
                button1.appendChild(t1);
                button2.appendChild(t2);


                email_from.innerHTML = `<strong>From: </strong>${email.sender}`;
                email_to.innerHTML = `<strong>To: </strong>${email.recipients}`;
                email_subject.innerHTML = `<strong>Subject</strong>: ${email.subject}`;
                email_timestamp.innerHTML = `<div id='email_timestamp'><strong>Timestamp: </strong>${email.timestamp}</div>`;
                email_body.innerHTML = `<div id='email_body'>${email.body}</div>`;

                document.querySelector('#email-view').append(email_from);
                document.querySelector('#email-view').append(email_to);
                document.querySelector('#email-view').append(email_subject);
                document.querySelector('#email-view').append(email_timestamp);
                document.querySelector('#email-view').append(button1);
                document.querySelector('#email-view').append(button2);
                document.querySelector('#email-view').append(break_line);
                document.querySelector('#email-view').append(email_body);
                


                button1.onclick = function(){
                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                    
                  })
                  .then( response => {
                    load_mailbox('inbox')
                  })
                }

                // call the compose email function and fill the inputs fields with the sent email data
                button2.onclick = function(){
                  compose_email()
                  // set a variable to the first 3 characters in the subject string 
                  let email_subject = email.subject;
                  let first_three = email_subject.substring(0, 3);
                  
                  // If first three char's aren't Re: the add it to the beggining of the subject 
                  if(first_three === 'Re:'){
                    document.querySelector('#compose-subject').value = email.subject;
                  }else{
                    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
                  }
                  
                  // fill the body and the recipint with the email sender
                  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
                  document.querySelector('#compose-recipients').value = email.sender;
                  

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
          let element = document.createElement('div');
          element.classList.add("d-flex");
          element.id = 'email_row';
          element.innerHTML = `<strong>${elemento.sender}</strong> <div id='email_row_subject'>${elemento.subject}</div>  <div id="email_row_timestamp">${elemento.timestamp}</div>`;
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