// src/app/api/ingest/orders/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { OrderIngestionSchema, type OrderIngestionPayload } from '@/lib/schemas';

/**
 * @swagger
 * /api/ingest/orders:
 *   post:
 *     summary: Ingest order data
 *     description: Accepts order data, validates it, and (currently) returns a success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderIngestionPayload'
 *     responses:
 *       200:
 *         description: Order data received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order data received for order ID your_order_id.
 *                 data:
 *                   $ref: '#/components/schemas/OrderIngestionPayload'
 *       400:
 *         description: Invalid request payload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request payload.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parseResult = OrderIngestionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Invalid request payload.', errors: parseResult.error.errors },
        { status: 400 }
      );
    }

    const orderData: OrderIngestionPayload = parseResult.data;

    // In a real application, you would save this data to your database.
    // For now, we'll just log it and return a success message.
    console.log('Received order data:', orderData);

    return NextResponse.json(
        { message: `Order data received for order ID ${orderData.id}.`, data: orderData },
        { status: 200 }
    );
  } catch (error) {
    console.error('Error ingesting order data:', error);
    let errorMessage = 'Internal server error.';
     if (error instanceof Error) {
        errorMessage = error.message;
    }
    if (error instanceof SyntaxError) {
        errorMessage = 'Invalid JSON payload.';
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - productName
 *         - quantity
 *         - unitPrice
 *         - totalPrice
 *       properties:
 *         productId:
 *           type: string
 *         productName:
 *           type: string
 *         quantity:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *         unitPrice:
 *           type: number
 *           format: double
 *           minimum: 0
 *         totalPrice:
 *           type: number
 *           format: double
 *           minimum: 0
 *     OrderIngestionPayload:
 *       type: object
 *       required:
 *         - id
 *         - customerId
 *         - orderDate
 *         - items
 *         - totalAmount
 *         - currency
 *       properties:
 *         id:
 *           type: string
 *           description: External unique ID for the order.
 *         customerId:
 *           type: string
 *           description: ID of the customer who placed the order.
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date and time the order was placed (ISO 8601).
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           minItems: 1
 *         totalAmount:
 *           type: number
 *           format: double
 *           minimum: 0
 *           description: Total amount of the order.
 *         currency:
 *           type: string
 *           minLength: 3
 *           maxLength: 3
 *           description: Currency code (e.g., USD, INR).
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *           nullable: true
 *         shippingAddress:
 *           type: object
 *           nullable: true
 *           properties:
 *             street:
 *               type: string
 *               nullable: true
 *             city:
 *               type: string
 *               nullable: true
 *             state:
 *               type: string
 *               nullable: true
 *             zipCode:
 *               type: string
 *               nullable: true
 *             country:
 *               type: string
 *               nullable: true
 *         paymentMethod:
 *           type: string
 *           nullable: true
 *         discountAmount:
 *            type: number
 *            format: double
 *            nullable: true
 *         shippingCost:
 *            type: number
 *            format: double
 *            nullable: true
 *       additionalProperties: true
 *       example:
 *         id: "order_67890"
 *         customerId: "cust_12345"
 *         orderDate: "2024-07-21T14:35:00Z"
 *         items:
 *           - productId: "prod_ABC"
 *             productName: "Awesome T-Shirt"
 *             quantity: 2
 *             unitPrice: 25.00
 *             totalPrice: 50.00
 *           - productId: "prod_XYZ"
 *             productName: "Cool Hat"
 *             quantity: 1
 *             unitPrice: 15.75
 *             totalPrice: 15.75
 *         totalAmount: 65.75
 *         currency: "USD"
 *         status: "processing"
 *         shippingAddress:
 *           street: "456 Oak Ave"
 *           city: "Otherville"
 *           state: "TX"
 *           zipCode: "75001"
 *           country: "USA"
 *         paymentMethod: "Credit Card"
 *         custom_order_field: "some_value"
 */
