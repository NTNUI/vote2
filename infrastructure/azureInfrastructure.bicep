param appName string = 'vote'
param location string = 'Norway East'
param staticWebAppLocation string = 'westeurope'

/* 
 Using a S1 plan to support development slots.
 Also using a S1 plan to support more than 350 concurrent web socket connections.
 If downgrading to a cheaper plan, such as B1, you could run into issues with the number of concurrent web socket connections under peak load.
 Also you have to remove the dev slot, and give it a separate Web App. 
 */
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: 'S1'
    tier: 'Standard'
  }
  properties: {
    reserved: true
  }
}

resource voteDB 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '${appName}-db'
  location: location
  tags: {
    defaultExperience: 'Azure Cosmos DB for MongoDB API'
    'hidden-cosmos-mmspecial': ''
  }
  kind: 'MongoDB'
  identity: {
    type: 'None'
  }
  properties: {
    enableFreeTier: false
    databaseAccountOfferType: 'Standard'
    apiProperties: {
      serverVersion: '4.2'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableMongo'
      }
      {
        name: 'DisableRateLimitingResponses'
      }
      {
        name: 'EnableServerless'
      }
    ]
    backupPolicy: {
      type: 'Continuous'
      continuousModeProperties: {
        tier: 'Continuous7Days'
      }
    }
  }
}

resource databaseAccounts_production 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: voteDB
  name: 'production'
  properties: {
    resource: {
      id: 'production'
    }
  }
}

resource databaseAccounts_development 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: voteDB
  name: 'development'
  properties: {
    resource: {
      id: 'development'
    }
  }
}

resource backend 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-backend'
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'DB_URI'
          value: voteDB.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'BACKEND_PORT'
          value: '8080'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'NTNUI_TOOLS_API_URL'
          value: 'https://api.ntnui.no/'
        }
      ]
    }
  }
}

resource backendDevSlot 'Microsoft.Web/sites/slots@2022-09-01' = {
  parent: backend
  location: location
  name: 'dev'
  properties: {
    httpsOnly: true
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'DB_URI'
          value: voteDB.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'BACKEND_PORT'
          value: '8080'
        }
        {
          name: 'NODE_ENV'
          value: 'development'
        }
        {
          name: 'NTNUI_TOOLS_API_URL'
          value: 'https://dev.api.ntnui.no/'
        }
      ]
    }
  }
}

resource frontend 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${appName}-frontend'
  location: staticWebAppLocation
  properties: {
    repositoryUrl: 'https://github.com/NTNUI/vote2/'
    branch: 'main'
    buildProperties: {
      appLocation: '/frontend'
    }
  }
  sku: {
    tier: 'Free'
    name: 'Free'
  }
}

resource frontendDev 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${appName}-frontend-dev'
  location: staticWebAppLocation
  properties: {
    repositoryUrl: 'https://github.com/NTNUI/vote2/'
    branch: 'dev'
    buildProperties: {
      appLocation: '/frontend'
    }
  }
  sku: {
    tier: 'Free'
    name: 'Free'
  }
}
