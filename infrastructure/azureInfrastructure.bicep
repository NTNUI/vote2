param appName string = 'vote'
param location string = 'Norway East'
param staticWebAppLocation string = 'westeurope'

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

resource cosmosDB 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: '${appName}-db'
  location: location
  kind: 'MongoDB'
  properties: {
    enableFreeTier: true
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

resource backend 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-backend'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'DB_URI'
          value: cosmosDB.listConnectionStrings().connectionStrings[0].connectionString
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
    siteConfig: {
      appSettings: [
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
