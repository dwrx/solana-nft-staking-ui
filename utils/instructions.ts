import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js"

export function createInitializeStakeAccountInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([0]),
  })
}

export function createStakingInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  tokenProgram: PublicKey,
  metadataProgram: PublicKey,
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )
  const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )

  /*
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let nft_mint = next_account_info(account_info_iter)?;
    let nft_edition = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let program_authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;
  */

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: delegateAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgram,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([1]),
  })
}

export function createClaimInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey,
  nftMint: PublicKey,
  rewardMint: PublicKey,
  userRewardATA: PublicKey,
  tokenProgram: PublicKey,
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )
  const [mintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )

  /*
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let stake_mint = next_account_info(account_info_iter)?;
    let stake_authority = next_account_info(account_info_iter)?;
    let user_stake_ata = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
  */

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: rewardMint, // nftMint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mintAuthority,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userRewardATA,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([2]),
  })
}

export function createUnstakeInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  stakeMint: PublicKey,
  userStakeATA: PublicKey,
  tokenProgram: PublicKey,
  metadataProgram: PublicKey,
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )
  const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )
  const [mintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: delegateAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeMint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mintAuth,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userStakeATA,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgram,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([3]),
  })
}
