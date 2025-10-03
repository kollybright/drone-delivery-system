import { Request, Response } from "express";
import { swaggerSpec } from "../config/swagger";
import swaggerUi from "swagger-ui-express";

export class DocumentationController {
  swaggerUI = swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Drone Delivery API - Swagger UI",
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  serveSwaggerUI = swaggerUi.serve;

  getSwaggerUI(req: Request, res: Response): void {
    const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drone Delivery System API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        docExpansion: "list"
      });
      window.ui = ui;
    }
  </script>
</body>
</html>`;

    res.send(swaggerHtml);
  }

  // Serve Swagger JSON
  getSwaggerJson(req: Request, res: Response): void {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  }
}
