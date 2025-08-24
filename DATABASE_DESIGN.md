# Event Database Design - Normalized Architecture

## Overview
This document describes the normalized database design for the PlayOn event management system. The design is built to be easily expandable for different event types while maintaining data integrity and performance.

## Database Schema

### Core Event Model (`Event`)
The main event table containing common fields for all event types:

```prisma
model Event {
  id          String      @id @default(cuid())
  
  // Basic Information
  title       String
  summary     String?     // Short description (140 chars max)
  description String?     // Detailed description
  
  // Event Type and Status
  eventType   EventType
  status      EventStatus @default(DRAFT)
  
  // Timing
  startTime   DateTime
  endTime     DateTime?
  timezone    String?
  
  // Location
  location    String
  address     String?
  city        String?
  state       String?
  country     String?
  postalCode  String?
  isOnline    Boolean     @default(false)
  onlineUrl   String?
  
  // Capacity and Pricing
  maxParticipants Int
  minParticipants Int?
  costPerPerson   Decimal? @db.Decimal(10,2)
  isFree          Boolean  @default(true)
  
  // Organizer
  organizerId String
  organizer   User       @relation("OrganizerEvents", fields: [organizerId], references: [id], onDelete: Cascade)
  
  // Media
  coverImage  String?
  images      EventImage[]
  
  // Metadata
  tags        String[]
  categories  EventCategory[]
  isPublic    Boolean    @default(true)
  isActive    Boolean    @default(true)
  
  // Timestamps
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  publishedAt DateTime?
  
  // Relations
  participants Participant[]
  eventDetails EventDetails?
  reviews     EventReview[]
  waitlist    EventWaitlist[]
}
```

### Event Status Management
Events can have the following statuses:
- **DRAFT**: Initial state when creating an event
- **PUBLISHED**: Event is live and visible to users
- **CANCELLED**: Event has been cancelled
- **COMPLETED**: Event has finished
- **ARCHIVED**: Event is archived (soft delete)

### Event Types
Supported event types include:
- **Sports**: Soccer, Cricket, Tennis, Volleyball, Pickleball
- **Gaming**: Video Games
- **Activities**: Cooking, Tech, Wellness
- **Other**: Miscellaneous events

## Normalized Design Benefits

### 1. **Event Details Table (`EventDetails`)**
Type-specific fields are stored in a separate table to avoid NULL columns:

```prisma
model EventDetails {
  id        String   @id @default(cuid())
  eventId   String  @unique
  
  // Sports-specific fields
  sportType String?  // For sports events
  skillLevel String? // beginner, intermediate, advanced
  equipment String?  // Required equipment
  rules     String?  // Event-specific rules
  
  // Tech/Workshop fields
  format    String?  // workshop, conference, meetup
  duration  Int?     // Duration in minutes
  materials String?  // Required materials
  
  // Wellness/Activity fields
  intensity String?  // low, medium, high
  ageGroup  String?  // target age group
  
  // Custom fields (JSON for future extensibility)
  customFields Json?
  
  // Relations
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

### 2. **Event Categories (`EventCategory`)**
Centralized category management with icons and colors:

```prisma
model EventCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  icon        String?
  color       String?
  isActive    Boolean  @default(true)
  
  // Relations
  events      Event[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. **Event Images (`EventImage`)**
Multiple image support with ordering and primary image designation:

```prisma
model EventImage {
  id        String   @id @default(cuid())
  eventId   String
  imageUrl  String
  altText   String?
  isPrimary Boolean  @default(false)
  order     Int      @default(0)
  
  // Relations
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
}
```

### 4. **Enhanced Participant Management (`Participant`)**
Comprehensive participant tracking with status and payment information:

```prisma
model Participant {
  id        String   @id @default(cuid())
  userId    String
  eventId   String
  joinedAt  DateTime @default(now())
  
  // Enhanced fields
  status    ParticipantStatus @default(REGISTERED)
  notes     String?
  waitlistPosition Int?
  
  // Payment information
  hasPaid   Boolean  @default(false)
  paymentAmount Decimal? @db.Decimal(10,2)
  paymentMethod String?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

### 5. **Event Reviews (`EventReview`)**
User feedback and rating system:

```prisma
model EventReview {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  rating    Int      // 1-5 stars
  comment   String?
  isPublic  Boolean  @default(true)
  
  // Relations
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 6. **Event Waitlist (`EventWaitlist`)**
Overflow management for popular events:

```prisma
model EventWaitlist {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  position  Int
  joinedAt  DateTime @default(now())
  notifiedAt DateTime?
  
  // Relations
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Expandability Features

### 1. **Custom Fields**
The `customFields` JSON field in `EventDetails` allows for:
- Event-type-specific data without schema changes
- Future integrations with external systems
- Flexible metadata storage

### 2. **Event Type Extensions**
New event types can be added by:
1. Adding to the `EventType` enum
2. Creating type-specific fields in `EventDetails`
3. Updating the UI components

### 3. **Category Management**
Categories can be:
- Added/removed without code changes
- Customized with icons and colors
- Made active/inactive as needed

## API Design

### Event Service (`EventService`)
The service layer provides:
- **CRUD Operations**: Create, read, update, delete events
- **Status Management**: Draft → Published → Completed workflow
- **Filtering & Pagination**: Advanced event discovery
- **Type-Specific Logic**: Handling different event types

### Key Methods:
- `createEvent()`: Creates event with normalized structure
- `updateEvent()`: Updates existing events
- `publishEvent()`: Changes status from DRAFT to PUBLISHED
- `getEvents()`: Filtered event retrieval with pagination
- `getEventById()`: Detailed event information
- `getEventStats()`: Analytics and reporting

## Migration Strategy

### 1. **Database Migration**
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed initial data
```

### 2. **Data Migration**
- Existing events will be migrated to new structure
- `gameType` → `eventType`
- `maxPlayers` → `maxParticipants`
- `costPerPlayer` → `costPerPerson`

### 3. **API Updates**
- All API endpoints updated to use new structure
- Backward compatibility maintained where possible
- New endpoints for enhanced functionality

## Performance Considerations

### 1. **Indexing Strategy**
- Primary keys on all ID fields
- Composite indexes on frequently queried combinations
- Text search indexes on title, description, and location

### 2. **Query Optimization**
- Efficient joins using foreign keys
- Pagination for large result sets
- Selective field inclusion to reduce data transfer

### 3. **Caching Strategy**
- Event categories cached in memory
- Frequently accessed events cached
- User session data cached

## Security Features

### 1. **Access Control**
- User authentication required for event creation
- Organizer-only access to event management
- Public/private event visibility controls

### 2. **Data Validation**
- Input validation using Zod schemas
- SQL injection prevention via Prisma
- XSS protection in user-generated content

### 3. **Audit Trail**
- Creation and modification timestamps
- User activity tracking
- Event status change history

## Future Enhancements

### 1. **Real-time Features**
- Live participant updates
- Event notifications
- Chat/messaging system

### 2. **Advanced Analytics**
- Event performance metrics
- User engagement tracking
- Revenue analytics

### 3. **Integration Capabilities**
- Calendar system integration
- Payment gateway integration
- Social media sharing

## Conclusion

This normalized database design provides:
- **Scalability**: Easy to add new event types and features
- **Performance**: Optimized queries and indexing
- **Maintainability**: Clear separation of concerns
- **Flexibility**: JSON fields for custom data
- **Security**: Comprehensive access control and validation

The design follows database normalization principles while maintaining the flexibility needed for a modern event management platform.
