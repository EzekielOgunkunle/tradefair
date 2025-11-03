import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and verify admin role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all analytics data in parallel
    const [
      totalUsers,
      totalVendors,
      approvedVendors,
      pendingVendors,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      vendorPerformance,
      usersByRole,
      ordersByStatus,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total vendors
      prisma.vendor.count(),

      // Approved vendors
      prisma.vendor.count({
        where: { status: "APPROVED" },
      }),

      // Pending vendors
      prisma.vendor.count({
        where: { status: "PENDING" },
      }),

      // Total products
      prisma.listing.count(),

      // Active products
      prisma.listing.count({
        where: { isActive: true },
      }),

      // Total orders
      prisma.order.count(),

      // Total revenue (sum of all completed orders)
      prisma.order.aggregate({
        where: {
          status: {
            in: ["DELIVERED", "SHIPPED", "PROCESSING", "PAID"],
          },
        },
        _sum: {
          totalAmountCents: true,
        },
      }),

      // Recent orders for chart (last 30 days)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id: true,
          totalAmountCents: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // Top vendors by revenue
      prisma.vendor.findMany({
        where: { status: "APPROVED" },
        select: {
          id: true,
          businessName: true,
          rating: true,
          _count: {
            select: {
              orders: true,
              listings: true,
            },
          },
          orders: {
            where: {
              status: {
                in: ["DELIVERED", "SHIPPED", "PROCESSING", "PAID"],
              },
            },
            select: {
              totalAmountCents: true,
            },
          },
        },
        take: 10,
      }),

      // Users by role
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),
    ]);

    // Process vendor performance data
    const processedVendorPerformance = vendorPerformance
      .map((vendor) => ({
        id: vendor.id,
        businessName: vendor.businessName,
        rating: vendor.rating,
        totalOrders: vendor._count.orders,
        totalProducts: vendor._count.listings,
        totalRevenue: vendor.orders.reduce(
          (sum, order) => sum + order.totalAmountCents,
          0
        ),
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Group orders by day for chart
    const ordersByDay = recentOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0, revenue: 0 };
      }
      acc[date].count += 1;
      acc[date].revenue += order.totalAmountCents;
      return acc;
    }, {});

    const chartData = Object.values(ordersByDay);

    // Calculate growth metrics (compare last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [recentOrdersCount, previousOrdersCount] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: last7Days },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: previous7Days, lt: last7Days },
        },
      }),
    ]);

    const orderGrowth =
      previousOrdersCount === 0
        ? 100
        : ((recentOrdersCount - previousOrdersCount) / previousOrdersCount) *
          100;

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalVendors,
          approvedVendors,
          pendingVendors,
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.totalAmountCents || 0,
          orderGrowth: orderGrowth.toFixed(1),
        },
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item._count.role,
        })),
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        topVendors: processedVendorPerformance,
        chartData,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
