import { BaaS } from './client';
import { BaasTransaction, PayinResult, PayoutResult } from './payments';

export interface OpenPaymentModalOptions {
  amount: number;
  currency?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  initialPhone?: string;
  onSuccess?: (transaction: BaasTransaction) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface OpenPayoutModalOptions {
  amount: number;
  currency?: string;
  description?: string;
  beneficiaryName?: string;
  initialPhone?: string;
  onSuccess?: (result: PayoutResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export class BaasPay {
  private static instance: BaaS;

  public static initialize(baasInstance: BaaS) {
    this.instance = baasInstance;
  }

  /**
   * Ouvrir le Modal de Paiement Web Universel (Vanilla JS / React / Vue / Angular)
   */
  public static openPaymentModal(options: OpenPaymentModalOptions): void {
    if (!this.instance) {
      console.error('BaasPay: BaaS must be initialized with BaasPay.initialize(baas) first.');
      options.onError?.('BaaS non initialisé');
      return;
    }

    const modalId = 'baas-payment-modal-root';
    let existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const currency = options.currency || 'XAF';
    const feeAmount = Math.round(options.amount * 0.07);

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 999999;
      background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="
        background: #1e293b; color: #fff; width: 100%; max-width: 440px;
        border-radius: 24px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1); position: relative;
      ">
        <button id="baas-modal-close" style="
          position: absolute; top: 18px; right: 18px; background: rgba(255,255,255,0.1);
          border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%;
          cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
        ">✕</button>

        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Paiement Sécurisé BaaS</div>
        <div style="font-size: 28px; font-weight: 800; color: #ffd700; margin-bottom: 6px;">
          ${options.amount.toLocaleString()} ${currency}
        </div>
        ${options.description ? `<div style="font-size: 13px; color: #cbd5e1; margin-bottom: 16px;">${options.description}</div>` : ''}

        <div style="font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px;">Mode de paiement :</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px;">
          <div id="method-momo" class="baas-method-card" data-method="MTN_MOMO" style="
            background: #ffcc00; color: #000; padding: 10px 6px; border-radius: 12px;
            text-align: center; cursor: pointer; font-weight: bold; font-size: 11px;
            border: 2px solid #fff;
          ">💛 MTN MoMo</div>
          <div id="method-om" class="baas-method-card" data-method="ORANGE_MONEY" style="
            background: #0f172a; color: #fff; padding: 10px 6px; border-radius: 12px;
            text-align: center; cursor: pointer; font-weight: bold; font-size: 11px;
            border: 1px solid rgba(255,255,255,0.1);
          ">🧡 Orange Money</div>
          <div id="method-card" class="baas-method-card" data-method="CARD" style="
            background: #0f172a; color: #fff; padding: 10px 6px; border-radius: 12px;
            text-align: center; cursor: pointer; font-weight: bold; font-size: 11px;
            border: 1px solid rgba(255,255,255,0.1);
          ">💳 Carte / VISA</div>
        </div>

        <div id="phone-container" style="margin-bottom: 14px;">
          <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px;">Numéro Mobile Money (+237)</label>
          <div style="display: flex; align-items: center; background: #0f172a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); padding: 0 12px;">
            <span style="color: #ffd700; font-weight: bold; font-size: 14px; margin-right: 8px;">+237</span>
            <input id="baas-pay-phone" type="tel" placeholder="6XXXXXXXX" value="${options.initialPhone || ''}" style="
              width: 100%; background: transparent; border: none; outline: none;
              color: #fff; padding: 12px 0; font-size: 15px; font-weight: bold;
            " />
          </div>
        </div>

        <div style="
          display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;
          background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; margin-bottom: 16px;
        ">
          <span>Frais de service BaaS (7%) :</span>
          <span style="color: #fff; font-weight: bold;">${feeAmount} ${currency}</span>
        </div>

        <div id="baas-status-box" style="display: none; padding: 12px; background: #0f172a; border-radius: 12px; border: 1px solid #ffd700; margin-bottom: 16px; text-align: center;">
          <div style="font-size: 13px; font-weight: bold; color: #ffd700; margin-bottom: 4px;">Validation sur téléphone...</div>
          <div id="baas-ussd-prompt" style="font-size: 11px; color: #cbd5e1;">Veuillez valider le message sur votre téléphone.</div>
        </div>

        <button id="baas-pay-submit" style="
          width: 100%; background: #ffd700; color: #000; border: none;
          padding: 14px; border-radius: 14px; font-size: 15px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
        ">Payer ${options.amount.toLocaleString()} ${currency}</button>
      </div>
    `;

    document.body.appendChild(overlay);

    let selectedMethod = 'MTN_MOMO';

    // Methods tabs
    overlay.querySelectorAll('.baas-method-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedMethod = card.getAttribute('data-method') || 'MTN_MOMO';
        overlay.querySelectorAll('.baas-method-card').forEach((c) => {
          (c as HTMLElement).style.background = '#0f172a';
          (c as HTMLElement).style.color = '#fff';
          (c as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)';
        });
        (card as HTMLElement).style.background = selectedMethod === 'MTN_MOMO' ? '#ffcc00' : selectedMethod === 'ORANGE_MONEY' ? '#ff6600' : '#1a1f71';
        (card as HTMLElement).style.color = selectedMethod === 'MTN_MOMO' ? '#000' : '#fff';
        (card as HTMLElement).style.border = '2px solid #fff';
      });
    });

    // Close handler
    const closeBtn = document.getElementById('baas-modal-close');
    closeBtn?.addEventListener('click', () => {
      overlay.remove();
      options.onCancel?.();
    });

    // Submit handler
    const submitBtn = document.getElementById('baas-pay-submit') as HTMLButtonElement;
    submitBtn?.addEventListener('click', async () => {
      const phoneInput = document.getElementById('baas-pay-phone') as HTMLInputElement;
      const phone = phoneInput?.value.trim();

      if (selectedMethod !== 'CARD' && (!phone || phone.length < 9)) {
        alert('Veuillez saisir un numéro de téléphone valide (9 chiffres)');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Initialisation...';

      try {
        const payinRes = await this.instance.payments.initiatePayin({
          amount: options.amount,
          paymentMethod: selectedMethod,
          phone,
          customerName: options.customerName,
          customerEmail: options.customerEmail,
          description: options.description,
          currency,
        });

        const statusBox = document.getElementById('baas-status-box');
        const ussdPrompt = document.getElementById('baas-ussd-prompt');
        if (statusBox && ussdPrompt) {
          statusBox.style.display = 'block';
          ussdPrompt.textContent = payinRes.ussd_prompt || 'Confirmez sur votre mobile.';
        }

        submitBtn.textContent = 'En attente de confirmation...';

        // Poll
        this.instance.payments
          .pollTransaction(payinRes.reference)
          .then((tx) => {
            overlay.remove();
            options.onSuccess?.(tx);
          })
          .catch((err) => {
            submitBtn.disabled = false;
            submitBtn.textContent = `Réessayer (${options.amount} ${currency})`;
            options.onError?.(err.message || 'Échec du paiement');
          });
      } catch (err: any) {
        submitBtn.disabled = false;
        submitBtn.textContent = `Payer ${options.amount} ${currency}`;
        options.onError?.(err.message || 'Erreur d\'initiation');
      }
    });
  }
}
