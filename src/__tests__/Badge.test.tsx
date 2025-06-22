import { render } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('<Badge />', () => {
  it('renders correctly with default variant', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders correctly with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(container.firstChild).toMatchSnapshot()
  })
})
