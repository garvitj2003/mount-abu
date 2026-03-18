import { components } from "@/types/api";

type UserRole = components["schemas"]["UserRole"];

export const ROLE_PERMISSIONS: Partial<Record<UserRole, string[]>> = {
  SUPERADMIN: [
    "/authority/applications",
    "/authority/complaints",
    "/authority/token-management",
    "/authority/vehicle-entries",
    "/authority/reports",
    "/authority/website-content",
    "/authority/users",
    "/authority/master-data",
    "/authority/audit-logs",
  ],
  NODAL_OFFICER: [
    "/authority/applications",
    "/authority/token-management",
    "/authority/vehicle-entries",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  COMMISSIONER: [
    "/authority/applications",
    "/authority/complaints",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  JEN: [
    "/authority/applications",
    "/authority/complaints",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  DEPT_LAND: [
    "/authority/applications",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  DEPT_LEGAL: [
    "/authority/applications",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  DEPT_ATP: [
    "/authority/applications",
    "/authority/reports",
    "/authority/audit-logs",
  ],
  NAKA_INCHARGE: [
    "/authority/vehicle-entries",
    "/authority/reports",
    "/authority/audit-logs",
  ],
};
