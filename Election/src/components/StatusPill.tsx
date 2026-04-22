import type { ElectionStatus } from '../api/types'

export function StatusPill({ status }: { status: ElectionStatus }) {
  const cls =
    status === 'PENDING'
      ? 'pill pillPending'
      : status === 'STARTED'
        ? 'pill pillStarted'
        : 'pill pillEnded'

  return <span className={cls}>{status}</span>
}

