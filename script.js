function order(product){
  // populate and show the order modal so user can provide contact details
  const modal = document.getElementById('orderModal');
  if(!modal) return window.alert('Order form not available');
  document.getElementById('orderProduct').value = product || '';
  // set a helpful placeholder message
  document.getElementById('orderMessage').placeholder = `Please include any extra details for your ${product}`;
  modal.setAttribute('aria-hidden','false');
  const nameField = document.getElementById('orderName');
  if(nameField) nameField.focus();
}

function closeOrderModal(){
  const modal = document.getElementById('orderModal');
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
}

function toggleMenu(){
  document.querySelector("nav").classList.toggle("active");
}

// AJAX submit handler for the contact form (works with Formspree)
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    // simple client-side validation
    if(!form.checkValidity()){
      status.textContent = 'Please fill out the required fields.';
      status.style.color = 'tomato';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';

    try{
      const formData = new FormData(form);
      const resp = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if(resp.ok){
        form.reset();
        status.style.color = 'limegreen';
        status.textContent = 'Thanks — your message was sent. We will get back to you shortly.';
      } else {
        const data = await resp.json().catch(()=>({}));
        status.style.color = 'tomato';
        status.textContent = data.error || 'Oops — there was a problem sending your message.';
      }
    } catch(err){
      status.style.color = 'tomato';
      status.textContent = 'Network error — please try again later.';
    } finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
      // hide status after a short while
      setTimeout(()=>{ status.textContent = ''; }, 8000);
    }
  });
});

// Order form handling: send to Formspree and open WhatsApp with a prefilled message
document.addEventListener('DOMContentLoaded', function(){
  const orderForm = document.getElementById('orderForm');
  if(!orderForm) return;
  const status = document.getElementById('order-status');
  const businessPhone = '254706230252'; // your WhatsApp number (no +)

  orderForm.addEventListener('submit', async function(e){
    e.preventDefault();
    // basic validation
    const name = document.getElementById('orderName').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    const location = document.getElementById('orderLocation').value.trim();
    const product = document.getElementById('orderProduct').value.trim();
    const message = document.getElementById('orderMessage').value.trim();

    if(!name || !phone){
      status.textContent = 'Please provide your name and phone number.';
      status.style.color = 'tomato';
      return;
    }

    const submitBtn = orderForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    status.textContent = '';

    // Build WhatsApp message
    const waMsg = `Order: ${product}\nName: ${name}\nPhone: ${phone}${email?'\nEmail: '+email:''}${location? '\nLocation: '+location: ''}${message? '\nNotes: '+message: ''}`;

    // Try to send to Formspree (orderForm.action should be set to your Formspree endpoint)
    try{
      const formData = new FormData(orderForm);
      // add a simple timestamp
      formData.append('timestamp', new Date().toISOString());
      const resp = await fetch(orderForm.action, {
        method: 'POST',
        body: formData,
        headers: {'Accept':'application/json'}
      });

      if(resp.ok){
        status.style.color = 'limegreen';
        status.textContent = 'Order sent by email. Opening WhatsApp...';
      } else {
        status.style.color = 'tomato';
        status.textContent = 'Email failed to send, but opening WhatsApp so you can message us.';
      }
    } catch(err){
      status.style.color = 'tomato';
      status.textContent = 'Network problem sending email — opening WhatsApp so you can message us.';
    } finally{
      // Open WhatsApp so the user can send the prefilled message from their phone
      window.open(`https://wa.me/${businessPhone}?text=${encodeURIComponent(waMsg)}`,'_blank');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send order & Open WhatsApp';
      // reset the form and close modal after a short delay
      setTimeout(()=>{
        orderForm.reset();
        status.textContent = '';
        closeOrderModal();
      }, 1800);
    }
  });
});
