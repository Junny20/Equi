import * as tf from "@tensorflow/tfjs";

type ret = [unscaledPredictions: number[], trainingDataLength: number];

async function lstmmodel(data: number[], windowSize: number): Promise<ret> {
  const dataLength = data.length;
  const trainingDataLength = Math.floor(0.95 * dataLength);

  const min = Math.min(...data);
  const max = Math.max(...data);

  const scaledData = data.map((e: number) => (e - min) / (max - min));

  let x = [];
  let y = [];

  for (var i = windowSize; i < dataLength; i++) {
    x.push(scaledData.slice(i - windowSize, i));
    y.push(scaledData[i]);
  }

  const x3D: number[][][] = x.map((e) => e.map((v) => [v]));
  const y2D: number[][] = y.map((e) => [e]);

  const xTensor = tf.tensor3d(x3D);
  const yTensor = tf.tensor2d(y2D);

  const totalSamples = xTensor.shape[0];

  const model = tf.sequential();

  model.add(tf.layers.lstm({ units: 50, inputShape: [windowSize, 1] }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({
    loss: "meanSquaredError",
    optimizer: "adam",
  });

  await model.fit(
    xTensor.slice([0, 0, 0], [trainingDataLength, windowSize, 1]),
    yTensor.slice([0, 0], [trainingDataLength, 1]),
    { epochs: 5, batchSize: 16 }
  );
  const predictionsTensor = model.predict(
    xTensor.slice(
      [trainingDataLength, 0],
      [totalSamples - trainingDataLength, windowSize, 1]
    )
  ) as tf.Tensor;

  const predictionsArray: number[][] =
    (await predictionsTensor.array()) as number[][];
  const unscaledPredictions = predictionsArray.map(
    (p) => p[0] * (max - min) + min
  );
  //   const actualPrices = data.slice(trainingDataLength);
  //   console.log(
  //     "Length of lists:",
  //     actualPrices.length,
  //     unscaledPredictions.length
  //   );

  xTensor.dispose();
  yTensor.dispose();
  predictionsTensor.dispose();

  return [unscaledPredictions, trainingDataLength];
}

export default lstmmodel;
