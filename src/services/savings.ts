import { authFetch } from './auth';

// DTO mappers
export function mapAccountDTO(a: any) {
  if (!a) return null;
  return {
    id: a.id || a._id || a.accountId,
    accountNumber: a.accountNumber,
    accountType: a.accountType,
    balance: Number(a.balance ?? 0),
    minimumBalance: Number(a.minimumBalance ?? 0),
    isVerified: !!a.isVerified,
    createdAt: a.createdAt,
  };
}

export function mapTransactionsDTO(resp: any) {
  const list = resp?.data?.transactions || resp?.data || resp || [];
  return list.map((t: any) => ({
    id: t._id || t.transactionId,
    type: t.type,
    amount: Number(t.amount ?? 0),
    balanceAfter: Number(t.balanceAfter ?? 0),
    description: t.description,
    status: t.status,
    createdAt: t.createdAt,
  }));
}

export async function getAccountProducts() {
  return authFetch('/account-products/active');
}

export async function createMySavingsAccount(params: { productId?: string; accountType?: string; minimumBalance?: number; interestRate?: number; }) {
  return authFetch('/customer/savings-accounts', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getMySavingsAccounts() {
  return authFetch('/customer/savings-accounts/mine');
}

export async function getAccountHistory(accountId: string, page = 1, limit = 20) {
  return authFetch(`/customer/transactions/account/${accountId}?page=${page}&limit=${limit}`);
}

export async function deposit(accountId: string, amount: number, description?: string) {
  return authFetch('/customer/transactions/deposit', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function withdraw(accountId: string, amount: number, description?: string) {
  return authFetch('/customer/transactions/withdrawal', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getTransactionSummary(startDate?: string, endDate?: string) {
  let url = '/customer/transactions/summary';
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return authFetch(url);
}

export async function getAllMyTransactions(page = 1, limit = 50) {
  return authFetch(`/customer/transactions?page=${page}&limit=${limit}`);
}
