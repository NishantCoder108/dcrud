#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod dcrud {
    use super::*;

  pub fn close(_ctx: Context<CloseDcrud>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dcrud.count = ctx.accounts.dcrud.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dcrud.count = ctx.accounts.dcrud.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDcrud>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.dcrud.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDcrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Dcrud::INIT_SPACE,
  payer = payer
  )]
  pub dcrud: Account<'info, Dcrud>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDcrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub dcrud: Account<'info, Dcrud>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub dcrud: Account<'info, Dcrud>,
}

#[account]
#[derive(InitSpace)]
pub struct Dcrud {
  count: u8,
}
