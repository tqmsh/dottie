---
sidebar_position: 1
---

# Architecture Overview

Dottie's architecture is designed to provide secure, scalable healthcare conversational capabilities using Azure's cloud services.

## System Architecture

Dottie is built on a modern, cloud-native architecture consisting of several interconnected components:

### Conversational AI Core

The heart of Dottie is powered by Azure's AI Language services and OpenAI models:

- **Azure OpenAI Service**: Provides the advanced language understanding capabilities using models like GPT-4
- **Azure AI Language**: Offers intent recognition, entity extraction, and conversation management
- **Custom Training**: Domain-specific healthcare knowledge fine-tuning

### Symptom Analysis Engine

The symptom analysis component combines several Azure services:

- **Azure AI Custom Vision**: Processes and analyzes medical images
- **Azure Text Analytics for Health**: Extracts medical entities from patient descriptions
- **Clinical Knowledge Base**: Contextualizes symptoms with medical knowledge

### Multi-modal Interface

Dottie supports multiple interaction modes:

- **Azure Speech Services**: Enables voice-based interactions
- **Azure Computer Vision**: Processes uploaded images and photos
- **Text Chat Interface**: Standard text-based conversation

### Data Layer

Secure, compliant data management is critical for healthcare applications:

- **Azure Cosmos DB**: Stores conversation history and user profiles
- **Azure Blob Storage**: Manages media files and documents
- **Azure Key Vault**: Secures sensitive configuration and credentials

### Integration Layer

Dottie connects with other healthcare systems through:

- **Azure API Management**: Controls access to external APIs
- **Azure Logic Apps**: Orchestrates complex integration workflows
- **FHIR Integration**: Compatibility with healthcare data standards

## Deployment Architecture

Dottie is deployed using:

- **Azure App Service**: Hosts the web application
- **Azure Container Instances**: Manages microservices
- **Azure Front Door**: Provides global load balancing and security

## Security and Compliance

As a healthcare solution, Dottie implements:

- **HIPAA Compliance**: Following healthcare privacy standards
- **Azure Security Center**: Monitoring for threats and vulnerabilities
- **Azure Private Link**: Secure connectivity to Azure services
- **Data Encryption**: Both at rest and in transit 