# Infrastructure

The [bicep-script](./azureInfrastructure.bicep) contains the infrastructure to run a production and development environment for this application in [Microsoft Azure](https://azure.microsoft.com/).  
For deploying the app you have to follow this steps:

1. Download the Azure CLI (guide [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli))
2. Login to your preferred account using `az login`
3. Create a Resource Group for the application by the command (Change name and location if another is preferred):  
   `az group create --name vote --location "Norway East`
4. Deploy the bicep template into the newly created Resource group by entering this command from this folder (replace name of resource group if another is used):
5. `az deployment group create --resource-group test --template-file ./infrastructure/azureInfrastructure.bicep`

Now you have all the resources set up, but there is still some manual steps:

1. Set up custom domain (Can probably be automated as well?)

   The application has to be hosted on the same domain/subdomain for the cookies to behave correct.
   For example the frontend can be assigned to vote.ntnui.no, then the backend has to run on a subdomain of the frontend, for example api.vote.ntnui.no. This has to be configured manually in Azure.

2. Allow only the backend IP to access the database.
   Because the backend is dependent on the database to exist for obtaining the database URI, the database is created before the backend. Therefore the bicep-script do not know the backend IP because it does not exist yet. By default is allows all IPs, which is not ideal.

### Deploying code from GitHub

Now that the infrastructure is up and running it's time to add some content.

This repository contains some [workflows](../.github/workflows/). The ones containing "deploy" deploys either the backend or the frontend to the development or the production environment.

The backend workflows contain a `publish-profile`. The publish profiles are stored in the secrets section of this GitHub repository. These secrets has to be updated with the new ones for the workflows to function.

![Image](azure-publish-profile.png)
The secret can be downloaded from here or by using Azure CLI.
