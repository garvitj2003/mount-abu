// src/constants/filters.ts

export type ApplicationFlag = 
  | "ALL"
  | "CITIZEN"
  | "OBJECTED_CITIZEN_ACTION"
  | "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_ACTION"
  | "NEW_APPLICATION_REQUIRES_JEN_INSPECTION"
  | "NEW_APPLICATION_REQUIRES_JEN_FIELD_INSPECTION"
  | "NEW_APPLICATION_REQUIRES_JEN_MATERIAL_ENTRY"
  | "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION"
  | "RENOVATION_REQUIRES_COMMISSIONER_FORWARD"
  | "RENOVATION_REQUIRES_DEPT_COMMENT"
  | "RENOVATION_REQUIRES_JEN_FIELD_INSPECTION"
  | "RENOVATION_REQUIRES_JEN_MATERIAL_ENTRY"
  | "RENOVATION_REQUIRES_COMMISSIONER_ACTION"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_ACTION"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_1"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_2"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_3"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_4"
  | "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_5"
  | "RENOVATION_OVERDUE_COMMENTS"
  | "RENOVATION_OVERDUE_COMMENTS_JEN"
  | "RENOVATION_OVERDUE_COMMENTS_ATP"
  | "RENOVATION_OVERDUE_COMMENTS_LAND"
  | "RENOVATION_OVERDUE_COMMENTS_LEGAL"
  | "PHASE_READY_FOR_NAKA"
  | "NAKA_INCHARGE_ACTION";

export interface FilterOption {
  label: string;
  value: ApplicationFlag;
}

export interface RoleFilterConfig {
  newConstruction: FilterOption[];
  renovation: FilterOption[];
}

export const ROLE_FILTERS: Record<string, RoleFilterConfig> = {
  SUPERADMIN: {
    newConstruction: [
      { label: "Requires Nodal Action", value: "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_ACTION" },
      { label: "Requires JEN Inspection", value: "NEW_APPLICATION_REQUIRES_JEN_INSPECTION" },
      { label: "Requires JEN Field Inspection", value: "NEW_APPLICATION_REQUIRES_JEN_FIELD_INSPECTION" },
      { label: "Requires JEN Material Entry", value: "NEW_APPLICATION_REQUIRES_JEN_MATERIAL_ENTRY" },
      { label: "Requires Token Generation", value: "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION" },
    ],
    renovation: [
      { label: "Requires Commissioner Forward", value: "RENOVATION_REQUIRES_COMMISSIONER_FORWARD" },
      { label: "Requires Dept Comment", value: "RENOVATION_REQUIRES_DEPT_COMMENT" },
      { label: "Requires Commissioner Action", value: "RENOVATION_REQUIRES_COMMISSIONER_ACTION" },
      { label: "Requires Nodal Action", value: "RENOVATION_REQUIRES_NODAL_OFFICER_ACTION" },
      { label: "Requires Token Generation", value: "RENOVATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION" },
      { label: "Overdue Comments", value: "RENOVATION_OVERDUE_COMMENTS" },
    ],
  },
  COMMISSIONER: {
    newConstruction: [], // Commissioner mainly deals with renovation/approvals via Nodal Officer usually, but can view ALL
    renovation: [
      { label: "Requires Forwarding", value: "RENOVATION_REQUIRES_COMMISSIONER_FORWARD" },
      { label: "Requires Action", value: "RENOVATION_REQUIRES_COMMISSIONER_ACTION" },
    ],
  },
  NODAL_OFFICER: {
    newConstruction: [
      { label: "Requires Action", value: "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_ACTION" },
      { label: "Requires Token Generation", value: "NEW_APPLICATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION" },
    ],
    renovation: [
      { label: "Requires Action", value: "RENOVATION_REQUIRES_NODAL_OFFICER_ACTION" },
      { label: "Requires Token Generation", value: "RENOVATION_REQUIRES_NODAL_OFFICER_TOKEN_GENERATION" },
      { label: "Approval Phase 1", value: "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_1" },
      { label: "Approval Phase 2", value: "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_2" },
      { label: "Approval Phase 3", value: "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_3" },
      { label: "Approval Phase 4", value: "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_4" },
      { label: "Approval Phase 5", value: "RENOVATION_REQUIRES_NODAL_OFFICER_APPROVAL_PHASE_5" },
    ],
  },
  JEN: {
    newConstruction: [
      { label: "Requires Inspection", value: "NEW_APPLICATION_REQUIRES_JEN_INSPECTION" },
      { label: "Requires Field Inspection", value: "NEW_APPLICATION_REQUIRES_JEN_FIELD_INSPECTION" },
      { label: "Requires Material Entry", value: "NEW_APPLICATION_REQUIRES_JEN_MATERIAL_ENTRY" },
    ],
    renovation: [
      { label: "Requires Field Inspection", value: "RENOVATION_REQUIRES_JEN_FIELD_INSPECTION" },
      { label: "Requires Material Entry", value: "RENOVATION_REQUIRES_JEN_MATERIAL_ENTRY" },
      { label: "Overdue Comments", value: "RENOVATION_OVERDUE_COMMENTS_JEN" },
    ],
  },
  DEPT_LAND: {
    newConstruction: [],
    renovation: [
      { label: "Overdue Comments", value: "RENOVATION_OVERDUE_COMMENTS_LAND" },
      { label: "Requires Comment", value: "RENOVATION_REQUIRES_DEPT_COMMENT" },
    ],
  },
  DEPT_LEGAL: {
    newConstruction: [],
    renovation: [
      { label: "Overdue Comments", value: "RENOVATION_OVERDUE_COMMENTS_LEGAL" },
      { label: "Requires Comment", value: "RENOVATION_REQUIRES_DEPT_COMMENT" },
    ],
  },
  DEPT_ATP: {
    newConstruction: [],
    renovation: [
      { label: "Overdue Comments", value: "RENOVATION_OVERDUE_COMMENTS_ATP" },
      { label: "Requires Comment", value: "RENOVATION_REQUIRES_DEPT_COMMENT" },
    ],
  },
  NAKA_INCHARGE: {
    newConstruction: [
      { label: "Naka Action", value: "NAKA_INCHARGE_ACTION" },
      { label: "Phase Ready", value: "PHASE_READY_FOR_NAKA" },
    ],
    renovation: [
      { label: "Naka Action", value: "NAKA_INCHARGE_ACTION" },
      { label: "Phase Ready", value: "PHASE_READY_FOR_NAKA" },
    ],
  },
};
