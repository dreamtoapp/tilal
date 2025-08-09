'use server';

import prisma from '@/lib/prisma';

// TODO: SIMPLIFIED DRIVER STATUS SYSTEM
// ====================================
// Current requirement: Only two driver states for UI
// 1. "متاح" (Available): Driver is not on any delivery mission
// 2. "غير متاح (في مهمة توصيل)" (Unavailable - On Delivery): Driver is currently on delivery
//
// Implementation steps needed:
// 1. In getAvailableDrivers(), check Order table for active deliveries per driver
// 2. Query orders with status 'IN_TRANSIT', 'PICKED_UP', or 'OUT_FOR_DELIVERY'  
// 3. If driver has active delivery orders: mark as unavailable
// 4. If driver has no active delivery orders: mark as available
// 5. Update UI filtering logic to use this simplified boolean state
// 6. Remove complex status categories (busy, offline, etc.) from UI

export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  email?: string;
  rating: number;
  totalDeliveries: number;
  completionRate: number;
  averageDeliveryTime: number; // in minutes
  status: 'available' | 'busy' | 'offline';
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
  currentOrders: number;
  maxOrders: number;
  vehicle: {
    type: string;
    plateNumber?: string;
    color?: string;
    model?: string;
  };
  distanceFromStore?: number; // from driver to store in km
  estimatedArrival?: number; // in minutes to reach store
  experience: number; // years
  profileImage?: string;
  
  // TODO: Add simplified status logic for UI
  // isOnDelivery: boolean; // true if driver has active delivery orders
  // isAvailable: boolean;  // true if driver can accept new orders (not on delivery)
}

interface GetDriversParams {
  orderId: string;
  status?: 'available' | 'busy' | 'offline';
  maxDistance?: number; // in km
  minRating?: number;
  sortBy?: 'distance' | 'rating' | 'availability' | 'performance';
}

export async function getAvailableDrivers({
  orderId,
  status = 'available',
  maxDistance = 50,
  minRating = 3.0,
  sortBy = 'distance'
}: GetDriversParams): Promise<DriverDetails[]> {
  // Note: orderId, status, and minRating are not currently used in the implementation
  // They are kept for future feature development
  void orderId;
  void status;
  void minRating;
  try {
    // TODO: Get store/warehouse location from settings/company table
    // For now using default Riyadh coordinates - should be configurable
    const storeLat = 24.7136; // Default store location - Riyadh
    const storeLng = 46.6753; // Should come from Company/Settings table

    // Fetch drivers (users with DRIVER role) with their statistics
    const drivers = await prisma.user.findMany({
      where: {
        role: 'DRIVER',
        // TODO: Add status/availability filters when driver status field is added to User model
        // TODO: Add isActive field to User model for driver management
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        image: true,
        updatedAt: true,
        // Vehicle fields from database
        vehicleType: true,
        vehiclePlateNumber: true,
        vehicleColor: true,
        vehicleModel: true,
        // Driver settings
        maxOrders: true,
        experience: true,
        isActive: true,
        driverOrders: {
          where: {
            status: {
              in: ['PENDING', 'IN_TRANSIT'],
            },
          },
          select: { id: true },
        },
        _count: {
          select: {
            driverOrders: true,
          },
        },
      },
    });

    // Transform and calculate additional metrics
    const driversWithMetrics: DriverDetails[] = await Promise.all(
      drivers.map(async (driver) => {
        // Calculate performance metrics
        const totalDelivered = await prisma.order.count({
          where: { 
            driverId: driver.id,
            status: 'DELIVERED'
          },
        });
        const totalOrders = await prisma.order.count({
          where: { driverId: driver.id },
        });
        
        const completionRate = totalOrders > 0 ? (totalDelivered / totalOrders) * 100 : 0;
        
        // TODO: Calculate real average delivery time from order history
        const averageDeliveryTime = Math.floor(Math.random() * 30) + 20; // 20-50 minutes MOCK DATA
        
        // FIXED: Calculate distance from driver location to STORE (not customer)
        // This is correct because: Driver → Store → Customer
        // TODO: Get driver location from a separate driver location tracking system
        const driverLat = 24.7136; // Default driver location - should come from driver tracking
        const driverLng = 46.6753; // Default driver location - should come from driver tracking
        
        const distanceFromStore = calculateDistance(driverLat, driverLng, storeLat, storeLng);
        
        // Estimate arrival time to STORE based on distance
        const estimatedArrivalToStore = Math.ceil(distanceFromStore * 2.5); // Rough estimate: 2.5 min per km
        
        return {
          id: driver.id,
          name: driver.name || 'سائق',
          phone: driver.phone || '',
          email: driver.email || undefined,
          // TODO: Add rating system to User model or create separate DriverRating table
          rating: 0, // No rating system implemented yet
          totalDeliveries: totalDelivered,
          completionRate: Math.round(completionRate),
          averageDeliveryTime,
          // TODO: Simplify status logic for UI - only two states needed:
          // 1. Available: not on delivery mission (can accept new orders)
          // 2. Unavailable: currently on delivery mission (busy with delivery)
          // Implementation needed:
          // - Check if driver has orders with status 'IN_TRANSIT' or 'PICKED_UP'
          // - If yes: mark as unavailable (on delivery)
          // - If no: mark as available
          status: 'available' as 'available' | 'busy' | 'offline', // Default status
          location: {
            latitude: driverLat,
            longitude: driverLng,
            lastUpdated: driver.updatedAt,
          },
          currentOrders: driver.driverOrders.length,
          maxOrders: driver.maxOrders || 3, // Use database value or default
          vehicle: {
            type: getVehicleTypeLabel(driver.vehicleType || 'MOTORCYCLE'),
            plateNumber: driver.vehiclePlateNumber || undefined,
            color: driver.vehicleColor || undefined,
            model: driver.vehicleModel || undefined,
          },
          distanceFromStore: Math.round(distanceFromStore * 100) / 100, // Round to 2 decimal places
          estimatedArrival: estimatedArrivalToStore,
          experience: driver.experience || 1, // Use database value or default
          profileImage: driver.image || undefined,
        };
      })
    );

    // Filter by distance from store if specified
    const filteredDrivers = driversWithMetrics.filter(
      driver => (driver.distanceFromStore || 0) <= maxDistance
    );

    // Sort drivers based on criteria
    return sortDrivers(filteredDrivers, sortBy);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    return [];
  }
}

// Helper function to get vehicle type label in Arabic
function getVehicleTypeLabel(vehicleType: string): string {
  const vehicleLabels: Record<string, string> = {
    MOTORCYCLE: 'دراجة نارية',
    CAR: 'سيارة',
    VAN: 'فان',
    TRUCK: 'شاحنة صغيرة',
    BICYCLE: 'دراجة هوائية',
  };
  return vehicleLabels[vehicleType] || 'دراجة نارية';
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function sortDrivers(drivers: DriverDetails[], sortBy: string): DriverDetails[] {
  return drivers.sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distanceFromStore || Infinity) - (b.distanceFromStore || Infinity);
      case 'rating':
        // TODO: When rating system is implemented, this will work properly
        return b.rating - a.rating;
      case 'availability':
        return a.currentOrders - b.currentOrders;
      case 'performance':
        // TODO: Improve performance calculation when rating system is available
        const scoreA = (a.completionRate * 0.6 + (100 - a.averageDeliveryTime) * 0.4);
        const scoreB = (b.completionRate * 0.6 + (100 - b.averageDeliveryTime) * 0.4);
        return scoreB - scoreA;
      default:
        return (a.distanceFromStore || Infinity) - (b.distanceFromStore || Infinity);
    }
  });
} 