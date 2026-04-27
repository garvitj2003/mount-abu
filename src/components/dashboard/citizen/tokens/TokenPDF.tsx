/* eslint-disable @next/next/no-img-element */
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { type components } from "@/types/api";

type TokenDetailResponse = components["schemas"]["TokenDetailResponse"];

interface TokenPDFProps {
  token: TokenDetailResponse;
  componentRef: React.RefObject<HTMLDivElement | null>;
}

const TokenPDF: React.FC<TokenPDFProps> = ({ token, componentRef }) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  };

  const validity = token.valid_from && token.valid_till
    ? `${formatDate(token.valid_from)} - ${formatDate(token.valid_till)}`
    : "—";

  return (
    <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
      <div
        ref={componentRef}
        style={{
          width: '800px',
          backgroundColor: 'white',
          padding: '40px',
          fontFamily: 'var(--font-onest), sans-serif',
          color: '#343434',
          position: 'relative'
        }}
      >
        {/* Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.05,
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <img src="/images/footer/logo.png" alt="" style={{ width: '400px' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '24px', marginBottom: '32px' }}>
            <img src="/images/footer/logo.png" alt="Logo" style={{ height: '80px', width: 'auto', marginBottom: '16px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', margin: 0 }}>
              Office of the Sub-Divisional Officer (S.D.M.), Mount Abu
            </h1>
          </div>

          {/* Top Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontWeight: '700' }}>Serial No:</span>
              <span>{token.application_number}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <span style={{ fontWeight: '700' }}>Date:</span>
              <span>{formatDate(token.authority.issued_on)}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontWeight: '700' }}>Phase:</span>
              <span>{token.phase}</span>
            </div>
          </div>

          {/* Applicant Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontWeight: '700', minWidth: '220px' }}>Name & Address of Applicant</span>
              <span style={{ flex: 1 }}>{token.applicant_name}, {token.property_address}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontWeight: '700', minWidth: '220px' }}>Name of Work</span>
              <span style={{ flex: 1 }}>{token.application_type} - {token.property_usage}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontWeight: '700', minWidth: '220px' }}>Name of Contractor</span>
              <span style={{ flex: 1 }}>—</span>
            </div>
          </div>

          {/* Materials Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', textAlign: 'left', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: '700', fontSize: '14px', color: '#6B7280', textTransform: 'uppercase' }}>Material Type</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', fontSize: '14px', color: '#6B7280', textTransform: 'uppercase' }}>Quantity Entered</th>
              </tr>
            </thead>
            <tbody>
              {token.materials.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px' }}>{m.material_name}</td>
                  <td style={{ padding: '12px 16px' }}>{m.approved_quantity} {m.unit}</td>
                </tr>
              ))}
              {token.materials.length === 0 && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={2} style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic' }}>No materials listed</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Destination */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
            <span style={{ fontWeight: '700', minWidth: '220px' }}>Destination of Material</span>
            <span style={{ flex: 1 }}>{token.property_address}</span>
          </div>

          {/* Bottom Section with QR Code */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: '700' }}>Serial No:</span>
                <span>{token.token_number}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: '700' }}>Validity:</span>
                <span>{validity}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: '700' }}>Date:</span>
                <span>{formatDateTime(token.authority.issued_on)}</span>
              </div>

              {/* Signature Box */}
              <div style={{ marginTop: '32px', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '350px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', lineHeight: '1.4' }}>
                  <p style={{ margin: 0 }}>Digitally Signed by</p>
                  <p style={{ fontWeight: '700', margin: '2px 0' }}>{token.authority.issued_by || "Authority Name"}</p>
                  <p style={{ margin: 0 }}>Department</p>
                  <p style={{ margin: 0 }}>Date {formatDateTime(token.authority.issued_on)}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <img src="/dashboard/icons/done-tick.svg" alt="Signed" style={{ width: '40px', height: '40px' }} />
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #E5E7EB', padding: '8px', backgroundColor: 'white' }}>
              <QRCodeSVG 
                value={token.transport_code} 
                size={150}
                level="H"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Construction material can enter through the checkpoint (Naka) from 09:30 AM to 06:00 PM.</li>
              <li>If any material is found entering at night, action will be taken according to the rules.</li>
              <li>The Bill/Bilty (transport receipt) must accompany the token.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPDF;
