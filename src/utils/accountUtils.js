/**
 * Extracts the account type from an account object.
 * @param {object} account The account object.
 * @returns {string} The account type as an uppercase string, or 'OTHER' if not found.
 */
export const getAccountType = (account) => {
  if (!account) return 'OTHER';

  let type;
  if (account.account_type) {
    type = account.account_type;
  } else if (account.type) {
    type = account.type;
  } else if (account.account_code && account.account_code.type) {
    type = account.account_code.type;
  } else if (account.code && account.code.type) {
    type = account.code.type;
  }

  return (typeof type === 'string' ? type : 'OTHER').toUpperCase();
};