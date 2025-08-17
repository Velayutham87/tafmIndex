const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = 3000;

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});