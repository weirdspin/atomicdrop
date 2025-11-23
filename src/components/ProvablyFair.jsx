import React from 'react';

const ProvablyFair = ({ serverSeed, clientSeed, nonce }) => {
  return (
    <div className="provably-fair">
      <h2>Provably Fair</h2>
      <p>Server Seed: {serverSeed}</p>
      <p>Client Seed: {clientSeed}</p>
      <p>Nonce: {nonce}</p>
      {/* Add more provably fair details here later */}
    </div>
  );
};

export default ProvablyFair;
