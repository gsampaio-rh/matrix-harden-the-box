export const SMITH_FLAVOR: Record<
  string,
  { before: string; blocked: string; passed: string }
> = {
  "NET-01": {
    before: "Testing your perimeter...",
    blocked: "Your walls hold. For now.",
    passed: "Wide open. How disappointing.",
  },
  "NET-02": {
    before: "Reaching for the API server...",
    blocked: "Denied. You learned something.",
    passed: "Full API access. Careless.",
  },
  "NET-03": {
    before: "Opening a backdoor...",
    blocked: "Can't get in. Well done.",
    passed: "Backdoor established.",
  },
  "RBAC-01": {
    before: "Looking beyond your namespace...",
    blocked: "Locked to your namespace. Good.",
    passed: "I can see everything.",
  },
  "RBAC-02": {
    before: "Reading your secrets...",
    blocked: "Secrets are safe. This time.",
    passed: "Your secrets are mine.",
  },
  "RBAC-03": {
    before: "Deleting your resources...",
    blocked: "Permission denied. Smart.",
    passed: "Resources deleted.",
  },
  "SEC-01": {
    before: "Writing to your filesystem...",
    blocked: "Read-only. Thorough.",
    passed: "Filesystem is writable.",
  },
  "SEC-02": {
    before: "Checking your privileges...",
    blocked: "Non-root. Good discipline.",
    passed: "Running as root. Reckless.",
  },
  "ESC-01": {
    before: "Attempting kernel escape...",
    blocked: "Isolated kernel. This is security.",
    passed: "Shared kernel. No sandbox can save you here.",
  },
};

export const CATEGORY: Record<string, string> = {
  "NET-01": "Network",
  "NET-02": "Network",
  "NET-03": "Network",
  "RBAC-01": "RBAC",
  "RBAC-02": "RBAC",
  "RBAC-03": "RBAC",
  "SEC-01": "SecurityContext",
  "SEC-02": "SecurityContext",
  "ESC-01": "Kernel",
};

export const ACHIEVEMENTS: Record<
  string,
  { label: string; icon: string; description: string; howToEarn: string }
> = {
  network_guardian: {
    label: "Network Guardian",
    icon: "🛡",
    description: "All network probes blocked",
    howToEarn: "Choose the best option for both Network scenarios",
  },
  rbac_master: {
    label: "RBAC Master",
    icon: "🔑",
    description: "All RBAC probes blocked",
    howToEarn: "Choose the best option for both RBAC scenarios",
  },
  lockdown: {
    label: "Lockdown",
    icon: "🔒",
    description: "All security context probes blocked",
    howToEarn: "Choose the best option for all SecurityContext scenarios",
  },
  perfect_score: {
    label: "Perfect Score",
    icon: "⭐",
    description: "Maximum points achieved",
    howToEarn: "Select the best answer for every scenario",
  },
  first_blood: {
    label: "First Blood",
    icon: "⚡",
    description: "First team to submit defenses",
    howToEarn: "Be the first team to submit answers",
  },
};
