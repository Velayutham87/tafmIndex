document.addEventListener('DOMContentLoaded', function () {
  // Get the submit button by its ID
  const submitButton = document.getElementById('btnSubmit');
  const clearAllButton = document.getElementById('btnClearAll');
  const tafmModal = new bootstrap.Modal(document.getElementById('tafmIndexModal'));
  const showMoreDetails = document.getElementById('btnShowMoreDetails');
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  let capabilityWiseScores = null; // Store latest scores here

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

    fetch('/api/gettafmindex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        results: results
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(data => {
        const { tafmIndex, capabilityWiseScores: scores } = data;
        document.getElementById('finalResult').textContent =
          "Your TAFM Index is: " + tafmIndex + " out of 100.";
        capabilityWiseScores = scores; // Store the scores for later use
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

    // Show the modal
    tafmModal.show();
  });

  // Enable buttons when any radio is selected
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', function () {
      submitButton.disabled = false;
      clearAllButton.disabled = false;
    });
  });

  clearAllButton.addEventListener('click', function () {
    // Clear all radio buttons
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    // Disable buttons again
    submitButton.disabled = true;
    clearAllButton.disabled = true;
    // Navigate to page 1
    document.getElementById('pills-page1-tab').click();
  });

  showMoreDetails.addEventListener('click', function () {
    fetch('api/showmoredetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        capabilityWiseScores: capabilityWiseScores
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      const { tafmIndex, capabilityWiseScores, detailsHtml } = data;
      // Expand and update the modal body
      const finalResult = document.getElementById('finalResult');
      console.log('detailsHTML: ', detailsHtml);
      finalResult.innerHTML =
        "Your TAFM Index is: " + (capabilityWiseScores.tdmc_score + capabilityWiseScores.tdc_score + capabilityWiseScores.tec_score + capabilityWiseScores.trc_score + capabilityWiseScores.tfic_score) + " out of 100." +
        detailsHtml;
      // Toggle button text
      if (showMoreDetails.textContent.trim() === "Show more details") {
        showMoreDetails.textContent = "Show less details";
      }
      else {
        showMoreDetails.textContent = "Show more details";
        // Optionally, collapse details if you want
        finalResult.innerHTML = "Your TAFM Index is: " + tafmIndex + " out of 100.";
      }
    });
  })
});