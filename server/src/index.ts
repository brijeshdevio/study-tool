import express, { type Response, type Request } from "express";
import cors from "cors";
import axios from "axios";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ======== CONFIG ========
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim());

// ======== SECURITY ========
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
  })
);

// ======== MIDDLEWARE ========
app.use(express.json({ limit: "2mb" })); // prevent large body attacks
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(morgan("combined")); // logs all requests

// ======== ROOT ENDPOINT ========
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the API Proxy Backend",
    endpoints: {
      proxy: {
        method: "POST",
        url: "/api/proxy",
        description: "Proxy any API request",
        body: {
          method: "HTTP method (GET, POST, etc.)",
          url: "Target API URL",
          headers: "Optional headers as key-value pairs",
          params: "Optional query parameters as key-value pairs",
          data: "Optional request body for POST/PUT requests",
        },
        response: {
          status: "HTTP status code of the response",
          statusText: "Status text of the response",
          headers: "Response headers as key-value pairs",
          json: "JSON response body (if applicable)",
          raw: "Raw response body",
          html: "HTML response body (if applicable)",
        },
      },
    },
  });
});

// ======== PROXY ENDPOINT ========
app.post("/api/proxy", async (req, res) => {
  let { method, url, headers, params, data } = req.body;

  // Basic input validation
  if (!method || !url) {
    return res.status(400).json({ error: "Method and URL are required" });
  }
  method = method.toUpperCase();
  if (
    !["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
      method
    )
  ) {
    return res.status(400).json({ error: "Invalid HTTP method" });
  }

  try {
    const response = await axios({
      method,
      url,
      headers: headers || {},
      params: params || {},
      data: data || {},
      timeout: 10000, // 10s timeout
      validateStatus: () => true, // handle status codes ourselves
    });

    const {
      status,
      statusText,
      headers: resHeaders,
      data: responseData,
    } = response;

    const result: Record<string, unknown> = {
      status,
      statusText,
      headers: resHeaders,
      json: null,
      raw: null,
      html: null,
    };

    const contentType = resHeaders["content-type"] || "";

    if (typeof responseData === "object") {
      result.json = JSON.stringify(responseData, null, 2);
      result.raw = result.json;
    } else {
      result.raw = responseData;
    }

    if (
      typeof responseData === "string" &&
      (contentType.includes("text/html") ||
        responseData.trim().startsWith("<!DOCTYPE html"))
    ) {
      result.html = responseData;
    }

    res.status(status).json(result);
  } catch (err: unknown) {
    // Check if err is an object and has a 'response' property
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as any).response === "object"
    ) {
      const errorResponse = (
        err as {
          response: {
            status: number;
            statusText: string;
            headers: Record<string, string>;
            data: unknown;
          };
        }
      ).response;

      return res.status(errorResponse.status).json({
        error: "Target API returned an error",
        status: errorResponse.status,
        statusText: errorResponse.statusText,
        headers: errorResponse.headers,
        body: errorResponse.data,
      });
    }

    // Check if the error is an AxiosError with a 'request' but no response
    if (
      typeof err === "object" &&
      err !== null &&
      "request" in err &&
      typeof (err as any).request === "object"
    ) {
      return res.status(504).json({
        error: "No response from target API",
        details: (err as any).message,
      });
    }

    // Unknown error
    return res.status(500).json({
      error: "Proxy request failed",
      details: (err as any).message ?? "Unknown error",
    });
  }
});

if(process.env.NODE_ENV === "development") {
  // Enable additional logging or debugging features
  app.use(morgan("dev"));
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// ======== EXPORT FOR VERCEL ========
export default app;
