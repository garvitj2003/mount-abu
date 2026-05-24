import { components } from "@/types/api";

type UserRole = components["schemas"]["UserRole"];

export const ROLE_PERMISSIONS: Partial<Record<UserRole, string[]>> = {
  SUPERADMIN: [
    "/authority/applications",
    "/authority/complaints",
    "/authority/token-management",
    "/authority/vehicle-entries",
    "/authority/website-content",
    "/authority/users",
    "/authority/master-data",
    "/authority/audit-logs",
  ],
  NODAL_OFFICER: [
    "/authority/applications",
    "/authority/token",
    "/authority/vehicle-entries",
    "/authority/audit-logs",
  ],
  COMMISSIONER: [
    "/authority/applications",
    "/authority/complaints",
    "/authority/audit-logs",
  ],
  JEN: [
    "/authority/applications",
    "/authority/complaints",
  ],
  AEN: [
    "/authority/complaints",
  ],
  SIN: [
    "/authority/complaints",
  ],
  RIN: [
    "/authority/complaints",
  ],
  DEPT_LAND: [
    "/authority/applications",
  ],
  DEPT_LEGAL: [
    "/authority/applications",
  ],
  DEPT_ATP: [
    "/authority/applications",
  ],
  NAKA_INCHARGE: [
    "/authority/vehicle-entries",
  ],
};
