
const { chapaSecret, clientUrl } = require('../config/env');
const AppError = require('../utils/AppError');

const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

function formatChapaError(data) {
  if (!data) {
    return 'Empty response from Chapa';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data.message === 'string') {
    return data.message;
  }

  if (Array.isArray(data.message)) {
    return data.message.join(', ');
  }

  if (data.message && typeof data.message === 'object') {
    return JSON.stringify(data.message);
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  if (data.error && typeof data.error === 'object') {
    return JSON.stringify(data.error);
  }

  return JSON.stringify(data);
}


/**
 * Initialize Chapa payment
 */
async function initializePayment(order) {
  // ==========================================
  // MOCK MODE
  // ==========================================

  if (chapaSecret === 'MOCK' || !chapaSecret) {
    const tx_ref = `MOCK-${order.id}-${Date.now()}`;

    console.log(
      '🧪 MOCK Chapa',
      '| order:',
      order.order_number,
      '| total:',
      order.total
    );

    return {
      checkout_url:
        `${clientUrl}/orders/${order.tracking_token}` +
        `?mock_paid=1&tx_ref=${tx_ref}`,

      tx_ref,
    };
  }


  // ==========================================
  // VALIDATE SECRET KEY
  // ==========================================

  if (
    !chapaSecret.startsWith('CHASECK_TEST-') &&
    !chapaSecret.startsWith('CHASECK-')
  ) {
    console.error(
      '❌ Invalid Chapa secret key format.'
    );

    console.error(
      'Received prefix:',
      chapaSecret.substring(0, 15)
    );

    throw new AppError(
      'Invalid Chapa secret key. Use the TEST SECRET KEY, not the public key.',
      400
    );
  }


  // ==========================================
  // CREATE UNIQUE TRANSACTION REFERENCE
  // ==========================================

  const tx_ref =
    `chapa-${order.id}-${Date.now()}`;


  // ==========================================
  // CUSTOMER INFORMATION
  // ==========================================

  const customerName =
    order.customer_name || 'Guest User';

  const nameParts =
    customerName.trim().split(/\s+/);

  const firstName =
    nameParts[0] || 'Guest';

  const lastName =
    nameParts.slice(1).join(' ') || 'User';


  // ==========================================
  // REQUEST BODY
  // ==========================================

 const body = {
  amount: String(order.total),
  currency: 'ETB',

  // Use a real customer email when available
  email: order.customer_email || 'customer@gmail.com',

  first_name: order.customer_name?.split(' ')[0] || 'Guest',

  last_name:
    order.customer_name?.split(' ').slice(1).join(' ') || 'User',

  phone_number: order.customer_phone || '0911000000',

  tx_ref,

  callback_url: `${clientUrl}/orders/${order.tracking_token}`,

  return_url: `${clientUrl}/orders/${order.tracking_token}`,

  customization: {
    title: 'Restaurant Order',
    description: `Order ${order.order_number}`,
  },
};


  console.log('--------------------------------');
  console.log('💳 CHAPA INITIALIZATION');
  console.log('--------------------------------');
  console.log('Endpoint:', `${CHAPA_BASE_URL}/transaction/initialize`);
  console.log('Order:', order.order_number);
  console.log('Amount:', body.amount);
  console.log('Currency:', body.currency);
  console.log('TX Ref:', tx_ref);
  console.log(
    'Secret prefix:',
    chapaSecret.substring(0, 15)
  );
  console.log('--------------------------------');


  // ==========================================
  // SEND REQUEST
  // ==========================================

  let res;

  try {
    res = await fetch(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${chapaSecret}`,

          'Content-Type':
            'application/json',

          Accept:
            'application/json',
        },

        body: JSON.stringify(body),

        // Abort after 20 seconds
        signal: AbortSignal.timeout(20000),
      }
    );
  } catch (error) {
    console.error('--------------------------------');
    console.error('❌ CHAPA NETWORK ERROR');
    console.error('--------------------------------');

    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Cause:', error.cause);

    console.error('--------------------------------');

    throw new AppError(
      'Cannot connect to Chapa. Check your internet connection, firewall, VPN/proxy, or ISP access to api.chapa.co.',
      502
    );
  }


  // ==========================================
  // READ RESPONSE SAFELY
  // ==========================================

  let data;

  try {
    data = await res.json();
  } catch (error) {
    const text = await res.text().catch(() => '');

    console.error(
      '❌ Chapa returned invalid JSON:',
      text
    );

    throw new AppError(
      `Invalid response from Chapa. HTTP ${res.status}`,
      502
    );
  }


  console.log('--------------------------------');
  console.log('📥 CHAPA RESPONSE');
  console.log('HTTP:', res.status);
  console.dir(data, {
    depth: null,
  });
  console.log('--------------------------------');


  // ==========================================
  // CHAPA ERROR
  // ==========================================

  if (!res.ok || data.status !== 'success') {
    const message =
      formatChapaError(data);

    console.error(
      '❌ Chapa rejected payment:',
      message
    );

    throw new AppError(
      `Chapa error: ${message}`,
      res.status || 400
    );
  }


  // ==========================================
  // CHECK CHECKOUT URL
  // ==========================================

  const checkoutUrl =
    data?.data?.checkout_url;

  if (!checkoutUrl) {
    console.error(
      '❌ Chapa did not return checkout_url'
    );

    console.dir(data, {
      depth: null,
    });

    throw new AppError(
      'Chapa payment was initialized but no checkout URL was returned.',
      502
    );
  }


  console.log(
    '✅ Chapa checkout created'
  );

  console.log(
    'Checkout URL:',
    checkoutUrl
  );


  return {
    checkout_url: checkoutUrl,
    tx_ref,
  };
}


/**
 * Verify Chapa payment
 */
async function verifyPayment(txRef) {
  // ==========================================
  // MOCK MODE
  // ==========================================

  if (chapaSecret === 'MOCK' || !chapaSecret) {
    return {
      status: 'success',

      data: {
        status: 'success',
        tx_ref: txRef,
        amount: 0,
      },
    };
  }


  // ==========================================
  // VALIDATE REFERENCE
  // ==========================================

  if (!txRef) {
    throw new AppError(
      'Transaction reference is required.',
      400
    );
  }


  console.log(
    '🔎 Verifying Chapa payment:',
    txRef
  );


  let res;

  try {
    res = await fetch(
      `${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`,
      {
        method: 'GET',

        headers: {
          Authorization:
            `Bearer ${chapaSecret}`,

          Accept:
            'application/json',
        },

        signal: AbortSignal.timeout(20000),
      }
    );
  } catch (error) {
    console.error(
      '❌ Chapa verification network error:',
      error
    );

    throw new AppError(
      'Cannot connect to Chapa for payment verification.',
      502
    );
  }


  let data;

  try {
    data = await res.json();
  } catch (error) {
    throw new AppError(
      `Invalid response from Chapa. HTTP ${res.status}`,
      502
    );
  }


  console.log(
    '🔎 Chapa verification:',
    res.status
  );

  console.dir(data, {
    depth: null,
  });


  if (!res.ok) {
    throw new AppError(
      `Chapa verification error: ${formatChapaError(data)}`,
      res.status
    );
  }


  return data;
}


module.exports = {
  initializePayment,
  verifyPayment,
};