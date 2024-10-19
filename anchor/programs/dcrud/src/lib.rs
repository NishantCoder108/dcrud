#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("6eXbSWpMxbRWi1gyFAU75SaM9nZDBjbL6Cg14Xed79VP"); //it will deploy on onchain program , it will update

#[program]
pub mod dcrud {
    use super::*;

    // Context have all accounts , so we can encapsulate with give custom stuct inside context
    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;

        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;

        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;

        Ok(())
    }

    pub fn delete_journal_entry(
        _ctx: Context<DeleteEntry>,
        title: String,
        _message: String,
    ) -> Result<()> {
        msg!("Journal entry titled {} deleted ", title);
        Ok(())
    }
}

// Here I define the account structure
#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEntry<'info> {
    #[account(
        init,//first time they will initialize
        seeds= [title.as_bytes(),owner.key().as_ref()],
        bump,
        space= 8 +JournalEntryState::INIT_SPACE,
        payer = owner,

    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds= [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + JournalEntryState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true

    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]

pub struct DeleteEntry<'info> {
    #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    close= owner
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
