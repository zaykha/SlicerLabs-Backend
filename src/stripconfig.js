import stripeLib from 'stripe';

// Replace 'sk_test_XXXXXXXXXXXXXXXXXXXXXX' with your actual Stripe secret key
const stripe = stripeLib('sk_test_51NXRyMLJRenTchxdEmGyQ9LOriDQP0Sud0CtDzL1w4xe6Wyq2mZ7i3isrnaasBh7NzNTOys78JN4cVatfr20WROL00v2mShwZG');

export default stripe;
