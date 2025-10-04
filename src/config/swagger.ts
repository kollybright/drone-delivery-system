import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Drone Delivery System API",
      version: version,
      description:
        "A REST API for managing drone medication deliveries - Blusalt Engineering Challenge",
      contact: {
        name: "Blusalt Support",
        email: "hr@blusalt.net",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Drone: {
          type: "object",
          required: [
            "serialNumber",
            "model",
            "weightLimit",
            "batteryCapacity",
            "state",
          ],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the drone",
              example: "id_1694000000000_abc123def",
            },
            serialNumber: {
              type: "string",
              maxLength: 100,
              description: "Drone serial number (max 100 characters)",
              example: "DRONE-001",
            },
            model: {
              type: "string",
              enum: [
                "Lightweight",
                "Middleweight",
                "Cruiserweight",
                "Heavyweight",
              ],
              description: "Drone model type",
            },
            weightLimit: {
              type: "number",
              maximum: 500,
              description: "Maximum weight capacity in grams (max 500gr)",
              example: 300,
            },
            batteryCapacity: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Battery level percentage (0-100%)",
              example: 100,
            },
            state: {
              type: "string",
              enum: [
                "IDLE",
                "LOADING",
                "LOADED",
                "DELIVERING",
                "DELIVERED",
                "RETURNING",
              ],
              description: "Current state of the drone",
            },
            medications: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Medication",
              },
              description: "List of medications loaded on the drone",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Medication: {
          type: "object",
          required: ["name", "weight", "code", "image"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the medication",
              example: "id_1694000000000_xyz789",
            },
            name: {
              type: "string",
              pattern: "^[a-zA-Z0-9\\-_]+$",
              description:
                "Medication name (letters, numbers, hyphens, underscores only)",
              example: "Paracetamol-500mg",
            },
            weight: {
              type: "number",
              minimum: 0,
              exclusiveMinimum: true,
              description: "Weight in grams (must be positive)",
              example: 50,
            },
            code: {
              type: "string",
              pattern: "^[A-Z0-9_]+$",
              description:
                "Medication code (uppercase letters, numbers, underscores only)",
              example: "PARA_500",
            },
            image: {
              type: "string",
              description: "Image URL or path for the medication",
              example: "paracetamol.jpg",
            },
            droneId: {
              type: "string",
              description: "ID of the drone this medication is loaded on",
              example: "id_1694000000000_abc123def",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        BatteryInfo: {
          type: "object",
          properties: {
            droneId: {
              type: "string",
              description: "Drone identifier",
            },
            batteryLevel: {
              type: "number",
              description: "Current battery level percentage",
            },
            status: {
              type: "string",
              enum: ["OK", "LOW_BATTERY"],
              description: "Battery status",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              description: "Error message description",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Success message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
      },
      parameters: {
        DroneId: {
          in: "path",
          name: "droneId",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID of the drone",
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                error: "Drone not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                error: "Validation error description",
              },
            },
          },
        },
        LowBatteryError: {
          description: "Battery level too low for operation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                error: "Cannot load drone with battery level below 25%",
              },
            },
          },
        },
        OverweightError: {
          description: "Weight limit exceeded",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                error: "Cannot load medication. Weight limit exceeded.",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJSDoc(options);
