/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


window.onload = (event) => {

  var countsVostok = [
    [0.00, 2.21],
    [0.51, 1.63],
    [1.01, 1.43],
    [1.12, 1.46],
    [1.33, 1.77],
    [2.05, 1.61],
    [2.32, 1.33],
    [2.66, 1.29],
    [2.67, 1.35],
    [3.11, 1.34],
    [3.97, 1.46],
    [4.26, 1.27],
    [4.27, 1.73],
    [4.57, 1.92],
    [4.95, 1.41],
    [5.26, 2.60],
    [5.69, 1.74],
    [5.76, 1.57],
    [6.02, 1.76],
    [6.31, 1.93],
    [6.86, 1.42],
    [7.00, 1.61],
    [7.48, 1.73],
    [7.88, 1.36],
    [8.09, 1.23],
    [8.27, 2.19],
    [8.92, 1.67],
    [9.15, 1.57],
    [9.54, 1.20],
    [9.77, 1.35],
    [10.34, 1.36],
    [10.66, 1.66],
    [10.81, 1.70],
    [11.27, 1.52],
    [11.77, 1.51],
    [12.10, 1.63],
    [12.16, 1.91],
    [12.38, 1.83],
    [12.48, 2.24],
    [13.35, 2.14],
    [13.73, 1.85],
    [14.24, 1.62],
    [14.49, 1.73],
    [15.31, 1.42],
    [15.42, 1.80],
    [16.01, 1.69],
    [17.09, 1.68],
    [17.46, 1.25],
    [17.5, 1.35],
    [17.95, 1.71],
    [19.01, 1.62],
    [19.87, 1.73],
    [20.11, 2.25],
    [21.15, 1.78],
    [21.44, 2.12],
    [22.27, 2.20],
    [22.6, 1.54],
    [24.85, 1.79],
    [27.58, 2.36],
    [29.98, 1.90],
    [32.33, 2.65],
    [34.57, 1.82],
    [36.44, 2.05],
    [38.45, 2.42],
    [39.89, 2.19],
    [40.63, 3.25],
    [41.38, 2.94],
    [42.73, 2.72],
    [43.09, 1.86],
    [43.88, 1.96],
    [45.21, 2.65],
    [47.05, 1.72],
    [48.93, 1.55],
    [50.81, 1.95],
    [52.57, 1.66],
    [54.21, 2.02],
    [55.92, 1.99],
    [57.71, 2.26],
    [59.3, 2.05],
    [60.99, 1.61],
    [62.85, 1.82],
    [64.06, 2.40],
    [64.84, 3.21],
    [65.66, 2.07],
    [66.1, 2.00],
    [66.98, 1.50],
    [69.17, 1.55],
    [71.19, 2.29],
    [72.93, 2.57],
    [74.69, 2.80],
    [76.32, 1.62],
    [78.23, 1.86],
    [80.01, 1.48],
    [81.65, 1.52],
    [83.19, 1.82],
    [84.59, 1.98],
    [86.11, 2.26],
    [87.83, 1.77],
    [89.76, 2.00],
    [91.67, 1.73],
    [93.52, 2.39],
    [95.28, 2.38],
    [97.18, 2.05],
    [99.17, 2.07],
    [101.2, 1.80],
    [103.23, 1.77],
    [105.32, 2.32],
    [107.19, 1.46],
    [109.25, 2.54],
    [111.25, 2.21],
    [113.25, 1.94],
    [115.24, 2.14],
    [117.07, 2.53],
    [118.69, 1.69],
    [120.14, 1.68],
    [121.5, 1.83],
    [122.87, 1.70],
    [124.31, 1.68],
    [125.79, 1.80],
    [127.26, 1.50],
    [128.58, 2.20],
    [129.86, 1.44],
    [131.25, 1.93],
    [133.01, 2.22],
    [135.3, 2.51],
    [138.15, 2.04],
    [141.02, 1.62],
    [143.8, 1.51],
    [146.82, 1.20],
    [150.03, 1.55],
    [153.1, 1.37]
  ];

  let countsIn, countsOut;
  document.querySelector('#countsIn').addEventListener("input", (event) => {
//    countsIn = document.querySelector('#countsIn').innerText.split("\n").map(value => value.split(/\s+/).map(value2 => value2 ? parseFloat(value2): null))
    countsIn = document.querySelector('#countsIn').innerText.split("\n").map(line => {
      let values = line.match(/\s*(\S+)\s+(\S+)/);
      if (values)
        return [parseFloat(values[1]), parseFloat(values[2])]
    }).filter(value => value);

    countsOut = "<pre>" +
            countsIn.join("\n") +
            "</pre>";
    document.querySelector('#countsProcessed').innerHTML = countsOut;
    calculateGdft(countsIn);
  });

  const calculateGdft = (counts) => {
    let gdftMatrix = [[[]]],
            span = counts[counts.length - 1][0] - counts[0][0];
    const nNormalize = 1 / Math.sqrt(counts.length);

    for (let i = 0; i < counts.length; i++) {
      gdftMatrix[i] = [];
      for (let j = 0; j < counts.length; j++) {
        gdftMatrix[i][j] = [
          nNormalize * Math.cos(2 * Math.PI * i * counts[j][0] / span),
          -nNormalize * Math.sin(2 * Math.PI * i * counts[j][0] / span)
        ];
      }
    }

    let ortogonality = [[]], rowSum;
    let ortogonalityTable = "";
    let ortogonalityAmplitude;
    let ortogonalityAmplitudeColor;
    for (let i = 0; i < counts.length; i++) {
      ortogonality[i] = [];
      ortogonalityTable += `<tr>`;
      for (let j = 0; j < counts.length; j++) {
        ortogonality[i][j] = [0, 0];
        for (let k = 0; k < counts.length; k++) {
//        ortogonality[i][j] += (gdftMatrix[i][k][0] * gdftMatrix[i][k][0] +
//                gdftMatrix[i][k][1] * gdftMatrix[i][k][1]) *
//                (gdftMatrix[j][k][0] * gdftMatrix[j][k][0] +
//                gdftMatrix[j][k][1] * gdftMatrix[j][k][1]);
          ortogonality[i][j][0] += (gdftMatrix[i][k][0] * gdftMatrix[j][k][0] +
                  gdftMatrix[i][k][1] * gdftMatrix[j][k][1]);
          ortogonality[i][j][1] += (gdftMatrix[i][k][0] * gdftMatrix[j][k][1] -
                  gdftMatrix[i][k][1] * gdftMatrix[j][k][0]);
        }
//      ortogonality[i][j] < 0 && console.info('negative! ', i, " ", j);
//      ortogonality[i][j][0] = Math.sqrt(ortogonality[i][j][0]/Math.sqrt(counts.length);
        ortogonalityAmplitude = Math.sqrt(ortogonality[i][j][0] * ortogonality[i][j][0] + ortogonality[i][j][1] * ortogonality[i][j][1]);
        ortogonalityAmplitudeColor = Math.round(ortogonalityAmplitude * 255);
        ortogonalityTable += `<td style="background-color: rgba(${255 - ortogonalityAmplitudeColor},${ortogonalityAmplitudeColor}, 0, 1)">${ortogonality[i][j][0].toPrecision(1)} + ${ortogonality[i][j][1].toPrecision(1)}i</td>`;
//      gdftMatrix[i][j];
      }
      ortogonalityTable += `</tr>\n`;
    }
    let ortogonalityTableTable = document.querySelector('#ortogonalityTable');
    ortogonalityTableTable.innerHTML = "";
    let oTbody = document.createElement('tbody');
    oTbody.innerHTML = ortogonalityTable;
    ortogonalityTableTable.appendChild(oTbody);

    let frequencies = [];

    for (let i = 0; i < counts.length; i++) {
      frequencies[i] = [0, 0];
      for (let j = 0; j < counts.length; j++) {
        frequencies[i][0] += gdftMatrix[i][j][0] * counts[j][1];
        frequencies[i][1] += gdftMatrix[i][j][1] * counts[j][1];
      }
    }
    let outDiv = document.querySelector('#frequencies')
    console.info("frequencies ", frequencies);
    //outDiv.innerHTML = JSON.stringify(frequencies);

    let maxAmplitude = -Infinity;
    frequencies.map((value, index) => {
      let intensity = Math.sqrt(value[0] * value[0] + value[1] * value[1]);
      maxAmplitude = Math.max(maxAmplitude, intensity);
    });
    let frag = document.createDocumentFragment();
    frequencies.map((value, index) => {
      let span = document.createElement('div');
      let intensity = Math.sqrt(value[0] * value[0] + value[1] * value[1]);
      span.style.width = intensity / maxAmplitude * document.body.clientWidth + "px";
      span.style.height = "16px";
      span.style.border = "1px solid";
      span.style.backgroundColor = "lightgreen";
      span.innerHTML = counts[index][0] + "&nbsp;" + intensity.toPrecision(4);

      frag.appendChild(span);

    })
    let frequenciesBarsDiv = document.querySelector('#frequenciesBars');
    frequenciesBarsDiv.innerHTML = "";
    frequenciesBarsDiv.appendChild(frag);
  }
  calculateGdft(countsVostok);
}
