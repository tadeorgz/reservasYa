export function isBusinessActive(business) {
    if (!business) return false;

    if (business.subscription_status === 'active') {
        return true;
    }

    if (business.subscription_status === 'trial') {
        return new Date(business.trial_ends_at) > new Date();
    }

    return false;
}

export function getTrialDaysLeft(business) {
    if (!business?.trial_ends_at) return 0;

    const now = new Date();
    const trialEnd = new Date(business.trial_ends_at);

    const diffMs = trialEnd - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 0);
}