import { redis } from './cache'

type Account = {
  isPrivate: boolean
}

const newAccount = () =>
  ({
    isPrivate: false
  } satisfies Account)

/**
 * Fetches the account settings for a user.
 * @param user string
 * @returns Promise<Account>
 */
export async function fetchAccount(user: string) {
  return (await redis.get<Account>(`account:${user.toLowerCase()}`)) ?? newAccount()
}

/**
 * Sets the account settings for a user.
 * @param user string
 * @param Account account
 * @returns Promise<Account | "OK" | null>
 */
export async function updateAccount(user: string, account: Account) {
  return await redis.set(`account:${user.toLowerCase()}`, account)
}
