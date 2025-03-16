---
sidebar_position: 1
---

# Setup and Installation

This guide covers the setup and deployment process for Dottie on Azure.

## Prerequisites

Before deploying Dottie, ensure you have:

- An active Azure subscription with appropriate permissions
- Azure CLI installed and configured
- Basic familiarity with Azure resources
- Git and a code editor installed locally

## Azure Resources Setup

### Setting up Azure OpenAI

1. Create an Azure OpenAI resource:
   ```bash
   az cognitiveservices account create \
       --name dottie-openai \
       --resource-group dottie-rg \
       --kind OpenAI \
       --sku S0 \
       --location eastus
   ```

2. Deploy the necessary models:
   ```bash
   az cognitiveservices account deployment create \
       --name dottie-openai \
       --resource-group dottie-rg \
       --deployment-name gpt-4 \
       --model-name gpt-4 \
       --model-version "1" \
       --model-format OpenAI \
       --scale-settings-scale-type Standard
   ```

### Setting up Azure AI Services

1. Create an Azure AI Services resource:
   ```bash
   az cognitiveservices account create \
       --name dottie-ai-services \
       --resource-group dottie-rg \
       --kind CognitiveServices \
       --sku S0 \
       --location eastus
   ```

### Setting up Azure Cosmos DB

1. Create a Cosmos DB account:
   ```bash
   az cosmosdb create \
       --name dottie-cosmos \
       --resource-group dottie-rg \
       --kind GlobalDocumentDB \
       --default-consistency-level Session
   ```

2. Create a database:
   ```bash
   az cosmosdb sql database create \
       --account-name dottie-cosmos \
       --resource-group dottie-rg \
       --name dottiedb
   ```

3. Create containers for conversations and users:
   ```bash
   az cosmosdb sql container create \
       --account-name dottie-cosmos \
       --database-name dottiedb \
       --name conversations \
       --partition-key-path "/userId" \
       --resource-group dottie-rg

   az cosmosdb sql container create \
       --account-name dottie-cosmos \
       --database-name dottiedb \
       --name users \
       --partition-key-path "/id" \
       --resource-group dottie-rg
   ```

### Setting up Azure Blob Storage

1. Create a storage account:
   ```bash
   az storage account create \
       --name dottiestorage \
       --resource-group dottie-rg \
       --location eastus \
       --sku Standard_LRS \
       --encryption-services blob
   ```

2. Create containers for media and documents:
   ```bash
   az storage container create \
       --account-name dottiestorage \
       --name media \
       --public-access off

   az storage container create \
       --account-name dottiestorage \
       --name documents \
       --public-access off
   ```

## Application Deployment

### Backend Deployment

1. Deploy the Flask/FastAPI backend:
   ```bash
   az webapp up \
       --name dottie-api \
       --resource-group dottie-rg \
       --location eastus \
       --sku B1 \
       --runtime "PYTHON|3.9"
   ```

2. Configure environment variables:
   ```bash
   az webapp config appsettings set \
       --name dottie-api \
       --resource-group dottie-rg \
       --settings \
           AZURE_OPENAI_ENDPOINT=<your-endpoint> \
           AZURE_OPENAI_KEY=<your-key> \
           COSMOS_CONNECTION_STRING=<your-connection-string> \
           BLOB_CONNECTION_STRING=<your-connection-string>
   ```

### Frontend Deployment

1. Deploy the Streamlit frontend:
   ```bash
   az webapp up \
       --name dottie-web \
       --resource-group dottie-rg \
       --location eastus \
       --sku B1 \
       --runtime "PYTHON|3.9"
   ```

2. Configure environment variables:
   ```bash
   az webapp config appsettings set \
       --name dottie-web \
       --resource-group dottie-rg \
       --settings \
           API_ENDPOINT=https://dottie-api.azurewebsites.net \
           AUTH_ENABLED=true
   ```

## Verification

After deployment, verify that all components are working correctly:

1. Check resource health in Azure Portal
2. Test the API endpoints
3. Verify frontend functionality
4. Run the included test suite

## Next Steps

After setup is complete, proceed to the [Usage Guide](../usage/) to learn how to interact with and manage Dottie. 