$env:POSTGRES_ADMIN_USER=""
$env:POSTGRES_ADMIN_PASSWORD=""
$env:POSTGRES_NAME=""
$env:LOCATION=""
$env:GROUP_NAME=""
$env:CONTAINER_ENV_NAME=""
$env:CONTAINER_APP_NAME=""
$env:NEXTAUTH_SECRET=""
$env:SUBSCRIPTION_NAME=""


az login
az account set --subscription $env:SUBSCRIPTION_NAME

az extension add --name containerapp --upgrade

az config set defaults.location=$env:LOCATION defaults.group=$env:GROUP_NAME

az postgres flexible-server show --name $env:POSTGRES_NAME --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    az postgres flexible-server create --public-access 0.0.0.0 --yes --admin-user $env:POSTGRES_ADMIN_USER --admin-password $env:POSTGRES_ADMIN_PASSWORD --name $env:POSTGRES_NAME --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16
} else {
    Write-Output "PostgreSQL server '$env:POSTGRES_NAME' already exists."
}

az containerapp env show --name $env:CONTAINER_ENV_NAME --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    az containerapp env create --name $env:CONTAINER_ENV_NAME
} else {
    Write-Output "Container Apps environment '$env:CONTAINER_ENV_NAME' already exists."
}

az containerapp show --name $env:CONTAINER_APP_NAME --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    $env:POSTGRES_URL = "postgresql://${env:POSTGRES_ADMIN_USER}:${env:POSTGRES_ADMIN_PASSWORD}@${env:POSTGRES_NAME}.postgres.database.azure.com/flexibleserverdb?sslmode=require"
    $env:fqdn=az containerapp create --name $env:CONTAINER_APP_NAME --ingress external --target-port 3000 --environment $env:CONTAINER_ENV_NAME --env-vars POSTGRES_URL="$env:POSTGRES_URL" POSTGRES_URL_NON_POOLING="$env:POSTGRES_URL" NEXTAUTH_SECRET="$env:NEXTAUTH_SECRET" EMAIL_SERVER_USER="alana.dubuque@ethereal.email" EMAIL_SERVER_PASSWORD="W5xF77eURgth5dAHKf" EMAIL_SERVER_HOST="smtp.ethereal.email" EMAIL_SERVER_PORT="587" EMAIL_FROM="noreply@example.com" -o tsv --query properties.configuration.ingress.fqdn
    az containerapp update --name $env:CONTAINER_APP_NAME --set-env-vars NEXTAUTH_URL=https://${env:fqdn}
} else {
    Write-Output "$env:CONTAINER_APP_NAME already exists."
}

az acr create -n myregistrylzkgk76hhjhghjfze --sku Basic --admin-enabled true

# Then go to Azure Portal > Resource Groups > Container App > Settings > Deployment > Continuous deployment >
# Activate continuous deployement from Github repository :)
# You need to disable main branch protection temporarly first on GitHub
# It bypasses the missing rights on Azure AD (Microsoft Entra), you cannot do it from the command line here.
