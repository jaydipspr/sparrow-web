import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Sparrow Softtech API Documentation",
			version: "1.0.0",
			description: "API documentation for Sparrow Softtech Corporate Business Website",
			contact: {
				name: "API Support",
				email: "support@sparrowsofttech.com",
			},
		},
		servers: [
			{
				url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
				description: "Development server",
			},
			{
				url: "https://api.sparrowsofttech.com",
				description: "Production server",
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter JWT token obtained from /api/admin/auth/login",
				},
			},
			schemas: {
				Service: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "Service ID",
						},
						name: {
							type: "string",
							description: "Service name",
							example: "Web Development",
						},
						title: {
							type: "string",
							description: "Service title",
							example: "Professional Web Development Services",
						},
						img: {
							type: "string",
							description: "Service image URL",
							example: "/images/service/service-1.webp",
						},
						description: {
							type: "string",
							description: "Service description",
						},
						points: {
							type: "array",
							items: {
								type: "string",
							},
							description: "List of service points/features",
						},
						isActive: {
							type: "boolean",
							description: "Service active status",
							default: true,
						},
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				Technology: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "Technology ID",
						},
						name: {
							type: "string",
							description: "Technology name",
							example: "React",
						},
						category: {
							type: "string",
							enum: ["Web Development", "Application Development", "Backend & Database"],
							description: "Technology category",
						},
						title: {
							type: "string",
							description: "Technology title",
						},
						img: {
							type: "string",
							description: "Technology image URL",
						},
						description: {
							type: "string",
							description: "Technology description",
						},
						features: {
							type: "array",
							items: {
								type: "string",
							},
							description: "List of technology features",
						},
						isActive: {
							type: "boolean",
							description: "Technology active status",
							default: true,
						},
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				Error: {
					type: "object",
					properties: {
						error: {
							type: "string",
							description: "Error message",
						},
						details: {
							type: "string",
							description: "Error details",
						},
					},
				},
				Pagination: {
					type: "object",
					properties: {
						currentPage: {
							type: "integer",
							description: "Current page number",
						},
						limit: {
							type: "integer",
							description: "Items per page",
						},
						totalCount: {
							type: "integer",
							description: "Total number of items",
						},
						totalPages: {
							type: "integer",
							description: "Total number of pages",
						},
						hasNextPage: {
							type: "boolean",
							description: "Whether there is a next page",
						},
						hasPrevPage: {
							type: "boolean",
							description: "Whether there is a previous page",
						},
					},
				},
			},
		},
		tags: [
			{
				name: "Admin Auth",
				description: "Admin authentication endpoints",
			},
			{
				name: "Admin Services",
				description: "Admin service management endpoints",
			},
			{
				name: "Admin Technology",
				description: "Admin technology management endpoints",
			},
			{
				name: "Public Services",
				description: "Public service endpoints",
			},
			{
				name: "Public Technology",
				description: "Public technology endpoints",
			},
		],
	},
	apis: [
		"./src/app/api/**/*.js",
		"./src/pages/api/**/*.js",
	],
};

export const swaggerSpec = swaggerJsdoc(options);
