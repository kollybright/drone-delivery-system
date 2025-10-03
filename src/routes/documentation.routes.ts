import { Router, Request } from "express";

import { DocumentationController } from "../controllers";

const router = Router();
const documentationController = new DocumentationController();

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: Swagger UI Documentation
 *     description: Interactive API documentation with testing capabilities
 *     tags: [Documentation]
 */
router.get("/", (req, res) => documentationController.getSwaggerUI(req, res));

/**
 * @swagger
 * /docs/openapi.json:
 *   get:
 *     summary: OpenAPI Specification
 *     description: Raw OpenAPI specification in JSON format
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/openapi.json", (req, res) =>
  documentationController.getSwaggerJson(req, res)
);

export default router;
