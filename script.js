function order(product){
const phone="254706230252"; // REPLACE
const msg=`Hello EDTECH SYSTEMS, Please arrange to deliver the ${product} as specified.`;
window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank');
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
