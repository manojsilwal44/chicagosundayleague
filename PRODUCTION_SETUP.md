# Production Setup Guide

## Step 1: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/chicagosundayleague"

# Next.js Configuration
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Application Configuration
NODE_ENV="production"
```

**Important**: Replace the placeholder values with your actual production credentials.

## Step 2: Database Setup

### Install PostgreSQL
- **macOS**: `brew install postgresql`
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: Download from https://www.postgresql.org/download/windows/

### Create Database
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE chicagosundayleague;
CREATE USER yourusername WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE chicagosundayleague TO yourusername;
\q
```

## Step 3: Database Migration

Run the following commands to set up the database schema:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations (if you have them)
npm run db:migrate

# Seed initial data
npm run db:seed
```

## Step 4: Update API Routes for Production

The current API routes are using mock data. You'll need to update them to use the real EventService.

## Step 5: Build and Deploy

```bash
# Install production dependencies
npm ci --only=production

# Build the application
npm run build

# Start production server
npm start
```

## Step 6: Production Considerations

1. **Environment Variables**: Ensure all sensitive data is in environment variables
2. **Database Security**: Use strong passwords and restrict database access
3. **HTTPS**: Set up SSL certificates for production
4. **Monitoring**: Set up logging and monitoring
5. **Backup**: Configure database backups
6. **Load Balancing**: Consider using a load balancer for high traffic

## Troubleshooting

- **Database Connection Issues**: Check DATABASE_URL format and database service status
- **Migration Errors**: Ensure database user has proper permissions
- **Build Errors**: Check for TypeScript errors and resolve them
