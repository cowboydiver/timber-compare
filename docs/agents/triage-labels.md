# Triage Labels

## State roles

| Role | Label string |
|---|---|
| Maintainer needs to evaluate | `needs-triage` |
| Waiting on reporter | `needs-info` |
| Ready for AFK agent | `ready-for-agent` |
| Needs human implementation | `ready-for-human` |
| Won't be actioned | `wontfix` |

## Category roles

| Role | Label string |
|---|---|
| Something is broken | `bug` |
| New feature or improvement | `enhancement` |

## Usage

Apply labels with the `gh` CLI:

```bash
gh issue edit <number> --add-label "needs-triage"
gh issue edit <number> --remove-label "needs-triage" --add-label "ready-for-agent"
```
