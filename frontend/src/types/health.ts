export interface HealthResponse {
  status: "ok";
  database: "ok";
  migration: string | null;
}
