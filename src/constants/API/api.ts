const DOMAIN_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

export const AUTH_API = {
  LOGIN_DIRECTOR: `${DOMAIN_URL}/api/auth/director/login`,
  LOGIN_EMPLOYEE: `${DOMAIN_URL}/api/auth/employee/login`,
  LOGIN_HR: `${DOMAIN_URL}/api/auth/hr/login`,
}

export const MANAGEMENT_API = {
  GET_GENERAL_STATS: `/api/web/management/get-general-stats`,
  GET_ATTENDANCE_STATS: `/api/web/management/get-average-stats`,
  GET_DEPARTMENT_STATS: `/api/web/management/get-department-stats`,
  GET_RECENT_JOINED_EMPLOYEES: `/api/web/management/get-recent-joined-employees`,
  GET_UPCOMING_BIRTHDAYS: `/api/web/management/get-upcoming-birthdays`,
  GET_LIVE_ROSTER: `/api/web/management/attendance/live-roster`,
  GET_PENDING_CORRECTIONS_COUNT: `/api/web/management/attendance/pending-corrections-count`,
  GET_CORRECTIONS: `/api/web/management/attendance/corrections`,
  GET_HISTORICAL_LEDGER: `/api/web/management/attendance/historical-ledger`,
  GET_ALL_EMPLOYEES: `/api/web/management/employees`,
  GET_SINGLE_EMPLOYEE: `/api/web/management/employees`,
  GET_ALL_EMPLOYEE_EXCEL: `/api/web/management/employees/export/master-data`,
  GET_PAYROLL_LIST: `/api/web/management/payroll/payrollList`,
  PROCESS_ALL_ACTIVE_PAYROLL: `/api/web/management/payroll/process-all-active`,
  EXPORT_PAYROLL: `/api/web/management/payroll/export`,
  DOWNLOAD_SALARY_SLIP_PDF: (id: string) => `/api/web/management/payroll/salary-slip/${id}`,
  GET_PENDING_REIMBURSEMENTS: `/api/web/management/reimbursement/pending`,
  GET_HISTORICAL_REIMBURSEMENTS: `/api/web/management/reimbursement/historical`,
  GET_HOLIDAYS: `/api/web/management/holidays`,
  GET_ALERTS: `/api/web/management/announcements/check`,
  // GURUKUL (VIDEOS)
  GET_VIDEOS: `/api/web/management/gurukul/videos`,
}

export const HR_API = {
  //Profile endpoints
  GET_PROFILE: `/api/web/hr/get-profile`,
  CHANGE_PASSWORD: `/api/web/hr/change-password`,

  APPROVE_CORRECTION: (id: string) => `/api/web/hr/attendance/corrections/${id}/approve`,
  REJECT_CORRECTION: (id: string) => `/api/web/hr/attendance/corrections/${id}/reject`,

  // Leave endpoints
  GET_PENDING_LEAVES: `/api/web/hr/leaves/pending`,
  APPROVE_LEAVE: (id: string) => `/api/web/hr/leaves/${id}/approve`,
  REJECT_LEAVE: (id: string) => `/api/web/hr/leaves/${id}/reject`,
  GET_HISTORICAL_LEAVES: `/api/web/hr/leaves/historical`,

  //Employee endpoints
  GET_MANAGER_LIST: `/api/web/hr/employees/leadership`,
  GET_NEW_EMPLOYEE_CODE: `/api/web/hr/employees/new-code`,
  CREATE_EMPLOYEE: `/api/web/hr/employees/create`,
  UPDATE_EMPLOYEE: (id: string) => `/api/web/hr/employees/${id}`,

  // Reimbursement endpoints
  APPROVE_REIMBURSEMENT: (id: string) => `/api/web/hr/reimbursement/${id}/approve`,
  REJECT_REIMBURSEMENT: (id: string) => `/api/web/hr/reimbursement/${id}/reject`,

  // ─── COMPLAINT ENDPOINTS (ADDED) ───
  GET_LIVE_COMPLAINTS: `/api/web/hr/complaints/live`,
  GET_HISTORICAL_COMPLAINTS: `/api/web/hr/complaints/historical`,
  UPDATE_COMPLAINT_STATUS: (id: string) => `/api/web/hr/complaints/${id}/status`,

  // ─── HOLIDAY ENDPOINTS (ADDED) ───
  CREATE_HOLIDAY: `/api/web/hr/holidays`,
  DELETE_HOLIDAY: (id: string) => `/api/web/hr/holidays/${id}`,

  // ─── ANNOUNCEMENT ENDPOINTS (ADDED) ───
  UPSERT_ALERT: `/api/web/hr/announcements/upsert`,

  // -- GURUKUL (VIDEOS)
  CREATE_VIDEO: `/api/web/hr/gurukul/videos`,
  UPDATE_VIDEO: (id: string) => `/api/web/hr/gurukul/videos/${id}`,
  DELETE_VIDEO: (id: string) => `/api/web/hr/gurukul/videos/${id}`,
}

export const DIRECTOR_API = {
  GET_PENDING_LEAVES: `/api/web/director/leaves/pending`,
  APPROVE_LEAVE: (id: string) => `/api/web/director/leaves/${id}/approve`,
  REJECT_LEAVE: (id: string) => `/api/web/director/leaves/${id}/reject`,
  GET_HISTORICAL_LEAVES: `/api/web/director/leaves/historical`,
  //Profile endpoints
  GET_PROFILE: `/api/web/director/get-profile`,
  CHANGE_PASSWORD: `/api/web/director/change-password`,

  // ─── COMPLAINT ENDPOINTS (ADDED) ───
  GET_LIVE_COMPLAINTS: `/api/web/director/complaints/live`,
  GET_HISTORICAL_COMPLAINTS: `/api/web/director/complaints/historical`,
  UPDATE_COMPLAINT_STATUS: (id: string) => `/api/web/director/complaints/${id}/status`,
};

export const EMPLOYEE_API = {
  GET_PROFILE: `/api/web/employee/profile`,
  SYSTEM_CONFIGS: `/api/v1/settings/system-configs`,
  GET_ATTENDANCE_STATUS: `/api/web/attendance/today-status`,
  GET_PERFORMANCE: `/api/web/attendance/insights/performance`,
  CHECK_IN: `/api/web/attendance/check-in`,
  GET_MONTHLY_ATTENDANCE: `/api/web/attendance/monthly`,
  REQUEST_CORRECTION: (attendanceId: string) => `/api/web/attendance/correction/${attendanceId}`,
  GET_MY_LEAVES: `/api/web/leaves/my`,
  CANCEL_LEAVE: (leaveId: string) => `/api/web/leaves/cancel/${leaveId}`,
  GET_ACTIVE_TOKENS: `/api/web/leaves/ledger`,
  APPLY_LEAVE: `/api/web/leaves/apply`,
  PREVIEW_PAYROLL: `/api/web/payroll/preview`,
  GET_PAYROLL_LIST: `/api/web/payroll/list`,
  GET_PAYROLL_DETAILS: (id: string) => `/api/web/payroll/${id}/details`,
  GET_REIMBURSEMENT_HISTORY: '/api/web/reimbursement/history',
  APPLY_REIMBURSEMENT: '/api/web/reimbursement/apply',
  CANCEL_REIMBURSEMENT: (id: string) => `/api/web/reimbursement/${id}`,

};