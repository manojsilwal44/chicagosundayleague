#!/bin/bash

# Script to insert sample events into the Chicago Sunday League database
# Creates 2 soccer events, 1 cricket event, and 2 pickleball events
# All events are free and located in Fort Worth park grounds, Texas

echo "🏈 Starting sample events insertion script..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server URL
SERVER_URL="http://localhost:3000"

# First, try to set up the database
echo -e "${BLUE}📊 Setting up database...${NC}"

# Try to run database seed, but don't fail if it doesn't work
echo -e "${BLUE}🌱 Attempting to seed database...${NC}"
if npm run db:seed; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database seed failed, continuing anyway...${NC}"
fi

# Wait a moment for the server to be ready
sleep 2

# Try to get organizer ID, but use a fallback if not available
echo -e "${BLUE}👤 Getting organizer user ID...${NC}"
ORGANIZER_ID=""

# Try to get user ID from database
if ORGANIZER_ID=$(node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.user.findFirst().then(user => {
  if (user) {
    console.log(user.id);
  } else {
    console.log('');
  }
}).catch(() => {
  console.log('');
}).finally(() => prisma.\$disconnect().catch(() => {}));
" 2>/dev/null); then
    if [ -n "$ORGANIZER_ID" ]; then
        echo -e "${GREEN}✅ Found organizer ID: $ORGANIZER_ID${NC}"
    else
        echo -e "${YELLOW}⚠️  No user found in database${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not connect to database${NC}"
fi

# If we don't have an organizer ID, use a placeholder and note that user creation may be needed
if [ -z "$ORGANIZER_ID" ]; then
    ORGANIZER_ID="cm5kw2ik20000108n7y5fdhq9"  # Placeholder ID - events may fail to create
    echo -e "${YELLOW}⚠️  Using placeholder organizer ID. You may need to:${NC}"
    echo -e "${YELLOW}   1. Set up your database connection (DATABASE_URL in .env)${NC}"
    echo -e "${YELLOW}   2. Run: npm run db:push${NC}"
    echo -e "${YELLOW}   3. Run: npm run db:seed${NC}"
    echo -e "${YELLOW}   4. Create a user account through the app${NC}"
fi

# Function to create an event
create_event() {
    local title="$1"
    local event_type="$2"
    local start_time="$3"
    local end_time="$4"
    local location="$5"
    local max_participants="$6"
    local description="$7"

    echo -e "${BLUE}🎯 Creating event: $title${NC}"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST \
        "$SERVER_URL/api/events/publish" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"$title\",
            \"description\": \"$description\",
            \"eventType\": \"$event_type\",
            \"startTime\": \"$start_time\",
            \"endTime\": \"$end_time\",
            \"location\": \"$location\",
            \"address\": \"Fort Worth Park Grounds\",
            \"city\": \"Fort Worth\",
            \"state\": \"Texas\",
            \"country\": \"United States\",
            \"postalCode\": \"76101\",
            \"maxParticipants\": $max_participants,
            \"costPerPerson\": 0,
            \"organizerId\": \"$ORGANIZER_ID\",
            \"timezone\": \"America/Chicago\"
        }")

    # Extract HTTP status code
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    # Extract response body
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')

    if [ $http_code -eq 201 ]; then
        echo -e "${GREEN}✅ Successfully created: $title${NC}"
    else
        echo -e "${RED}❌ Failed to create $title (HTTP $http_code)${NC}"
        echo -e "${RED}Response: $body${NC}"
    fi
}

# Create events with future dates (using ISO format for compatibility)
echo -e "${BLUE}🏟️ Creating events...${NC}"

# Soccer Event 1 - Next Sunday
create_event \
    "Sunday Soccer Championship" \
    "SOCCER" \
    "2024-12-29T10:00:00.000Z" \
    "2024-12-29T12:00:00.000Z" \
    "Fort Worth Central Park Soccer Field" \
    "22" \
    "Join us for an exciting soccer match! All skill levels welcome. Bring your cleats and water bottle. We'll provide the soccer ball and goals."

# Soccer Event 2 - Following Saturday  
create_event \
    "Weekend Warriors Soccer League" \
    "SOCCER" \
    "2025-01-04T14:00:00.000Z" \
    "2025-01-04T16:00:00.000Z" \
    "Fort Worth South Park Soccer Complex" \
    "20" \
    "Friendly soccer league for weekend warriors! Come play, make friends, and get a great workout. Perfect for players looking to stay active."

# Cricket Event - Next Saturday
create_event \
    "Fort Worth Cricket Club Match" \
    "CRICKET" \
    "2024-12-28T09:00:00.000Z" \
    "2024-12-28T17:00:00.000Z" \
    "Fort Worth Park Cricket Ground" \
    "22" \
    "Traditional cricket match in the heart of Texas! Whether you're a seasoned player or new to cricket, join us for a day of sport, fun, and community."

# Pickleball Event 1 - Weekday morning
create_event \
    "Morning Pickleball Social" \
    "PICKLEBALL" \
    "2024-12-26T08:00:00.000Z" \
    "2024-12-26T10:00:00.000Z" \
    "Fort Worth Park Pickleball Courts" \
    "12" \
    "Start your day with some energizing pickleball! Perfect for all skill levels. Paddles and balls provided. Come for the game, stay for the coffee!"

# Pickleball Event 2 - Evening tournament
create_event \
    "Evening Pickleball Tournament" \
    "PICKLEBALL" \
    "2025-01-02T18:00:00.000Z" \
    "2025-01-02T20:00:00.000Z" \
    "Fort Worth Community Center Pickleball Courts" \
    "16" \
    "Competitive yet friendly pickleball tournament! Prizes for winners and fun for everyone. All equipment provided. Great way to end the work week!"

echo ""
echo -e "${GREEN}🎉 Sample events insertion script completed!${NC}"
echo -e "${BLUE}📱 You can check your events at: $SERVER_URL${NC}"
echo ""
echo -e "${GREEN}Events attempted:${NC}"
echo "• 2 Soccer events (Sunday Championship, Weekend Warriors League)"
echo "• 1 Cricket event (Fort Worth Cricket Club Match)"
echo "• 2 Pickleball events (Morning Social, Evening Tournament)"
echo ""
echo -e "${BLUE}All events are:${NC}"
echo "• 🆓 Free to participate"
echo "• 📍 Located in Fort Worth park grounds, Texas"
echo "• 🏃‍♂️ Open to all skill levels"
echo "• ✅ Published and ready for registration"
echo ""
echo -e "${YELLOW}📋 If events failed to create, please:${NC}"
echo "1. 🗄️  Ensure your database is running (PostgreSQL)"
echo "2. 🔧 Check your DATABASE_URL in .env file"
echo "3. 🛠️  Run: npm run db:push (to sync schema)"
echo "4. 🌱 Run: npm run db:seed (to create categories and sample user)"
echo "5. 👤 Create a user account through the web app"
echo "6. ▶️  Re-run this script: ./insert_sample_events.sh"
echo ""
echo -e "${BLUE}💡 Tip: Check the API responses above for specific error details${NC}"
