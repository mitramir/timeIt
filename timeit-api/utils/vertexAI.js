const { Item } = require("../models/item");
const _ = require("lodash");
// Imports the Google Cloud Prediction Service Client library
const {
  DatasetServiceClient,
  PredictionServiceClient,
} = require("@google-cloud/aiplatform");
const { predictionMapper } = require("../utils/dataMapper");
//todo: must delete
var payload = require("./payload.json");
const { History } = require("../models/history");

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: process.env.GCLOUD_API_ENDPOINT,
};

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

const predictCustomTrainedModel = async (payload) => {
  // async function predictCustomTrainedModel() {
  // Configure the parent resource
  const endpoint = `projects/${process.env.GCLOUD_PROJECT_ID}/locations/${process.env.GCLOUD_PROJECT_LOCATION}/endpoints/${process.env.GCLOUD_ENDPOINT_ID}`;
  const parameters = {
    structValue: {
      fields: {},
    },
  };

  const instances = [payload];
  const request = {
    endpoint,
    instances,
    parameters,
  };

  // Predict request
  try {
    const [response] = await predictionServiceClient.predict(request);

    return response;
  } catch (ex) {
    //todo
    return {
      predictions: [
        {
          upper_bound: 250.93867492675781,
          value: 90.993568420410156,
          lower_bound: 17.754068374633789,
        },
      ],
      deployedModelId: "6094403836762390528",
      model:
        "projects/959908856411/locations/us-central1/models/4854075555793862656",
      modelDisplayName: "BookData_20220114_2022114115621",
      modelVersionId: "1",
    };
  }

  // console.log("Predict custom trained model response");
  // console.log(`\tDeployed model id : ${response.deployedModelId}`);
  // const predictions = response.predictions;
  // console.log("\tPredictions :");
  // for (const prediction of predictions) {
  //   console.log(`\t\tPrediction : ${JSON.stringify(prediction)}`);
  // }
};

const vertexai = async (dataToPredict) => {
  const predictionPayload = await predictionMapper(dataToPredict);
  const result = await predictCustomTrainedModel(predictionPayload);
  return result.predictions[0].value; // <= 183 ? true : false;
};

module.exports = vertexai;
