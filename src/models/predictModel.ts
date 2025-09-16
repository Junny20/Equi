import * as tf from "@tensorflow/tfjs";

async function predictModel(
  data: number[],
  windowSize: number,
  futureDataPoints?: number
): Promise<number[]> {
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

  console.log("Length of scaled data:", dataLength);

  const x3D: number[][][] = x.map((e) => e.map((v) => [v]));
  const y2D: number[][] = y.map((e) => [e]);

  const xTensor = tf.tensor3d(x3D);
  const yTensor = tf.tensor2d(y2D);

  const totalSamples = xTensor.shape[0];
  const trainingSamples = Math.floor(0.95 * totalSamples);
  console.log("training samples:", trainingSamples);
  console.log("total samples:", totalSamples);

  const model = tf.sequential();

  model.add(tf.layers.lstm({ units: 50, inputShape: [windowSize, 1] }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({
    loss: "meanSquaredError",
    optimizer: "adam",
  });

  await model.fit(
    xTensor.slice([0, 0, 0], [trainingSamples, windowSize, 1]),
    yTensor.slice([0, 0], [trainingSamples, 1]),
    {
      epochs: 5,
      batchSize: 16,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`);
        },
      },
    }
  );
  //   const predictionsTensor = model.predict(
  //     xTensor.slice(
  //       [trainingSamples, 0, 0],
  //       [totalSamples - trainingSamples, windowSize, 1]
  //     )
  //   ) as tf.Tensor;

  for (var i = 0; i < (futureDataPoints || 50); i++) {
    const scaledDataLength = scaledData.length;
    const lastWindow = scaledData.slice(scaledDataLength - windowSize);
    const lastWindow3D = lastWindow.map((e) => [e]);

    const x3D = tf.tensor3d([lastWindow3D]);

    const nextPriceTensor = model.predict(x3D) as tf.Tensor;
    const nextPriceArray = (await nextPriceTensor.array()) as number[][];
    const nextPricePoint = nextPriceArray[0][0];

    scaledData.push(nextPricePoint);

    x3D.dispose();
    nextPriceTensor.dispose();
  }

  //   const predictionsArray: number[][] =
  //     (await predictionsTensor.array()) as number[][];
  //   const unscaledPredictions = predictionsArray.map(
  //     (p) => p[0] * (max - min) + min
  //   );
  const unscaledPredictions = scaledData.map(
    (e: number) => e * (max - min) + min
  );

  console.log("Length of arr with pred values: ", unscaledPredictions.length);

  xTensor.dispose();
  yTensor.dispose();
  //   predictionsTensor.dispose();

  return unscaledPredictions;
}

export default predictModel;
