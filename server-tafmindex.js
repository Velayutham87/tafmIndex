const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = 3000;

const maxCapabilityScore = {
  TDC: 38, //Test design capability
  TDMC: 14, //Test data management capability
  TEC: 17, //Test execution capability
  TRC: 16, // Test reporting capability
  TFIC: 15, //Test Framework Integration capability
};

app.post('/api/gettafmindex', (req, res) => {
    const results = req.body.results;
let tdmc_score = 0, tdc_score = 0, tec_score = 0, trc_score = 0, tfic_score = 0;

  results.forEach(result => {
    const current_class = result.className;
    const current_value = parseInt(result.value, 10);
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
        // Unknown class, ignore or log
        break;
    }
  });

  const tafmIndex = tdmc_score + tdc_score + tec_score + trc_score + tfic_score;

  res.json({
    tafmIndex,
    capabilityWiseScores: {
      tdmc_score,
      tdc_score,
      tec_score,
      trc_score,
      tfic_score
    }
  });    
})

app.post('/api/showmoredetails', (req, res) => {
  const capabilityWiseScores = req.body.capabilityWiseScores;
  if (!capabilityWiseScores) {
    res.status(400).json({ error: "No scores available. Please submit first." });
    return;
  }
  const { tdmc_score, tdc_score, tec_score, trc_score, tfic_score } = capabilityWiseScores;

  // Prepare details as HTML string
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

  res.json({
    tafmIndex: tdmc_score + tdc_score + tec_score + trc_score + tfic_score,
    capabilityWiseScores: {
      tdmc_score,
      tdc_score,
      tec_score,
      trc_score,
      tfic_score
    },
    detailsHtml
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});