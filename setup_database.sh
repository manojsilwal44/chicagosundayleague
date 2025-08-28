#!/bin/bash

# Database setup helper script for Chicago Sunday League
# This script helps set up the database and initial data

echo "🗄️ Database Setup Helper for Chicago Sunday League"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating one...${NC}"
    echo 'DATABASE_URL="postgresql://chicagosundayleague_user:chicagosundayleague_password@localhost:5432/chicagosundayleague"' > .env
    echo -e "${GREEN}✅ Created .env file with default database connection${NC}"
    echo -e "${YELLOW}📝 You may need to update the DATABASE_URL in .env to match your PostgreSQL setup${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""
echo -e "${BLUE}🔄 Setting up database schema...${NC}"

# Generate Prisma client
echo -e "${BLUE}📦 Generating Prisma client...${NC}"
if npm run db:generate; then
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi

# Push database schema
echo -e "${BLUE}🏗️  Pushing database schema...${NC}"
if npm run db:push; then
    echo -e "${GREEN}✅ Database schema synced${NC}"
else
    echo -e "${RED}❌ Failed to sync database schema${NC}"
    echo -e "${YELLOW}💡 Make sure PostgreSQL is running and DATABASE_URL is correct${NC}"
    exit 1
fi

# Seed the database
echo -e "${BLUE}🌱 Seeding database with initial data...${NC}"
if npm run db:seed; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${RED}❌ Failed to seed database${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. 🚀 Start the development server: npm run dev"
echo "2. 🌐 Open your browser to: http://localhost:3000"
echo "3. 👤 Create a user account through the web interface"
echo "4. 🏈 Run the sample events script: ./insert_sample_events.sh"
echo ""
echo -e "${YELLOW}💡 Tip: If you encounter database connection issues, make sure:${NC}"
echo "   • PostgreSQL is running on your system"
echo "   • The database 'chicagosundayleague' exists"
echo "   • The user and password in DATABASE_URL are correct"
