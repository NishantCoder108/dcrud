import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Dcrud} from '../target/types/dcrud'

describe('dcrud', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Dcrud as Program<Dcrud>

  const dcrudKeypair = Keypair.generate()

  it('Initialize Dcrud', async () => {
    await program.methods
      .initialize()
      .accounts({
        dcrud: dcrudKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([dcrudKeypair])
      .rpc()

    const currentCount = await program.account.dcrud.fetch(dcrudKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Dcrud', async () => {
    await program.methods.increment().accounts({ dcrud: dcrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.dcrud.fetch(dcrudKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Dcrud Again', async () => {
    await program.methods.increment().accounts({ dcrud: dcrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.dcrud.fetch(dcrudKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Dcrud', async () => {
    await program.methods.decrement().accounts({ dcrud: dcrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.dcrud.fetch(dcrudKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set dcrud value', async () => {
    await program.methods.set(42).accounts({ dcrud: dcrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.dcrud.fetch(dcrudKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the dcrud account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        dcrud: dcrudKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.dcrud.fetchNullable(dcrudKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
