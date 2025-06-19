document.addEventListener('DOMContentLoaded', function() {
  // Get the submit button by its ID
  const submitButton = document.getElementById('btnSubmit');
  const clearAllButton = document.getElementById('btnClearAll');
  const tafmModal = new bootstrap.Modal(document.getElementById('tafmIndexModal'));
  const maxCapabilityScore = {
    TDC: 41, //Test design capability
    TDMC: 13, //Test data management capability
    TEC: 17, //Test execution capability
    TRC: 16, // Test reporting capability
    TFIC: 8, //Test Framework Integration capability
  };
  
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
    var tdmc_score = 0;
    var tdc_score = 0;
    var tec_score = 0;
    var trc_score = 0;
    var tfic_score = 0;

    results.forEach((result) => {
      let current_class = result.className;
      let current_value = parseInt(result.value);
      switch (current_class) {
        case "tdmc":
          tdmc_score += current_value;
          break;
        case "tdc":
          tdc_score += current_value;
          break;
        case "tec":
          tec_score += current_value;
          break;
        case "trc":
          trc_score += current_value;
          break;
        case "tfic":
          tfic_score += current_value;
          break;
        default:
          console.error("Unknown class:", current_class);
      }
    });
    //Print the maximum score for each class and the current score for each class
   /*  console.log(
      "Maximum Test Data Management Capability Score:",
      maxCapabilityScore.TDMC,
    );
    console.log("Your score:", tdmc_score);
    console.log(
      "Maximum Test Design Capability Score:",
      maxCapabilityScore.TDC,
    );
    console.log("Your score:", tdc_score);
    console.log(
      "Maximum Test Execution Capability Score:",
      maxCapabilityScore.TEC,
    );
    console.log("Your score:", tec_score);
    console.log(
      "Maximum Test Reporting Capability Score:",
      maxCapabilityScore.TRC,
    );
    console.log("Your score:", trc_score);
    console.log(
      "Maximum Test Framework Integration Capability Score:",
      maxCapabilityScore.TFIC,
    );
    console.log("Your score:", tfic_score);
    console.log("Overall TAFM Index:", 100);
    console.log(
      "Your TAFMIndex:",
      tdmc_score + tdc_score + tec_score + trc_score + tfic_score,
    ); */
    document.getElementById('finalResult').textContent =
      "Your TAFM Index is: " + (tdmc_score + tdc_score + tec_score + trc_score + tfic_score) + " out of 100.";
    
    // Show the modal
    tafmModal.show();
  });

  clearAllButton.addEventListener('click', function () {
    // Clear all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    
    // Navigate to page 1
    document.getElementById('pills-page1-tab').click();
  });
});


//next development
//upon closing modal, clear all selections and goto home page