'use client'

import {getDcrudProgram, getDcrudProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useDcrudProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getDcrudProgramId(cluster.network as Cluster), [cluster])
  const program = getDcrudProgram(provider)

  const accounts = useQuery({
    queryKey: ['dcrud', 'all', { cluster }],
    queryFn: () => program.account.dcrud.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['dcrud', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ dcrud: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useDcrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useDcrudProgram()

  const accountQuery = useQuery({
    queryKey: ['dcrud', 'fetch', { cluster, account }],
    queryFn: () => program.account.dcrud.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['dcrud', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ dcrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['dcrud', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ dcrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['dcrud', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ dcrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['dcrud', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ dcrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
