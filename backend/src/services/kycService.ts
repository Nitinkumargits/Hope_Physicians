import { PrismaClient, KYCDocument, KYCStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * KYC Service - CRUD operations for KYCDocument model
 * Handles document uploads, review, approval, and rejection
 */

export class KYCService {
  /**
   * Create or update KYC documents for a patient
   */
  async submitKYCDocuments(
    patientId: string,
    documents: {
      salarySlip1?: string;
      salarySlip2?: string;
      salarySlip3?: string;
      cancelledCheque?: string;
      passbook?: string;
      aadhaarFront?: string;
      aadhaarBack?: string;
      educationalDoc1?: string;
      educationalDoc2?: string;
      educationalDoc3?: string;
    }
  ): Promise<KYCDocument> {
    // Check if KYC document already exists
    const existing = await prisma.kYCDocument.findFirst({
      where: { patientId },
    });

    if (existing) {
      // Update existing document
      return await prisma.kYCDocument.update({
        where: { id: existing.id },
        data: {
          ...documents,
          status: 'submitted',
          resubmissionRequested: false,
        },
      });
    }

    // Create new document
    const kycDoc = await prisma.kYCDocument.create({
      data: {
        patientId,
        ...documents,
        status: 'submitted',
      },
    });

    // Update patient KYC status
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        kycStatus: 'submitted',
      },
    });

    return kycDoc;
  }

  /**
   * Get KYC documents for a patient
   */
  async getKYCDocumentsByPatient(patientId: string): Promise<KYCDocument | null> {
    return await prisma.kYCDocument.findFirst({
      where: { patientId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            kycStatus: true,
          },
        },
      },
    });
  }

  /**
   * Get all pending KYC documents
   */
  async getPendingKYCDocuments(): Promise<KYCDocument[]> {
    return await prisma.kYCDocument.findMany({
      where: {
        status: {
          in: ['pending', 'submitted', 'under_review'],
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Approve KYC documents
   */
  async approveKYCDocuments(
    kycDocumentId: string,
    reviewedBy: string
  ): Promise<KYCDocument> {
    const kycDoc = await prisma.kYCDocument.update({
      where: { id: kycDocumentId },
      data: {
        status: 'approved',
        reviewedBy,
        reviewedAt: new Date(),
        resubmissionRequested: false,
      },
      include: {
        patient: true,
      },
    });

    // Update patient KYC status
    await prisma.patient.update({
      where: { id: kycDoc.patientId },
      data: {
        kycStatus: 'approved',
      },
    });

    return kycDoc;
  }

  /**
   * Reject KYC documents with remarks
   */
  async rejectKYCDocuments(
    kycDocumentId: string,
    reviewedBy: string,
    rejectionRemarks: string,
    requestResubmission: boolean = true
  ): Promise<KYCDocument> {
    const kycDoc = await prisma.kYCDocument.update({
      where: { id: kycDocumentId },
      data: {
        status: 'rejected',
        reviewedBy,
        reviewedAt: new Date(),
        rejectionRemarks,
        resubmissionRequested: requestResubmission,
      },
      include: {
        patient: true,
      },
    });

    // Update patient KYC status
    await prisma.patient.update({
      where: { id: kycDoc.patientId },
      data: {
        kycStatus: 'rejected',
      },
    });

    return kycDoc;
  }

  /**
   * Mark KYC as under review
   */
  async markUnderReview(kycDocumentId: string, reviewedBy: string): Promise<KYCDocument> {
    return await prisma.kYCDocument.update({
      where: { id: kycDocumentId },
      data: {
        status: 'under_review',
        reviewedBy,
        reviewedAt: new Date(),
      },
    });
  }

  /**
   * Get KYC document by ID
   */
  async getKYCDocumentById(id: string): Promise<KYCDocument | null> {
    return await prisma.kYCDocument.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });
  }
}

export default new KYCService();

