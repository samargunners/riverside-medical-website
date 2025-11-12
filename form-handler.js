// Form Validation and Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('patientForm');
    
    if (form) {
        // Set today's date as default for signature date
        const signatureDateInput = document.getElementById('signatureDate');
        if (signatureDateInput) {
            const today = new Date().toISOString().split('T')[0];
            signatureDateInput.value = today;
        }

        // Phone number formatting
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = '(' + value;
                    } else if (value.length <= 6) {
                        value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
                    } else {
                        value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
                    }
                }
                e.target.value = value;
            });
        });

        // SSN formatting
        const ssnInput = document.getElementById('ssn');
        if (ssnInput) {
            ssnInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 5) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                    } else {
                        value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 9);
                    }
                }
                e.target.value = value;
            });
        }

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim() && field.type !== 'checkbox') {
                    isValid = false;
                    field.classList.add('error');
                } else if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill out all required fields marked with an asterisk (*).');
                return;
            }
            
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            // Process regular form fields
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Handle multiple values (like checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            
            // Log form data (in production, this would be sent to a server)
            console.log('Form Data:', data);
            
            // Show success message
            showSuccessMessage();
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error') && this.value.trim()) {
                    this.classList.remove('error');
                }
            });
        });
    }
});

function showSuccessMessage() {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h2>Registration Submitted Successfully!</h2>
            <p>Thank you for completing your patient registration form.</p>
            <p>We have received your information and will review it before your visit.</p>
            <p><strong>What's next?</strong></p>
            <ul>
                <li>Please bring a valid photo ID and insurance card to your appointment</li>
                <li>Arrive 15 minutes early for check-in</li>
                <li>Our staff will verify your information when you arrive</li>
            </ul>
            <button onclick="closeSuccessModal()" class="btn btn-primary">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
    
    // Optionally clear the form
    const form = document.getElementById('patientForm');
    if (form) {
        form.reset();
        // Reset signature date to today
        const signatureDateInput = document.getElementById('signatureDate');
        if (signatureDateInput) {
            const today = new Date().toISOString().split('T')[0];
            signatureDateInput.value = today;
        }
    }
}

// Print form functionality
function printForm() {
    window.print();
}

// Save as PDF functionality (browser print to PDF)
function saveAsPDF() {
    window.print();
}
