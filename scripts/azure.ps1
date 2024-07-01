
$POSTGRES_URL = "postgresql://${env:POSTGRES_ADMIN_USER}:${env:POSTGRES_ADMIN_PASSWORD}@${env:POSTGRES_NAME}.postgres.database.azure.com/flexibleserverdb?sslmode=require"

# Cannot use the azure login action because I don't have access to the AD (microsoft Entra)
az login --use-device
az account set --subscription $env:SUBSCRIPTION_NAME

az extension add --name containerapp --upgrade

az config set defaults.location=$env:LOCATION defaults.group=$env:GROUP_NAME

$postgresServer = az postgres flexible-server show --name $env:POSTGRES_NAME --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    az postgres flexible-server create --yes --admin-user $env:POSTGRES_ADMIN_USER --admin-password $env:POSTGRES_ADMIN_PASSWORD --name $env:POSTGRES_NAME --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16
} else {
    Write-Output "PostgreSQL server '$env:POSTGRES_NAME' already exists."
}

$containerEnv = az containerapp env show --name $env:CONTAINER_ENV_NAME --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    az containerapp env create --name $env:CONTAINER_ENV_NAME
} else {
    Write-Output "Container Apps environment '$env:CONTAINER_ENV_NAME' already exists."
}

$containerEnv = az containerapp show --name application-nextjs-tanstack --output none 2>&1
if ($LASTEXITCODE -ne 0) {
    az containerapp create --name application-nextjs-tanstack --environment $env:CONTAINER_ENV_NAME
} else {
    Write-Output "Container Apps already exists."
}

az containerapp up --name application-nextjs-tanstack --source . --env-vars POSTGRES_URL="$env:POSTGRES_URL" POSTGRES_URL_NON_POOLING="$env:POSTGRES_URL" NEXTAUTH_SECRET="$env:NEXTAUTH_SECRET" EMAIL_SERVER_USER="alana.dubuque@ethereal.email" EMAIL_SERVER_PASSWORD="W5xF77eURgth5dAHKf" EMAIL_SERVER_HOST="smtp.ethereal.email" EMAIL_SERVER_PORT="587" EMAIL_FROM="noreply@example.com"
# Then go to Azure Portal > Resource Groups > Container App > Settings > Deployment > Continuous deployment >
# Activate continuous deployement from Github repository :)
