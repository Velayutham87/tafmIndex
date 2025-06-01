document.addEventListener('DOMContentLoaded', function() {
  // Get the submit button by its ID
  const submitButton = document.getElementById('btnSubmit');
  
  // Add a click event listener to the submit button
  submitButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission
    const results = [];
    const questions = document.querySelectorAll('fieldset');
    questions.forEach((question, index) => {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      if (selectedOption) {
        const className = selectedOption.className;
        const value = selectedOption.value;
        results.push(Object.assign({}, {
          question: index + 1,
          className,
          value
        }));
      }
    });
    console.log(results);
  });
});


