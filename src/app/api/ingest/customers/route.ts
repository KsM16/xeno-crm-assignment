
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
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: NextRequest) {
  console.log('--- CUSTOMER INGESTION API /api/ingest/customers HIT ---');
  console.log('Request Method:', request.method);
  console.log('Request URL:', request.url);
  // Logging all headers can be verbose, but useful for debugging auth issues
  const headerObject: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headerObject[key] = value;
  });
  console.log('Request Headers:', JSON.stringify(headerObject, null, 2));

  try {
    const body: unknown = await request.json();
    const parseResult = CustomerIngestionSchema.safeParse(body);

    if (!parseResult.success) {
      console.log('Validation errors:', parseResult.error.errors);
      return NextResponse.json(
        { message: 'Invalid request payload.', errors: parseResult.error.errors },
        { status: 400 }
      );
    }

    const customerData: CustomerIngestionPayload = parseResult.data;

    // In a real application, you would save this data to your database.
    // For now, we'll just log it and return a success message.
    console.log('Received and validated customer data for ID:', customerData.id);

    return NextResponse.json(
        { message: `Customer data received for customer ID ${customerData.id}.`, data: customerData },
        { status: 200 }
    );
  } catch (error) {
    console.error('Error during customer data ingestion:', error);
    let errorMessage = 'Internal server error.';
    let statusCode = 500;

    if (error instanceof SyntaxError) {
        errorMessage = 'Invalid JSON payload. Please ensure the request body is correctly formatted JSON.';
        statusCode = 400;
    } else if (error instanceof Error) {
        // Avoid leaking sensitive error messages if not a SyntaxError
        errorMessage = `An unexpected error occurred: ${error.message}`;
    }
    
    // Log the specific error that occurred before returning a generic message
    console.log(`Responding with status ${statusCode} and message: ${errorMessage}`);
    
    return NextResponse.json({ message: errorMessage }, { status: statusCode });
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
