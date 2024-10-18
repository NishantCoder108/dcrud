// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DcrudIDL from '../target/idl/dcrud.json'
import type { Dcrud } from '../target/types/dcrud'

// Re-export the generated IDL and type
export { Dcrud, DcrudIDL }

// The programId is imported from the program IDL.
export const DCRUD_PROGRAM_ID = new PublicKey(DcrudIDL.address)

// This is a helper function to get the Dcrud Anchor program.
export function getDcrudProgram(provider: AnchorProvider) {
  return new Program(DcrudIDL as Dcrud, provider)
}

// This is a helper function to get the program ID for the Dcrud program depending on the cluster.
export function getDcrudProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Dcrud program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DCRUD_PROGRAM_ID
  }
}
