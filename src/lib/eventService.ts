import { Prisma } from '../generated/prisma';
import { EventStatus, EventType, ParticipantStatus } from '../generated/prisma';
import { prisma } from './prisma';

export interface CreateEventData {
  title: string;
  summary?: string;
  description?: string;
  eventType: EventType;
  startTime: Date;
  endTime?: Date;
  timezone?: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isOnline?: boolean;
  onlineUrl?: string;
  maxParticipants: number;
  minParticipants?: number;
  costPerPerson?: number;
  isFree?: boolean;
  organizerId: string;
  coverImage?: string;
  tags?: string[];
  categoryIds?: string[];
  status?: EventStatus;
  
  // Event-specific details
  sportType?: string;
  skillLevel?: string;
  equipment?: string;
  rules?: string;
  format?: string;
  duration?: number;
  materials?: string;
  intensity?: string;
  ageGroup?: string;
  customFields?: Prisma.InputJsonValue;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
  status?: EventStatus;
}

export interface EventFilters {
  eventType?: EventType;
  status?: EventStatus;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  isOnline?: boolean;
  isFree?: boolean;
  organizerId?: string;
  tags?: string[];
  categoryIds?: string[];
  limit?: number;
  offset?: number;
}

export class EventService {
  // Create a new event with normalized structure
  static async createEvent(data: CreateEventData) {
    try {
      console.log('Creating event with data:', data);
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: data.organizerId }
      });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        throw new Error(`User with ID ${data.organizerId} not found`);
      }
      
      // Create the event in the database
      const event = await prisma.event.create({
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          eventType: data.eventType,
          status: data.status || EventStatus.PUBLISHED,
          startTime: data.startTime,
          endTime: data.endTime,
          timezone: data.timezone,
          location: data.location,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          isOnline: data.isOnline || false,
          onlineUrl: data.onlineUrl,
          maxParticipants: data.maxParticipants,
          minParticipants: data.minParticipants,
          costPerPerson: data.costPerPerson,
          isFree: data.isFree ?? (data.costPerPerson === 0 || !data.costPerPerson),
          organizerId: data.organizerId,
          coverImage: data.coverImage,
          tags: data.tags || [],
          publishedAt: (data.status === EventStatus.PUBLISHED || !data.status) ? new Date() : null,
        },
        include: {
          organizer: {
            include: {
              profile: true
            }
          },
          categories: true,
        }
      });

      // Create event details if provided
      if (data.sportType || data.skillLevel || data.equipment || data.rules || 
          data.format || data.duration || data.materials || data.intensity || 
          data.ageGroup || data.customFields) {
        await prisma.eventDetails.create({
          data: {
            eventId: event.id,
            sportType: data.sportType,
            skillLevel: data.skillLevel,
            equipment: data.equipment,
            rules: data.rules,
            format: data.format,
            duration: data.duration,
            materials: data.materials,
            intensity: data.intensity,
            ageGroup: data.ageGroup,
            customFields: data.customFields,
          }
        });
      }

      console.log('Event created successfully:', event);
      return event;
    } catch (error) {
      console.error('CreateEvent error:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Update an existing event
  static async updateEvent(data: UpdateEventData) {
    const {
      id,
      categoryIds,
      sportType,
      skillLevel,
      equipment,
      rules,
      format,
      duration,
      materials,
      intensity,
      ageGroup,
      customFields,
      ...eventData
    } = data;

    return await prisma.$transaction(async (tx) => {
      // Update the main event
      const event = await tx.event.update({
        where: { id },
        data: {
          ...eventData,
          isFree: eventData.isFree ?? (eventData.costPerPerson === 0 || !eventData.costPerPerson),
          categories: categoryIds ? {
            set: categoryIds.map(id => ({ id }))
          } : undefined,
        },
        include: {
          organizer: {
            include: {
              profile: true
            }
          },
          categories: true,
          eventDetails: true,
        }
      });

      // Update or create event details
      if (sportType || skillLevel || equipment || rules || format || duration || materials || intensity || ageGroup || customFields) {
        await tx.eventDetails.upsert({
          where: { eventId: id },
          update: {
            sportType,
            skillLevel,
            equipment,
            rules,
            format,
            duration,
            materials,
            intensity,
            ageGroup,
            customFields,
          },
          create: {
            eventId: id,
            sportType,
            skillLevel,
            equipment,
            rules,
            format,
            duration,
            materials,
            intensity,
            ageGroup,
            customFields,
          }
        });
      }

      return event;
    });
  }

  // Publish an event (change status from DRAFT to PUBLISHED)
  static async publishEvent(eventId: string) {
    return await prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        organizer: {
          include: {
            profile: true
          }
        },
        categories: true,
        eventDetails: true,
      }
    });
  }

  // Get events with filtering and pagination
  static async getEvents(filters: EventFilters = {}) {
    try {
      const {
        eventType,
        status = EventStatus.PUBLISHED, // Default to published events only
        location,
        startTime,
        endTime,
        isOnline,
        isFree,
        organizerId,
        tags,
        categoryIds,
        limit = 20,
        offset = 0,
      } = filters;

      // Build where clause
      const where: Prisma.EventWhereInput = {
        isActive: true,
        status: status || EventStatus.PUBLISHED,
      };

      if (eventType) where.eventType = eventType;
      if (location) {
        where.OR = [
          { location: { contains: location, mode: 'insensitive' } },
          { city: { contains: location, mode: 'insensitive' } },
          { state: { contains: location, mode: 'insensitive' } },
        ];
      }
      if (startTime) where.startTime = { gte: startTime };
      if (endTime) where.endTime = { lte: endTime };
      if (isOnline !== undefined) where.isOnline = isOnline;
      if (isFree !== undefined) where.isFree = isFree;
      if (organizerId) where.organizerId = organizerId;
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }
      if (categoryIds && categoryIds.length > 0) {
        where.categories = {
          some: {
            id: { in: categoryIds }
          }
        };
      }

      // Get events with all necessary data
      const events = await prisma.event.findMany({
        where,
        include: {
          organizer: {
            include: {
              profile: true
            }
          },
          categories: true,
          participants: {
            where: {
              status: {
                in: [ParticipantStatus.REGISTERED, ParticipantStatus.CONFIRMED]
              }
            }
          },
          _count: {
            select: {
              participants: {
                where: {
                  status: {
                    in: [ParticipantStatus.REGISTERED, ParticipantStatus.CONFIRMED]
                  }
                }
              }
            }
          }
        },
        orderBy: { startTime: 'asc' },
        skip: offset,
        take: limit,
      });

      // Get total count for pagination
      const total = await prisma.event.count({ where });

      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const hasMore = currentPage < totalPages;

      return {
        events,
        total,
        hasMore,
        page: currentPage,
        totalPages,
      };
    } catch (error) {
      console.error('EventService.getEvents error:', error);
      throw error;
    }
  }

  // Get a single event by ID
  static async getEventById(eventId: string) {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          include: {
            profile: true
          }
        },
        categories: true,
        eventDetails: true,
        participants: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          where: { isPublic: true },
          include: {
            user: {
              include: {
                profile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            participants: true,
            reviews: true,
            waitlist: true,
          }
        }
      }
    });
  }

  // Get events by organizer
  static async getEventsByOrganizer(organizerId: string, status?: EventStatus) {
    const where: Record<string, unknown> = { organizerId };
    if (status) where.status = status;

    return await prisma.event.findMany({
      where,
      include: {
        categories: true,
        eventDetails: true,
        participants: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            reviews: true,
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  // Delete an event
  static async deleteEvent(eventId: string) {
    return await prisma.event.update({
      where: { id: eventId },
      data: { status: EventStatus.ARCHIVED }
    });
  }

  // Get event categories
  static async getEventCategories() {
    return await prisma.eventCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  // Get event statistics
  static async getEventStats(organizerId?: string) {
    const where: Record<string, unknown> = {};
    if (organizerId) where.organizerId = organizerId;

    const [totalEvents, publishedEvents, draftEvents, completedEvents] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.count({ where: { ...where, status: EventStatus.PUBLISHED } }),
      prisma.event.count({ where: { ...where, status: EventStatus.DRAFT } }),
      prisma.event.count({ where: { ...where, status: EventStatus.COMPLETED } }),
    ]);

    return {
      totalEvents,
      publishedEvents,
      draftEvents,
      completedEvents,
    };
  }
}
