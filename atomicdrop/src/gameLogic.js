// src/gameLogic.js

/**
 * Uses the Web Crypto API to generate a cryptographically secure random string.
 * @returns {Promise<string>} A 64-character hex string.
 */
export async function generateServerSeed() {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a string using SHA-256.
 * @param {string} str The string to hash.
 * @returns {Promise<string>} The hex-encoded hash.
 */
export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates the outcome of a Plinko drop based on seeds and nonce.
 * This uses an HMAC-based approach to combine seeds, which is a standard for provably fair systems.
 *
 * @param {string} serverSeed - The secret seed from the server.
 * @param {string} clientSeed - The public seed from the client.
 * @param {number} nonce - An incrementing number for each bet.
 * @param {number} rows - The number of rows in the Plinko pyramid.
 * @returns {Promise<{ path: number[], bucket: number }>} The path (0 for left, 1 for right) and the final bucket index.
 */
export async function getPlinkoOutcome(serverSeed, clientSeed, nonce, rows) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(serverSeed),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${clientSeed}-${nonce}`)
  );

  const hex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');

  const path = [];
  let bucket = 0;

  for (let i = 0; i < rows; i++) {
    // If we run out of hex characters, we can re-hash to get more.
    // For now, a single SHA-256 hash (64 hex chars) is enough for up to 64 rows.
    if (i >= hex.length) {
      // This is a fallback and shouldn't be hit with typical row counts.
      // A more robust implementation might use a seedable PRNG.
      console.warn("Ran out of hex characters for path generation. Using a simple fallback.");
      const move = Math.round(Math.random());
      path.push(move);
      if (move === 1) {
        bucket++;
      }
      continue;
    }

    const char = hex[i];
    const value = parseInt(char, 16);

    // Even value goes right, odd goes left
    if (value % 2 === 0) {
      path.push(1); // 1 for right
      bucket++;
    } else {
      path.push(0); // 0 for left
    }
  }

  return { path, bucket };
}


// As per the implementation plan, the multipliers are based on risk level.
// Since the exact formula for risk is not defined, we use a standard lookup table
// which is common practice for Plinko games. This provides clear, predictable payout structures.
const MULTIPLIERS = {
  8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
  9: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
  10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
  11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
  12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
  13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
  14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
  15: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
  16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
};


/**
 * Calculates the payout multipliers for each slot.
 *
 * @param {number} rows - The number of rows in the pyramid.
 * @returns {number[]} An array of multipliers for the `rows + 1` buckets.
 */
export function calculateMultipliers(rows) {
  if (MULTIPLIERS[rows]) {
    return MULTIPLIERS[rows];
  }

  // Fallback for unsupported row counts, though the UI should prevent this.
  console.warn(`No predefined multipliers for ${rows} rows. Using a fallback calculation.`);
  const multipliers = [];
  const n = rows;
  const totalOutcomes = Math.pow(2, n);

  // Helper to calculate combinations (nCk)
  function combinations(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = res * (n - i + 1) / i;
    }
    return Math.round(res);
  }

  for (let k = 0; k <= n; k++) {
    const probability = combinations(n, k) / totalOutcomes;
    if (probability === 0) {
      multipliers.push(0);
      continue;
    }
    const multiplier = 1 / probability;
    multipliers.push(multiplier);
  }

  return multipliers;
}
