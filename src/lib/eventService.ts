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
    const {
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
      // Create the main event
      const event = await tx.event.create({
        data: {
          ...eventData,
          status: data.status || EventStatus.DRAFT,
          isFree: eventData.isFree ?? (eventData.costPerPerson === 0 || !eventData.costPerPerson),
          tags: eventData.tags || [],
          categories: categoryIds ? {
            connect: categoryIds.map(id => ({ id }))
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

      // Create event details if specific fields are provided
      if (sportType || skillLevel || equipment || rules || format || duration || materials || intensity || ageGroup || customFields) {
        await tx.eventDetails.create({
          data: {
            eventId: event.id,
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
    const {
      limit = 20,
      offset = 0,
      ...filterData
    } = filters;

    const where: Record<string, unknown> = {};

    if (filterData.eventType) where.eventType = filterData.eventType;
    if (filterData.status) where.status = filterData.status;
    if (filterData.location) where.location = { contains: filterData.location, mode: 'insensitive' };
    if (filterData.isOnline !== undefined) where.isOnline = filterData.isOnline;
    if (filterData.isFree !== undefined) where.isFree = filterData.isFree;
    if (filterData.organizerId) where.organizerId = filterData.organizerId;
    if (filterData.tags && filterData.tags.length > 0) {
      where.tags = { hasSome: filterData.tags };
    }
    if (filterData.startTime) where.startTime = { gte: filterData.startTime };
    if (filterData.endTime) where.startTime = { lte: filterData.endTime };
    if (filterData.categoryIds && filterData.categoryIds.length > 0) {
      where.categories = { some: { id: { in: filterData.categoryIds } } };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            include: {
              profile: true
            }
          },
          categories: true,
          eventDetails: true,
          participants: {
            where: { status: ParticipantStatus.CONFIRMED },
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
        orderBy: { startTime: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.event.count({ where })
    ]);

    return {
      events,
      total,
      hasMore: offset + limit < total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
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
