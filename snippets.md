# Useful CLI Commands Resources

### Find Circular Dependency

```bash
npx madge --circular src/main.ts
```

### Install NestJs Globally

```bash
npm install -g @nestjs/cli
```

### Create a New Module

```bash
nest g resource {module_name} modules/api
```

### Generate Swagger JSON File

```bash
curl http://localhost:8000/docs-json -o swagger.json
```

### Generate Swagger YAML File

```bash
curl http://localhost:8000/docs-yaml -o swagger-yaml.yaml
```

### Generate Swagger YAML File

```bash
npx @redocly/cli build-docs swagger-yaml.yaml
```

### Generate Random Base64 Strings

```bash
openssl rand -base64 128
```

### Generate Hex 64 hex characters:

- 1 byte = 2 hex characters
- 32 bytes × 2 hex chars per byte = 64 hex characters
- 64 bytes × 2 hex chars per byte = 128 hex characters

```bash
openssl rand -hex 32
```

### Generate Type ORM Models

```bash
npx typeorm-model-generator -h 127.0.0.1 -d bill-payments-1 -u postgres -x meet@123 -e postgres -o ./src/common/model-generator --no-config
```

# Prisma Commands

### Initialize Prisma

```bash
npx prisma init
```

### Pull Schema from DB

```bash
npx prisma db pull
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Prisma Studio

```bash
npx prisma studio
```

# Database Resources

### Backup DB in Windows (Run in PowerShell)

```bash
$env:PGPASSWORD = "meet@123"
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" `
  -h 127.0.0.1 `
   -p 5432 `
   -U postgres `
   -d bill-payments-1 `
   -F c `
    -f "D:\db_backups\bill-payments-1.backup"
```

### Backup DB in For Linux

```bash
PGPASSWORD="mypostgrespass" pg_dump -h localhost -p 5432 -U postgres -d bill-payments -F c -f /home/ec2-user/bill.backup

# Download File in Local Machine
scp -i my-key.pem ec2-user@3.110.12.123:/home/ec2-user/bill.backup .
```

# Docker Resources

### Build Docker

- Note: the **-no-cache** can be removed as it is used to prevent the older cache to retain

```bash
docker build --no-cache -t {{app_name}} .
```

---

### Run the Container

- **Note:** the {{app_name}} should be same as the image name
- **d**: Run the container in detached (background) mode.
- **--name** nestjs-container: Assigns the name nestjs-container to your container.
- **-p** 3000:3000: Maps port 3000 on your host to port 3000 in the container (based on your ARG PORT=3000 and EXPOSE $PORT).

```bash
docker run -d --name nestjs-container -p 3000:3000 {{app_name}}
```

- Add The .env file in the docker build context, to access all the env variables

```bash
docker run -d --name nestjs-container --env-file .env -p 3000:3000 nestjs-app
```

- Overright specific Env Variable Value while running the container

```bash
docker run -d \
  --name nestjs-container \
  --env-file .env \
  -e DB_HOST=host.docker.internal \
  -p 3000:3000 \
  nestjs-app
```

---

### View Logs

- nestjs-container: is the name of the container

```bash
docker logs -f nestjs-container
```

---

### Enter the Container

- nestjs-container: is the name of the container

```bash
docker exec -it nestjs-container sh
```

---

### Stop Container

- nestjs-container: is the name of the container

```bash
docker stop nestjs-container
```

---

### Remove the Container

- nestjs-container: is the name of the container

```bash
docker rm nestjs-container
```

---

### Remove Image

- nestjs-app: is the name of the image

```bash
docker rmi nestjs-app
```

---
