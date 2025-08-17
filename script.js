document.addEventListener('DOMContentLoaded', function() {
  // Get the submit button by its ID
  const submitButton = document.getElementById('btnSubmit');
  const clearAllButton = document.getElementById('btnClearAll');
  const tafmModal = new bootstrap.Modal(document.getElementById('tafmIndexModal'));
  const showMoreDetails = document.getElementById('btnShowMoreDetails');
  const maxCapabilityScore = {
    TDC: 38, //Test design capability
    TDMC: 14, //Test data management capability
    TEC: 17, //Test execution capability
    TRC: 16, // Test reporting capability
    TFIC: 15, //Test Framework Integration capability
  };

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

    fetch('https://tafmindex.xyz/api/gettafmindex', {
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
      const { tafmIndex, capabilityWiseScores } = data;
      document.getElementById('finalResult').textContent =
        "Your TAFM Index is: " + tafmIndex + " out of 100.";
      capabilityWiseScores = capabilityWiseScores; // Store the scores for later use
      // Update the modal with the scores 
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  
    // Show the modal
    tafmModal.show();
  });

  // Enable buttons when any radio is selected
  const radioButtons = document.querySelectorAll('input[type="radio"]');
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
    // Use the stored scores
    if (!capabilityWiseScores) {
      console.error("No scores available. Please submit first.");
      return;
    }
    const { tdmc_score, tdc_score, tec_score, trc_score, tfic_score } = capabilityWiseScores;
    // Prepare details as HTML
    const detailsHtml = `
      <hr>
      <div class="text-start">
        <strong>Test Data Management Capability:</strong> ${tdmc_score} / ${maxCapabilityScore.TDMC} 
        (${((tdmc_score / maxCapabilityScore.TDMC) * 100).toFixed(1)}%)<br>
        <strong>Test Design Capability:</strong> ${tdc_score} / ${maxCapabilityScore.TDC} 
        (${((tdc_score / maxCapabilityScore.TDC) * 100).toFixed(1)}%)<br>
        <strong>Test Execution Capability:</strong> ${tec_score} / ${maxCapabilityScore.TEC} 
        (${((tec_score / maxCapabilityScore.TEC) * 100).toFixed(1)}%)<br>
        <strong>Test Reporting Capability:</strong> ${trc_score} / ${maxCapabilityScore.TRC} 
        (${((trc_score / maxCapabilityScore.TRC) * 100).toFixed(1)}%)<br>
        <strong>Test Framework Integration Capability:</strong> ${tfic_score} / ${maxCapabilityScore.TFIC} 
        (${((tfic_score / maxCapabilityScore.TFIC) * 100).toFixed(1)}%)<br>
        <strong>Overall TAFM Index:</strong> ${tdmc_score + tdc_score + tec_score + trc_score + tfic_score} / 100
      </div>
    `;
    // Expand and update the modal body
    const finalResult = document.getElementById('finalResult');
    finalResult.innerHTML = 
      "Your TAFM Index is: " + (tdmc_score + tdc_score + tec_score + trc_score + tfic_score) + " out of 100." +
      detailsHtml;
    // Toggle button text
   if(showMoreDetails.textContent.trim() === "Show more details") {
      showMoreDetails.textContent = "Show less details";
    }
    else {
      showMoreDetails.textContent = "Show more details";
      // Optionally, collapse details if you want
      finalResult.innerHTML = "Your TAFM Index is: " + (tdmc_score + tdc_score + tec_score + trc_score + tfic_score) + " out of 100.";
    }
  });
});