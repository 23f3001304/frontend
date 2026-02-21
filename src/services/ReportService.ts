/**
 * @module services/ReportService
 * OOP service layer for report generation & export operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

/* ─── Service ─── */

class ReportService {
  private static instance: ReportService;

  private constructor() {}

  static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  /** [TODO] Generate and return a PDF fleet report Blob. */
  async exportFleetPDF(): Promise<Blob> {
    console.log("[ReportService] exportFleetPDF");
    return Promise.resolve(
      new Blob(["%PDF-1.4 stub"], { type: "application/pdf" })
    );
  }

  /** [TODO] Generate a dashboard summary PDF. */
  async exportDashboardPDF(): Promise<Blob> {
    console.log("[ReportService] exportDashboardPDF");
    return Promise.resolve(
      new Blob(["%PDF-1.4 stub"], { type: "application/pdf" })
    );
  }
}

export const reportService = ReportService.getInstance();
export default ReportService;
