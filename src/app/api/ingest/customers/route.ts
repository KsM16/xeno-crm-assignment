// src/app/api/ingest/customers/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { CustomerIngestionSchema, type CustomerIngestionPayload } from '@/lib/schemas';

/**
 * @swagger
 * /api/ingest/customers:
 *   post:
 *     summary: Ingest customer data
 *     description: Accepts customer data, validates it, and (currently) returns a success message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerIngestionPayload'
 *     responses:
 *       200:
 *         description: Customer data received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer data received for customer ID your_customer_id.
 *                 data:
 *                   $ref: '#/components/schemas/CustomerIngestionPayload'
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
    const parseResult = CustomerIngestionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Invalid request payload.', errors: parseResult.error.errors },
        { status: 400 }
      );
    }

    const customerData: CustomerIngestionPayload = parseResult.data;

    // In a real application, you would save this data to your database.
    // For now, we'll just log it and return a success message.
    console.log('Received customer data:', customerData);

    return NextResponse.json(
        { message: `Customer data received for customer ID ${customerData.id}.`, data: customerData },
        { status: 200 }
    );
  } catch (error) {
    console.error('Error ingesting customer data:', error);
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
 *     CustomerIngestionPayload:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: External unique ID for the customer.
 *         name:
 *           type: string
 *           description: Customer's full name.
 *         email:
 *           type: string
 *           format: email
 *           description: Customer's email address.
 *         phone:
 *           type: string
 *           nullable: true
 *           description: Customer's phone number.
 *         address:
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
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: List of tags associated with the customer.
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Customer's registration date (ISO 8601).
 *         lastLoginDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Customer's last login date (ISO 8601).
 *       additionalProperties: true
 *       example:
 *         id: "cust_12345"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         phone: "555-123-4567"
 *         address:
 *           street: "123 Main St"
 *           city: "Anytown"
 *           state: "CA"
 *           zipCode: "90210"
 *           country: "USA"
 *         tags: ["vip", "newsletter_subscriber"]
 *         registrationDate: "2023-01-15T10:00:00Z"
 *         lastLoginDate: "2024-07-20T15:30:00Z"
 *         custom_field: "custom_value"
 */
