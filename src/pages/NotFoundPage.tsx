import { ButtonLink } from '../components/ui/Button.tsx'
import { PageScaffold } from '../components/layout/PageScaffold.tsx'

export function NotFoundPage() {
  return (
    <PageScaffold
      title="Page not found"
      description="That page is not part of this sample site."
    >
      <ButtonLink to="/" variant="secondary">
        Back to home
      </ButtonLink>
    </PageScaffold>
  )
}
