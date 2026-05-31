import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '403 — Access Denied | VaultPay',
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-vault-bg flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vault-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg animate-fade-in">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-vault-red/10 rounded-full flex items-center justify-center border border-vault-red/20">
              <div className="w-20 h-20 bg-vault-red/15 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-vault-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                </svg>
              </div>
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full border border-vault-red/20 animate-ping opacity-30" />
          </div>
        </div>

        {/* Code */}
        <div className="inline-flex items-center gap-2 bg-vault-red/10 border border-vault-red/30 rounded-full px-4 py-1.5 mb-4">
          <span className="text-vault-red text-xs font-bold tracking-widest uppercase">
            HTTP 403
          </span>
        </div>

        <h1 className="text-4xl font-bold text-vault-text mb-3">Access Denied</h1>
        <p className="text-vault-subtle text-base mb-2">
          You do not have permission to access this resource.
        </p>
        <p className="text-vault-muted text-sm mb-10">
          This area is restricted to <strong className="text-vault-gold">Administrators</strong> only.
          Your access attempt has been logged for security purposes.
        </p>

        {/* Security notice */}
        <div className="bg-vault-card border border-vault-border rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-vault-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-vault-muted text-xs font-semibold uppercase tracking-wider">Security Notice</span>
          </div>
          {[
            'Your role does not permit access to admin resources',
            'This access attempt has been recorded',
            'Contact your administrator if you need elevated access',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-vault-subtle text-sm">
              <div className="w-1 h-1 rounded-full bg-vault-muted mt-2 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/client/dashboard"
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white
              bg-gradient-blue shadow-glow hover:shadow-[0_0_32px_rgba(37,99,235,0.5)]
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
            "
          >
            Go to My Dashboard
          </a>
          <a
            href="/login"
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
              text-vault-subtle border border-vault-border
              hover:border-vault-blue/40 hover:text-vault-text
              transition-all duration-200
            "
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
